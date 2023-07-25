import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Client, Interaction, InteractionUpdateOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client
}

export const LogsSentMessage = (props: Props): InteractionUpdateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} O backup das conversas foi realizado com sucesso, e já está em seu privado disponível para download!`)
        ]
    }
}