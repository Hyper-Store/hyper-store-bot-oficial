import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Client, Interaction, InteractionReplyOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client
}

export const SucessfullyReopenedTicket = (props: Props): InteractionReplyOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} Ticket do usuário ${props.interaction.user} aberto com sucesso!`)
        ],
        ephemeral: true
    }
}