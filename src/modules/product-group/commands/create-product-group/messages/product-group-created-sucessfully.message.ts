import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Client, Interaction, InteractionReplyOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client
}

export const ProductGroupCreatedSucessfullyMessage = (props: Props): InteractionReplyOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} Grupo criado com sucesso, agora use o comando /set-product-group para seta-lo a um canal!`)
        ],
        ephemeral: true
    }
}