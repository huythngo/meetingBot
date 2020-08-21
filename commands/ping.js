const { findUpcomingMeeting } = require('../actions/UpcomingMeeting');
const { sendMessage } = require('../index');
module.exports = {
  name: 'ping',
  description: 'set a new meeting!',
  args: false,
  cooldown: 5,
  aliases: ['t'],
  usage: '<name> <time> <@users>',
  execute(message, args) {
    (async () => {
      try {
        const newMeeting = await findUpcomingMeeting();
        message.reply('done');
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
