import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import { TicketModel } from "@/modules/ticket/models/Ticket.model"
import Discord, { Client, Interaction, MessageCreateOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client,
    ticketData: TicketModel,
    buffer: Buffer
}

export const LogsPanelMessage = (props: Props): MessageCreateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setThumbnail(props.interaction.guild?.iconURL()!)
                .setDescription(`> ${emojis.notifiy} Veja abaixo mais informações sobre o ticket!`)
                .addFields(
                    {
                        name: `${emojis.member} ID Sessão:`,
                        value: `\`\`\`${props.ticketData.sessionId}\`\`\``
                    },
                    {
                        name: `${emojis.team} Canal:`,
                        value: `\`\`\`${props.interaction.channel?.type === Discord.ChannelType.GuildText && props.interaction.channel.name}\`\`\``
                    },
                    {
                        name: `${emojis.team} Protocolo:`,
                        value: `\`\`\`${props.interaction.channel?.id}\`\`\``
                    },
                    {
                        name: `${emojis.time} Ticket criado há:`,
                        value: `<t:${Math.floor(new Date(props.ticketData.createdAt).getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date(props.ticketData.createdAt).getTime() / 1000)}:R>\`)\``
                    },
                    {
                        name: `${emojis.time} Data de solicitação backup:`,
                        value: `<t:${Math.floor(new Date().getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date().getTime() / 1000)}:R>\`)\``
                    },
                )
        ],
        files: [
            {
                attachment: props.buffer,
                name: `backup-${props.ticketData.sessionId}.txt`
            }
        ]
    }
}