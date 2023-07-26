import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Client, Interaction, InteractionReplyOptions } from "discord.js"

type Props = {
    client: Client
}

export const GroupNotExistMessage = (props: Props) => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.error!)
                .setDescription(`> ${emojis.error} O grupo selecionado não existe ou não está mais disponível!`)
        ],
        ephemeral: true
    }
}