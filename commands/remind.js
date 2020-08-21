module.exports = {
  name: 'remind',
  description: 'set a new remind!',
  args: true,
  cooldown: 5,
  aliases: ['r'],
  usage: '<time> <@users>',
  execute(message, args) {
    console.log(message.mentions.users);
    message.reply('You have successfully set up your meeting');
    setTimeout(() => {
      message.reply('meeting');
    }, 20000);
  },
};
