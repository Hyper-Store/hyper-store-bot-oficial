import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Client, Interaction } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client
}

export const NotHaveProductMessage = (props: Props) => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.error} Não tem nenhum produto cadastrado no sistema para adiciona-lô a um canal!`)
        ],
        ephemeral: true
    }
}