const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is not configured");
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Welcome to PrepArena!\n\nPrepare • Practice • Perform 🚀\n\nWhat would you like to do?",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🌐 Open PrepArena",
              url: "https://preparena.bolt.host"
            }
          ],
          [
            { text: "📝 Available Tests", callback_data: "tests" },
            { text: "📊 My Results", callback_data: "results" }
          ],
          [
            { text: "👤 My Profile", callback_data: "profile" }
          ]
        ]
      }
    }
  );
});
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "📚 PrepArena Help\n\nUse /start to begin."
  );
});
bot.onText(/\/tests/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "📝 Available Tests\n\nAbhi koi test available nahi hai.\n\nPrepArena par naye tests jaldi add honge! 🚀"
  );
});
bot.onText(/\/results/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "📊 My Results\n\nAbhi aapke koi results available nahi hain.\n\nTest complete karne ke baad yahan results dikhenge. 🚀"
  );
});
bot.onText(/\/profile/, (msg) => {
  const name = msg.from.first_name || "Student";
  const username = msg.from.username
    ? `@${msg.from.username}`
    : "Not set";

  bot.sendMessage(
    msg.chat.id,
    `👤 My Profile\n\nName: ${name}\nUsername: ${username}\n\nPrepArena 🚀`
  );
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "tests") {
    bot.sendMessage(chatId, "📝 Available Tests\n\nAbhi koi test available nahi hai.");
  }

  if (query.data === "results") {
    bot.sendMessage(chatId, "📊 My Results\n\nAbhi koi results available nahi hain.");
  }

  if (query.data === "profile") {
    const name = query.from.first_name || "Student";
    const username = query.from.username
      ? `@${query.from.username}`
      : "Not set";

    bot.sendMessage(
      chatId,
      `👤 My Profile\n\nName: ${name}\nUsername: ${username}`
    );
  }

  bot.answerCallbackQuery(query.id);
});

console.log("🤖 PrepArena Bot is running...");
