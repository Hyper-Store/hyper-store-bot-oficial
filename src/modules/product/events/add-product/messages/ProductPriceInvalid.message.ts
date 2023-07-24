import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import { ProductModel } from "@/modules/product/models/product.model"
import Discord, { Client, Interaction, InteractionUpdateOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client,
    price: number
}

export const ProductPriceInvalidMessage = (props: Props): InteractionUpdateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.error!)
                .setDescription(`> ${emojis.error} O valor inserido \`${props.price}\` deve ser maior que \`R$1,00\` ou menor que \`R$1000,00\`!`)
        ],
        components: []
    }
}