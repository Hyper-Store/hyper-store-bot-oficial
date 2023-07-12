import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Interaction, Role } from "discord.js"

type Props = {
    interaction: Interaction
}

export const PackDownloadSent = (props: Props): Discord.InteractionReplyOptions => {
    return {
        content: `||${props.interaction.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} Parabéns, foi enviado ao seu privado o download da opção do pack selecionado!`)
        ],
        ephemeral: true
    }
}