import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Channel, Client, Interaction, InteractionReplyOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client,
    channel: Channel
}

export const TicketAlreadyOpenMessage = (props: Props): InteractionReplyOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.error!)
                .setDescription(`> ${emojis.error} Você já possui um ticket aberto em ${props.channel}`)
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
        ],
        ephemeral: true
    }
}