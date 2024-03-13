const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('joinlogs')
    .setDescription('View the command logs of the server'),
    async execute(interaction, client) {
        fetch (`https://api.policeroleplay.community/v1/server/joinlogs`, {
            headers: {
                "Server-Key": process.env.serverToken
  },
})
//console.log(res);
.then(result => result.json())
.then(response => {
  loges = "";
  joined = '';
  if(response.message) {
    if (response.message == 'You are being rate limited!') {
      retTime = ' Retry in ' + response.retry_after + ' seconds.'
    }
    if (response.message != "Success") {
      return interaction.reply('Error: ' + response.message + retTime)
    }
  }
  if (!response[0]) {
    return interaction.reply({ content: 'No recent joins right now!', ephemeral: true});
  }
  if (response.length>10) { 
    looplen = 30;
  } else {
    looplen = response.length;
  }

 
  for (let i = 0; i<looplen; i++) {
    //console.log(response[i].Join)
    if (response[i].Join == true) {
        joined = 'joined'
      } else {
        joined = 'left'
      }
    if (response[i].Player != "Remote Server") {
        coloo = response[i].Player.indexOf(":");
    } else {
        coloo = 13;
    }
    loges = loges + "[" + response[i].Player.substr(0,coloo)  + "]" + "(https://roblox.com/users/" + response[i].Player.substr(coloo+1,response[i].Player.length) + "/profile)" + "** " + joined + "** at <t:" + response[i].Timestamp + ":f>" +"\n"
  }
  if (loges.length >4096) {
    return interaction.reply('A log(s) was too long causing the most recent logs to have too many characters, please try again later.')
  }
  const embed = new EmbedBuilder()
        .setTitle('Join Logs')
        .setDescription('In-Game Join Logs for the server \n' + loges)
        .setColor('1b88d1')
        .setTimestamp()
        //.addFields({ name: 'Players', value: response.CurrentPlayers})

    interaction.reply({ embeds: [embed] });
})


        


        //await interaction.reply({ content: 'Logs Sent', ephemeral: true });
    }
}