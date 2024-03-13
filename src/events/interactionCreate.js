const { Interaction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return
        
        try{


            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!', 
                ephemeral: true
            }).catch(err => {});

            var guild = interaction.guild;
            var member = interaction.member;
            var channel = interaction.channel;
            var errorTime = `<t:${Math.floor(Date.now()/100)}:R>`;

            const sendChannel = await client.channels.fetch('1216500872704561242');

            const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('New error flagged, this interaction will no longer work or be flagged again')
            .addFields({ name: 'Command:', value: `${interaction.commandName}`})
            .addFields({ name: 'Error Stack (Full Error)', value: `${error.stack}`})
            .addFields({ name: 'Error Message', value: `${error.message}`})
            .addFields({ name: 'Error Time', value: `${errorTime}`})
            .setFooter({ text: 'Error Flagging'})
            .setTimestamp();

            const button = new ButtonBuilder()
            .setCustomId('fetchErrorUserInfo')
            .setLabel(`🤷‍♂️ User Info`)
            .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder()
            .addComponents(
                button
            );

            const msg = await sendChannel.send({embeds: [embed], components: [row]}).catch(err=>{});

            var time = 300000;
            const collector = await msg.CreateMessageComponentCollector({
                componentType: ComponentType.Button,
                time
            });

            collector.on('collect', async i => {
                if (i.customid = 'fetchErrorUserInfo') {
                    const userEmbed = new EmbedBuilder()
                    .setColor('DarkOrange')
                    .setDescription('The following user has triggered an error in the above slash command(s)')
                    .addFields({ name: 'Error User', value: `\`${member.user.username} (${member.id})\``})
                    .addFields({name: 'Command Channel', value: `\`${channel.name} (${channel.id})\``})
                    .setTimestamp()

                    await i.reply({ embeds: [userEmbed], ephemeral:true});
                }
            });

            collector.on('end', async () => {
                button.setDisabled(true);
                embed.setFooter({ text: 'User Info Button Expired, soz'});
                await msg.edit({ embeds: [embed], components: [row ]})
            })
            
        } 

    },
    


};