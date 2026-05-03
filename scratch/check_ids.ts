import { db } from "../db";
import { users, assessments } from "../db/schema";

async function main() {
  const allUsers = await db.select().from(users);
  console.log("Users:", allUsers.map(u => ({ id: u.id, anonymousId: u.anonymousId })));

  const allAssessments = await db.select().from(assessments);
  console.log("Assessments:", allAssessments.map(a => ({ id: a.id, userId: a.userId })));
}

main().catch(console.error);
