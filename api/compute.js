// CommonJS style so it runs on Node without ESM fuss.
const { Solar } = require('lunar-javascript');

// maps
const STEM_ELEM = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' };
const ELEM_ORDER = ['木','火','土','金','水'];
const STEM_YIN   = { '甲':0,'乙':1,'丙':0,'丁':1,'戊':0,'己':1,'庚':0,'辛':1,'壬':0,'癸':1 }; // 0=阳,1=阴

const TEN_GOD_DESC = {
  比肩:'同我同性：伙伴/自立（宜协作、戒僵硬）',
  劫财:'同我异性：竞争/分财（宜定规则、戒莽进）',
  食神:'我生同性：才华/产出（利内容与产品）',
  伤官:'我生异性：表达/突破（利曝光、戒顶撞）',
  正财:'我克异性：正财/薪资（稳健之财）',
  偏财:'我克同性：偏财/机会（人脉生意之财）',
  正官:'克我异性：规则/职位（名声与秩序）',
  七杀:'克我同性：压力/挑战（逆境成事、忌浮躁）',
  正印:'生我异性：资源/文凭（学历、贵人）',
  偏印:'生我同性：灵感/术数（创新、戒漂移）'
};

function elemProd(a,b){return (a==='木'&&b==='火')||(a==='火'&&b==='土')||(a==='土'&&b==='金')||(a==='金'&&b==='水')||(a==='水'&&b==='木');}
function elemCtrl(a,b){return (a==='木'&&b==='土')||(a==='土'&&b==='水')||(a==='水'&&b==='火')||(a==='火'&&b==='金')||(a==='金'&&b==='木');}

function tenGod(dayStem, otherStem){
  const dE = STEM_ELEM[dayStem], oE = STEM_ELEM[otherStem];
  const samePol = STEM_YIN[dayStem] === STEM_YIN[otherStem];
  if (dE === oE) return samePol ? '比肩' : '劫财';
  if (elemProd(dE,oE)) return samePol ? '食神' : '伤官';
  if (elemProd(oE,dE)) return samePol ? '偏印' : '正印';
  if (elemCtrl(dE,oE)) return samePol ? '偏财' : '正财';
  if (elemCtrl(oE,dE)) return samePol ? '七杀' : '正官';
  return '十神';
}

function toInt(s, def=0){ const n = parseInt(s,10); return Number.isFinite(n)?n:def; }

module.exports = async (req, res) => {
  try {
    // accept JSON POST; also allow query for quick tests
    const body = req.body && Object.keys(req.body).length ? req.body : {};
    const qs   = req.query || {};
    const name   = body.name ?? qs.name ?? 'Guest';
    const dob    = (body.dob ?? qs.dob ?? '').trim();      // YYYY-MM-DD
    const time   = (body.time ?? qs.time ?? '12:00').trim(); // HH:mm (local)
    const tz     = (body.tz ?? qs.tz ?? '+08:00').trim();

    if (!dob) return res.status(400).json({ error:'bad_request', detail:'dob (YYYY-MM-DD) is required' });

    const [Y,M,D] = dob.split('-').map(v=>toInt(v));
    const [h,m]   = time.split(':').map(v=>toInt(v));
    // For lunar-javascript we can feed local civil time; most users mean local clock time already.
    const solar = Solar.fromYmdHms(Y, M, D, h, m, 0);
    const lunar = solar.getLunar();

    const yearGZ  = lunar.getYearInGanZhi();  // e.g. 甲子
    const monthGZ = lunar.getMonthInGanZhi();
    const dayGZ   = lunar.getDayInGanZhi();
    const hourGZ  = lunar.getTimeInGanZhi();

    const pillars = {
      year:  { gz: yearGZ,  gan: yearGZ[0],  zhi: yearGZ[1]  },
      month: { gz: monthGZ, gan: monthGZ[0], zhi: monthGZ[1] },
      day:   { gz: dayGZ,   gan: dayGZ[0],   zhi: dayGZ[1]   },
      hour:  { gz: hourGZ,  gan: hourGZ[0],  zhi: hourGZ[1]  },
    };

    const dayMaster = pillars.day.gan;             // 日主
    const tally = { 木:0,火:0,土:0,金:0,水:0 };
    [pillars.year.gan, pillars.month.gan, pillars.day.gan, pillars.hour.gan]
      .forEach(st => { tally[STEM_ELEM[st]]++; });

    const sum = Object.values(tally).reduce((a,b)=>a+b,0) || 1;
    const pct = Object.fromEntries(ELEM_ORDER.map(e=>[e, +(tally[e]*100/sum).toFixed(1)]));

    const tenGods = {
      年柱: tenGod(dayMaster, pillars.year.gan),
      月柱: tenGod(dayMaster, pillars.month.gan),
      日柱: '日主',
      时柱: tenGod(dayMaster, pillars.hour.gan),
    };

    // simple 10-year luck blocks (from library)
    const yun = lunar.getYun(0); // 0 male default; upstream calc direction internally
    const startYear = solar.getYear() + toInt(yun.getStartYear());
    const decades = Array.from({length:8}).map((_,i)=>{
      const y = startYear + i*10;
      const gz = Solar.fromYmd(y, 1, 1).getLunar().getYearInGanZhi();
      return { index:i+1, startYear:y, gz };
    });

    return res.json({
      ok: true,
      input: { name, dob, time, tz },
      pillars,
      dayMaster,
      elementTally: { tally, pct },
      tenGods,
      yun: { startYear, decades }
    });
  } catch (e) {
    return res.status(500).json({ error:'compute_failed', detail: String(e?.message||e) });
  }
};
