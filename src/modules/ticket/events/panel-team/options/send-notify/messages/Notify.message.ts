import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Client, Interaction, MessageCreateOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client
}

export const NotifyMessage = (props: Props): MessageCreateOptions => {
    return {
        content: `||${props.interaction.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.notifiy} O suporte ${props.interaction.user} está te aguardando no ticket ${props.interaction.channel}`)
                .setFooter({ text: `😁 Abração do Kafka! ... Digo; Da equipe ${props.interaction.guild?.name}!` })
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel('Ir para ticket')
                        .setEmoji('🎫')
                        .setStyle(5)
                        .setURL(props.interaction.channel?.url!)
                )
        ]
    }
}