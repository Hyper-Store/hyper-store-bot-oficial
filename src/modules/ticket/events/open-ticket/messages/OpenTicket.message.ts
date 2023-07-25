import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Channel, Client, Interaction, InteractionReplyOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client,
    channel: Channel
}

export const OpenTicketMessage = (props: Props): InteractionReplyOptions => {
    return {
        content: `||${props.interaction.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.notifiy} Olá ${props.interaction.user}, seu ticket foi aberto em ${props.channel}`)
                .setFooter({ text: "😁 Estou ancioso pare te ajudar! Mal posso esperar..." })
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel('Ir para ticket')
                        .setEmoji('🎫')
                        .setStyle(5)
                        .setURL(props.channel?.url!)
                )
        ]
    }
}