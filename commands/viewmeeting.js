const { viewMeetingByUser } = require('../actions/Meeting');
const { viewMeetingMsg } = require('../msgTemplate/EmbedMsg');

module.exports = {
  name: 'viewmeeting',
  description: 'view all of your meetings!',
  args: false,
  cooldown: 5,
  aliases: ['vm'],
  usage: 'No args required',
  execute(message, args) {
    const user = message.author.id;

    (async () => {
      try {
        let reply = '\n';
        const meetings = await viewMeetingByUser(user);
        if (meetings.length <= 0) {
          reply += "You don't have any scheduled meeting.";
        } else {
          reply = viewMeetingMsg(user, meetings);
        }

        message.channel.send(reply);
      } catch (err) {
        message.reply(err.message);
      }
    })();
  },
};
