import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Client, Interaction, InteractionReplyOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client
}

export const OpeningTicketMessage = (props: Props): InteractionReplyOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.loading} Seu ticket está sendo aberto, aguarde...`)
        ],
        ephemeral: true
    }
}