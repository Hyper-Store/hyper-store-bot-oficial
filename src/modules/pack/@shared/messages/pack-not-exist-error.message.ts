import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Interaction } from "discord.js"

type Props = {
    interaction: Interaction,
}

export const PackNotExistErrorMessage = (props: Props): Discord.InteractionUpdateOptions => {
    return {
        content: `||${props.interaction.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.error!)
                .setDescription(`> ${emojis.error} O pack selecionado não existe ou não está mais disponível no momento!`)
        ],
        components: []
    }
}