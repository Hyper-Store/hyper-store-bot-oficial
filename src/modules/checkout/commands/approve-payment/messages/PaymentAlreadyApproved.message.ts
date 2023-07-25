import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Interaction } from "discord.js"

type Props = {
    interaction: Interaction,
    paymentId: string
}

export const PaymentAlreadyApprovedMessage = (props: Props): Discord.InteractionReplyOptions => {
    return {
        content: `||${props.interaction.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.error!)
                .setDescription(`> ${emojis.error} O pagamento \`${props.paymentId}\` já está aprovado`)
        ],
        ephemeral: true
    }
}