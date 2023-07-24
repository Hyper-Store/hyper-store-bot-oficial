import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { ProductModel } from "@/modules/product/models/product.model";
import Discord, { Client, Interaction, InteractionUpdateOptions } from "discord.js";

type Props = {
    interaction: Interaction,
    client: Client,
    product: ProductModel
}

export const AddStockProductMessage = (props: Props): InteractionUpdateOptions => {
    return {
        content: `${props.interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.notifiy} Agora envie o estoque por linha, cada linha ou mensagem será um estoque, digite finalizar para finalizar!\n\n**${emojis.box} | Produto:** ${props.product.title} \`(\`${props.product.id}\`)\``)
        ],
        components: []
    }
}