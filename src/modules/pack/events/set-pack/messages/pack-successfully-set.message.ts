import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Interaction } from "discord.js"

type Props = {
    interaction: Interaction
}

export const PackSetedSuccessfully = (props: Props): Discord.InteractionUpdateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`${emojis.success} Pack setado com sucesso ao canal ${props.interaction.channel}`)
        ],
        components: []
    }
}