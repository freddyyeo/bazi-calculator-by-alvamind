// api/compute.js  (in the *forked bazi repo*)
// runtime must be nodejs for this library
export const config = { runtime: "nodejs" };

import { NextResponse } from "next/server";

// TODO: replace these imports with the actual API from the repo.
// Most BaZi libs expose methods to compute GanZhi pillars & luck cycles.
// If the project exports a class/function, import and call it here.
import { computeBaZiChart } from "../lib/adapter.js"; 
// ^ Create this adapter file if the repo doesn’t export a direct function.
// The adapter should take (dob, time, tz, gender) and return:
// { pillars:{year,month,day,hour}, dayMaster, elementTally, tenGods, decades }

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "method_not_allowed" }, { status: 405 });
    }
    const body = await req.json();
    const { dob, time, tz, gender } = body || {};

    // Validate
    if (!dob || !time || !tz) {
      return NextResponse.json(
        { error: "bad_request", detail: "dob/time/tz required" },
        { status: 400 }
      );
    }

    // Do the actual BaZi compute USING THE REPO YOU FORKED:
    const result = await computeBaZiChart({ dob, time, tz, gender });

    // Always return a stable shape
    return NextResponse.json({
      ok: true,
      ...result, // { pillars, dayMaster, elementTally, tenGods, decades }
    });
  } catch (e) {
    return NextResponse.json(
      { error: "bazi_core_failed", detail: e?.message || String(e) },
      { status: 500 }
    );
  }
}
