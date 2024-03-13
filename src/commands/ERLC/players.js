const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('players')
    .setDescription('View the players in-game, and their in-game rank'),
    async execute(interaction, client) {
        fetch (`https://api.policeroleplay.community/v1/server/players`, {
            headers: {
                "Server-Key": process.env.serverToken
  },
})
//console.log(res);
.then(result => result.json())
.then(response => {
  playres = "";
  if(response.message) {
    if (response.message == 'You are being rate limited!') {
      retTime = ' Retry in ' + response.retry_after + ' seconds.'
    }
    if (response.message != "Success") {
      return interaction.reply('Error: ' + response.message + retTime)
    }
  }
  if (!response[0]) {
    return interaction.reply ({ content: 'No players in-game right now! ', ephemeral: true})
  }
  for (let i = 0; i<response.length; i++) {
    if (response[i].Player != "Remote Server") {
        coloo = response[i].Player.indexOf(":");
    } else {
        coloo = 13;
    }
    playres = "[" + response[i].Player.substr(0,coloo)  + "]" + "(https://roblox.com/users/" + response[i].Player.substr(coloo+1,response[i].Player.length) + "/profile)" +  ": " + response[0].Permission +"\n"
  }
  if (playres.length >4096) {
    return interaction.reply('A player name(s) was too long causing the most recent logs to have too many characters, please try again later.')
  }
  const embed = new EmbedBuilder()
        .setTitle('Players')
        .setDescription(playres)
        .setColor('336d91')
        .setTimestamp()
        //.addFields({ name: 'Players', value: response.CurrentPlayers})
        //.addFields({ name: 'Players', value: response.CurrentPlayers.toString() + ' out of ' + response.MaxPlayers.toString() + ' max players', inline: true })

    interaction.reply({ embeds: [embed], ephemeral: true });
})   
}}