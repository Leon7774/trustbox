import { db } from "../db/index";
import { assessments } from "../db/schema";

async function checkAssessments() {
  try {
    const data = await db.select().from(assessments);
    console.log("Found assessments:", data.length);
    data.forEach(a => {
      console.log(`ID: ${a.id}, UserID: ${a.userId}, Risk: ${a.riskLevel}`);
    });
  } catch (e) {
    console.error("DB Error:", e);
  }
  process.exit(0);
}

checkAssessments();
