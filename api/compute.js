// api/compute.js
const { Solar } = require('lunar-javascript');

const STEM_ELEM = { 甲:'木', 乙:'木', 丙:'火', 丁:'火', 戊:'土', 己:'土', 庚:'金', 辛:'金', 壬:'水', 癸:'水' };
const ELEM_ORDER = ['木','火','土','金','水'];

module.exports = async (req, res) => {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { name='Guest', dob, time='12:00', tz='+08:00', gender='male' } = body;
    if (!dob) return res.status(400).json({ error: 'bad_request', detail: 'dob is required (YYYY-MM-DD)' });

    const [Y,M,D] = dob.split('-').map(Number);
    const [h,m]  = time.split(':').map(Number);

    const solar = Solar.fromYmdHms(Y, M, D, h, m || 0, 0);
    const lunar = solar.getLunar();
    const ec    = lunar.getEightChar();

    const yearGZ  = ec.getYear();
    const monthGZ = ec.getMonth();
    const dayGZ   = ec.getDay();
    const timeGZ  = ec.getTime();

    const dayMaster = dayGZ[0];

    // very simple stem-based element tally
    const stems = [yearGZ[0], monthGZ[0], dayGZ[0], timeGZ[0]];
    const count = { 木:0, 火:0, 土:0, 金:0, 水:0 };
    stems.forEach(s => { const e = STEM_ELEM[s]; if (e) count[e]++; });
    const total = stems.length || 1;
    const pct = Object.fromEntries(ELEM_ORDER.map(e => [e, Math.round((count[e]/total)*100)]));

    const yun = ec.getYun(gender.toLowerCase() === 'male');
    const startYear = yun.getStartYear();
    const decades = yun.getDaYun().map((dy, i) => ({
      idx: i+1,
      gz: dy.getGanZhi ? dy.getGanZhi() : (dy.getGz ? dy.getGz() : ''),
      startYear: dy.getStartYear ? dy.getStartYear() : (startYear + i*10),
    }));

    res.json({
      ok: true,
      name,
      input: { dob, time, tz, gender },
      pillars: {
        year:  { gz: yearGZ },
        month: { gz: monthGZ },
        day:   { gz: dayGZ },
        time:  { gz: timeGZ }
      },
      dayMaster,
      elementTally: { count, pct },
      yun: { startYear, decades }
    });
  } catch (e) {
    res.status(500).json({ error: 'compute_failed', detail: String(e && e.message || e) });
  }
};
