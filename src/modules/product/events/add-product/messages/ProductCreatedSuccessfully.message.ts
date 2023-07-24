import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import { ProductModel } from "@/modules/product/models/product.model"
import Discord, { Client, Interaction, InteractionUpdateOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client,
    product: ProductModel
}

export const ProductCreatedSucessfullyMessage = (props: Props): InteractionUpdateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} Seu produto \`${props.product.title}\` criado com sucesso!`)
        ],
        components: []
    }
}