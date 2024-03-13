const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('viewlogs')
    .setDescription('View the command logs of a moderator in the server')
    .addStringOption(option => option.setName('user').setDescription('User you are trying to check, enter their username NOT display name').setRequired(true)),
    async execute(interaction, client) {
        fetch (`https://api.policeroleplay.community/v1/server/commandlogs`, {
            headers: {
                "Server-Key": process.env.serverToken
  },
})
//console.log(res);
.then(result => result.json())
.then(response => {
  //console.log(response);
  loges = "";
  if(response.message) {
    if (response.message == 'You are being rate limited!') {
      retTime = ' Retry in ' + response.retry_after + ' seconds.'
    }
    if (response.message != "Success") {
      return interaction.reply('Error: ' + response.message + retTime)
    }
  }
  if (response.length>10) { 
    looplen = 30;
  } else {
    looplen = response.length;
  }
  if (!response[0]) {
    return interaction.reply ({ content: 'User has no logs, try double-checking their uesrname!', ephemeral: true})
  }
  const { options } = interaction;

    const userlog = options.getString('user');
  for (let i = 0; i<response.length; i++) {
    coloo = response[i].Player.indexOf(":");
    checkin = response[i].Player.substr(0,coloo)
    if (checkin == userlog) {
        coloo = response[i].Player.indexOf(":");
        loges = loges + "[" + response[i].Player.substr(0,coloo)  + "]" + "(https://roblox.com/users/" + response[i].Player.substr(coloo+1,response[i].Player.length) + "/profile)" + " ran **" + response[i].Command + "** at <t:" + response[i].Timestamp + ":f>" +"\n"
    } else {
        coloo = -1;
        loges = loges + ""
    }
    
  }
  if (loges.length >4096) {
    return interaction.reply('A log(s) was too long causing the most recent logs to have too many characters, please try again later.')
  }
  const embed = new EmbedBuilder()
        .setTitle('Command Logs')
        .setDescription('In-Game Logs for ' + userlog + '\n' + loges)
        .setColor('1b88d1')
        .setTimestamp()
        //.addFields({ name: 'Players', value: response.CurrentPlayers})
//        .addFields({ name: 'Logs', value: loges, inline: true })
        //.setFooter({ text: `"Remote Server" is me (this bot) and will link back to your profile.`})

    interaction.reply({ embeds: [embed], ephemeral: true });
})


        


        //await interaction.reply({ content: 'Logs Sent', ephemeral: true });
    }
}