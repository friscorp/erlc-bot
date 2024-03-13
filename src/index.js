const { Client, GatewayIntentBits, EmbedBuilder, WebhookClient, Events, PermissionsBitField, Permissions, MessageManager, Embed, Collection, ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`);
const fs = require('fs');
const { setTimeout } = require('timers/promises');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] }); 

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

const webhookClient = new WebhookClient({ id: 'ENTER WEBHOOK ID', token: 'ENTER WEBHOOK TOKEN' });

function editS () {
    fetch (`https://api.policeroleplay.community/v1/server`, {
            headers: {
                "Server-Key": process.env.serverToken
  },
})
.then(result => result.json())
.then(response => {
    if (response.TeamBalance == true ) {
        teamb = "On"
    } else {
        teamb = "Off"
    }
    if (response.CurrentPlayers == null) {
        pcc = 0
        embedcol = 'ed451f'
    } else {
        pcc = response.CurrentPlayers
        embedcol = '1e72c7'
        
    }
    const currentTime = Math.floor(Date.now() / 1000);
    //console.log(response)
    const embed = new EmbedBuilder()
	.setTitle('Live Server Info')
    .setDescription("Updates every few minutes")
    .setFooter({ text: 'Do not join if the server is down'})
    .addFields(
        { name: 'Player Count', value: pcc.toString(), inline: true },
        { name: 'Team Balance', value: 'Currently ' + teamb, inline: true },
        { name: 'Last Updated', value: "<t:" + currentTime + ":R>"}
        )
	.setColor(embedcol);
    
 webhookClient.editMessage('ENTER MESSAGE ID', {
    //content: response.CurrentPlayers.toString() + ' out of ' + response.MaxPlayers.toString() + ' max players',
    embeds: [embed],
 
},
 )

})

//const exampleEmbed = EmbedBuilder.from(embed).setTitle('New title');
}
editS()
setInterval(editS, 120000);

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

