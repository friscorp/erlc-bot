const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('commandlogs')
    .setDescription('View the command logs of the server'),
    async execute(interaction, client) {
        fetch (`https://api.policeroleplay.community/v1/server/commandlogs`, {
            headers: {
                "Server-Key": process.env.serverToken
  },
})
//console.log(res);
.then(result => result.json())
.then(response => {
  console.log(response);
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
    looplen = 10;
  } else {
    looplen = response.length;
  }
  if (!response[0]) {
    return interaction.reply ({ content: 'No recent logs in-game right now! ', ephemeral: true})
  }
  for (let i = 0; i<looplen; i++) {
    if (response[i].Player != "Remote Server") {
        coloo = response[i].Player.indexOf(":");
    } else {
        coloo = 13;
    }
    loges = loges + "[" + response[i].Player.substr(0,coloo)  + "]" + "(https://roblox.com/users/" + response[i].Player.substr(coloo+1,response[i].Player.length) + "/profile)" + " ran **" + response[i].Command + "** at <t:" + response[i].Timestamp + ":f>" +"\n"
  }
  if (loges.length >4096) {
    return interaction.reply('A log(s) was too long causing the most recent logs to have too many characters, please try again later.')
  }
  const embed = new EmbedBuilder()
        .setTitle('Command Logs')
        .setDescription('In-Game Logs \n' + loges)
        .setColor('1b88d1')
        .setTimestamp()
        //.addFields({ name: 'Players', value: response.CurrentPlayers})
        //.addFields({ name: 'Logs', value: loges })
        .setFooter({ text: `"Remote Server" is me (this bot) and will link back to your profile.`})

    interaction.reply({ embeds: [embed], ephemeral:true });
})


        


        //await interaction.reply({ content: 'Logs Sent', ephemeral: true });
    }
}
