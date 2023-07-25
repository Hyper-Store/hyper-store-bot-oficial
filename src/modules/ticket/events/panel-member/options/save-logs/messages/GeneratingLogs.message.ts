import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Client, Interaction, InteractionUpdateOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client
}

export const GeneratingLogsMessage = (props: Props): InteractionUpdateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.loading} Estou realizando o backup das mensagens, aguarde por favor...`)
                .setFooter({ text: '🐰 Pareçe chat isso..., Mais ja ta acabando tá bom?' })
        ],
        components: []
    }
}