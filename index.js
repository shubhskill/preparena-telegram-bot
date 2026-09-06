const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is not configured");
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Welcome to PrepArena!\n\nPrepare • Practice • Perform 🚀"
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

console.log("🤖 PrepArena Bot is running...");
