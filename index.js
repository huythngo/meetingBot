const fs = require('fs');
const Discord = require('discord.js');
// const { token, prefix, mongoURI } = require('./config/config.json');
require('dotenv').config();

const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
const mongoURI = process.env.MONGO_URI;

const mongoose = require('mongoose');

const client = new Discord.Client({ disableEveryone: false });
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const {
  callUpcomingMeetings,
  deletePastMeetings,
} = require('./actions/UpcomingMeeting');
const { Console } = require('console');

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// connect db and login
(async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  client.login(token);
})();

client.once('ready', () => {
  console.log('Ready!');
  (async () => {
    await callUpcomingMeetings(client);
    await deletePastMeetings();
  })(client);

  setInterval(async () => {
    await callUpcomingMeetings(client);
    await deletePastMeetings();
  }, 3600000);
});

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  // check if command is available
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;
  // check provided args
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // cooldown feature
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});
