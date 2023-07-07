import { colors } from '@/modules/@shared/utils/colors';
import Discord, { Client, Interaction } from 'discord.js';

const MessagePing = (interaction: Interaction, client: Client) => ({
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setTitle('Pong 🏓')
            .setDescription([
                `> 🛅 Meu ping atual é de: \`${client.ws.ping}MS\``,
                `> 🛰️ Shards: \`20\``,
                `> 📦 Container: \`Online\``
            ].join("\n"))
            .setFooter({ text: "Comando consultado hoje às", iconURL: interaction.guild?.iconURL()! })
            .setTimestamp()
    ],
    components: [
        new Discord.ActionRowBuilder<any>()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('update-ping')
                    .setLabel('Atulizar PING')
                    .setStyle(1)
            )
    ]
})

export { MessagePing }