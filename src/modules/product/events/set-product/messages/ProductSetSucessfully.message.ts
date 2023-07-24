import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Client, Interaction, InteractionUpdateOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client
}

export const ProductSetSucessfullyMessage = (props: Props): InteractionUpdateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} Produto setado ao canal com sucesso!`)
        ],
        components: []
    }
}