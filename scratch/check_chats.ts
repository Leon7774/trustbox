import { db } from "../db";
import { chatSessions } from "../db/schema";

async function checkChats() {
  const chats = await db.select().from(chatSessions);
  console.log("Current Chat Sessions in DB:");
  console.dir(chats, { depth: null });
}

checkChats();
