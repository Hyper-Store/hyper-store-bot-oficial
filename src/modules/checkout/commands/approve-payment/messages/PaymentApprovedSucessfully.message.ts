import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Interaction } from "discord.js"

type Props = {
    interaction: Interaction,
    paymentId: string
}

export const PaymentApprovedSucessfullyMessage = (props: Props): Discord.InteractionReplyOptions => {
    return {
        content: `||${props.interaction.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} O pagamento \`${props.paymentId}\` foi aprovado com sucesso!`)
        ],
        ephemeral: true
    }
}