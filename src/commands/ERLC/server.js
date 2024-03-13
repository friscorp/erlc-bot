const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('View the current server status'),
    async execute(interaction, client) {
        fetch (`https://api.policeroleplay.community/v1/server`, {
            headers: {
                "Server-Key": process.env.serverToken
  },
})
//console.log(res);
.then(result => result.json())
.then(response => {
    if(response.message) {
        if (response.message == 'You are being rate limited!') {
          retTime = ' Retry in ' + response.retry_after + ' seconds.'
        }
        if (response.message != "Success") {
          return interaction.reply('Error: ' + response.message + retTime)
        }
      }
  console.log(response);
  const embed = new EmbedBuilder()
        .setTitle('Server Info')
        .setDescription(response.Name)
        .setColor('000000')
        //.setImage('https://example.com/trailer.png')
        .setTimestamp()
        //.addFields({ name: 'Players', value: response.CurrentPlayers})
        .addFields({ name: 'Players', value: response.CurrentPlayers.toString() + ' out of ' + response.MaxPlayers.toString() + ' max players', inline: false })
        .addFields({ name: 'Join Key', value: response.JoinKey, inline: true }, {name: 'Verification Requirements', value: response.AccVerifiedReq + ' Verification', inline: true})

    interaction.reply({ embeds: [embed], ephemeral: true });
})


        


    }
}