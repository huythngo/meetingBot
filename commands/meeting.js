const { createMeeting } = require('../actions/Meeting');
const { notifyMsg } = require('../msgTemplate/EmbedMsg');
const Meeting = require('../models/Meeting');
module.exports = {
  name: 'meeting',
  description: 'set a new meeting!',
  args: true,
  cooldown: 5,
  aliases: ['m'],
  usage:
    '\n<name> <time> <@users>\n time format: yyyy-mm-ddThh:mm\n For example: 2020-08-20T12:35',
  execute(message, args) {
    const channel = message.channel.id;
    const user = message.author.id;
    const name = args[0];
    const everyone = message.mentions.everyone;
    const scope = message.mentions.users.map((u) => ({
      user: u.id,
    }));
    const dateString = args[1];

    const date = new Date(dateString);

    if (!date instanceof Date || isNaN(date)) {
      return message.reply('Invalid date. Please use !help for more info');
    }

    (async () => {
      try {
        const newMeeting = await createMeeting({
          user,
          name,
          date,
          everyone,
          channel,
          scope,
        });
        message.reply('You have successfully set up your meeting');

        if (date >= Date.now() && date <= Date.now() + 3600000) {
          setTimeout(async () => {
            message.channel.send(notifyMsg(newMeeting));

            await Meeting.findByIdAndDelete(newMeeting._id);
          }, newMeeting.date - Date.now());
        }
      } catch (err) {
        message.reply(err.message);
      }
    })();

    //   console.log(newMeeting);
    //   if (newMeeting) {
    //     message.reply('You have successfully set up your meeting');
    //     setTimeout(() => {
    //       message.reply('meeting');
    //     }, 20000);
    //   } else {
    //     message.reply('There is an error. Please check your command');
    //   }
  },
};
