import { db } from "../db/index";
import { chatSessions } from "../db/schema";

async function checkSessions() {
  try {
    const sessions = await db.select().from(chatSessions);
    console.log("Found sessions:", sessions.length);
    sessions.forEach(s => {
      console.log(`ID: ${s.id}, Title: ${s.title}, MsgCount: ${Array.isArray(s.messages) ? s.messages.length : 'N/A'}`);
    });
  } catch (e) {
    console.error("DB Error:", e);
  }
  process.exit(0);
}

checkSessions();
