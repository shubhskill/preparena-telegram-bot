const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const ADMIN_ID = 8256722518;

if (!token) {
  throw new Error("BOT_TOKEN is not configured");
}

const bot = new TelegramBot(token, { polling: true });

// Stores users who are currently writing a support message
const supportSessions = new Set();


// =========================
// START
// =========================

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Welcome to PrepArena!\n\n" +
    "Prepare • Practice • Perform 🚀\n\n" +
    "What would you like to do?",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📝 Available Tests", callback_data: "tests" },
            { text: "📊 My Results", callback_data: "results" }
          ],
          [
            { text: "👤 My Profile", callback_data: "profile" }
          ],
          [
            { text: "🆘 Support", callback_data: "support" }
          ]
        ]
      }
    }
  );
});


// =========================
// HELP
// =========================

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "📚 PrepArena Help\n\n" +
    "/start - Open main menu\n" +
    "/tests - View available tests\n" +
    "/results - View your results\n" +
    "/profile - View your profile\n" +
    "/support - Contact PrepArena Support"
  );
});


// =========================
// TESTS
// =========================

bot.onText(/\/tests/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "📝 Available Tests\n\n" +
    "Abhi koi test available nahi hai.\n\n" +
    "Naye tests jaldi add honge! 🚀"
  );
});


// =========================
// RESULTS
// =========================

bot.onText(/\/results/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "📊 My Results\n\n" +
    "Abhi koi results available nahi hain.\n\n" +
    "Test complete karne ke baad yahan results dikhenge. 🚀"
  );
});


// =========================
// PROFILE
// =========================

bot.onText(/\/profile/, (msg) => {
  const name = msg.from.first_name || "Student";

  const username = msg.from.username
    ? `@${msg.from.username}`
    : "Not set";

  bot.sendMessage(
    msg.chat.id,
    `👤 My Profile\n\n` +
    `Name: ${name}\n` +
    `Username: ${username}\n` +
    `Telegram ID: ${msg.from.id}\n\n` +
    `PrepArena 🚀`
  );
});


// =========================
// SUPPORT START
// =========================

bot.onText(/\/support/, (msg) => {
  const chatId = msg.chat.id;

  supportSessions.add(chatId);

  bot.sendMessage(
    chatId,
    "🆘 PrepArena Support\n\n" +
    "Apni problem/message yahan bhejo.\n" +
    "Main ise PrepArena Admin tak forward kar dunga.\n\n" +
    "❌ Cancel karna ho to /cancel bhejo."
  );
});


// =========================
// CANCEL SUPPORT
// =========================

bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id;

  if (supportSessions.has(chatId)) {
    supportSessions.delete(chatId);

    bot.sendMessage(
      chatId,
      "❌ Support request cancelled."
    );
  }
});


// =========================
// CALLBACK BUTTONS
// =========================

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "tests") {
    bot.sendMessage(
      chatId,
      "📝 Available Tests\n\n" +
      "Abhi koi test available nahi hai."
    );
  }

  if (query.data === "results") {
    bot.sendMessage(
      chatId,
      "📊 My Results\n\n" +
      "Abhi koi results available nahi hain."
    );
  }

  if (query.data === "profile") {
    const name = query.from.first_name || "Student";

    const username = query.from.username
      ? `@${query.from.username}`
      : "Not set";

    bot.sendMessage(
      chatId,
      `👤 My Profile\n\n` +
      `Name: ${name}\n` +
      `Username: ${username}\n` +
      `Telegram ID: ${query.from.id}\n\n` +
      `PrepArena 🚀`
    );
  }

  if (query.data === "support") {
    supportSessions.add(chatId);

    bot.sendMessage(
      chatId,
      "🆘 PrepArena Support\n\n" +
      "Apni problem/message yahan bhejo.\n" +
      "Main ise PrepArena Admin tak forward kar dunga.\n\n" +
      "❌ Cancel karna ho to /cancel bhejo."
    );
  }

  bot.answerCallbackQuery(query.id);
});


// =========================
// SUPPORT MESSAGE HANDLER
// =========================

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // Ignore commands
  if (!msg.text || msg.text.startsWith("/")) {
    return;
  }

  // Only process messages from users currently in support mode
  if (!supportSessions.has(chatId)) {
    return;
  }

  const name = msg.from.first_name || "Unknown";

  const username = msg.from.username
    ? `@${msg.from.username}`
    : "Not set";

  const userId = msg.from.id;

  const adminMessage =
    "🆘 NEW PREPARENA SUPPORT REQUEST\n\n" +
    `👤 Name: ${name}\n` +
    `🔹 Username: ${username}\n` +
    `🆔 Telegram ID: ${userId}\n\n` +
    "💬 Message:\n" +
    msg.text;

  bot.sendMessage(ADMIN_ID, adminMessage);

  bot.sendMessage(
    chatId,
    "✅ Your message has been forwarded to PrepArena Support.\n\n" +
    "Admin will check your request."
  );

  // End support session after receiving one message
  supportSessions.delete(chatId);
});


// =========================
// BOT STATUS
// =========================

console.log("🤖 PrepArena Bot is running...");
