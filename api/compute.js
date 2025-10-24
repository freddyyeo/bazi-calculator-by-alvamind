// /api/compute.js  ← root/api/compute.js
// Node.js Serverless Function

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "method_not_allowed" });
      return;
    }

    const body = typeof req.body === "object" ? req.body
               : JSON.parse(req.body || "{}");

    const { dob, time, tz, gender } = body || {};
    if (!dob || !time || !tz) {
      res.status(400).json({ error: "bad_request", detail: "dob/time/tz required" });
      return;
    }

    // TODO: replace with real results from the open-source BaZi library.
    const result = {
      pillars: {
        year:  { gan: "戊", zhi: "午", gz: "戊午" },
        month: { gan: "丁", zhi: "巳", gz: "丁巳" },
        day:   { gan: "甲", zhi: "戌", gz: "甲戌" },
        hour:  { gan: "己", zhi: "巳", gz: "己巳" }
      },
      dayMaster: "甲",
      elementTally: {
        count: { 木: 2, 火: 1, 土: 1, 金: 0, 水: 0 },
        pct:   { 木: 50, 火: 25, 土: 25, 金: 0, 水: 0 }
      },
      tenGods: { year: "正官", month: "伤官", day: "日主", hour: "偏财" },
      decades: [
        { index: 1, startYear: 1986, startAge: 8,  gz: "丙寅" },
        { index: 2, startYear: 1996, startAge: 18, gz: "丁卯" },
        { index: 3, startYear: 2006, startAge: 28, gz: "戊辰" }
      ]
    };

    res.status(200).json({ ok: true, ...result });
  } catch (e) {
    res.status(500).json({ error: "bazi_core_failed", detail: e?.message || String(e) });
  }
}
