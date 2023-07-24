import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { ProductModel } from "@/modules/product/models/product.model";
import Discord, { Client, Interaction, InteractionUpdateOptions } from "discord.js";

type Props = {
    interaction: Interaction,
    client: Client,
    product: ProductModel,
    stock_collector: string[]
}

export const ProductStockAddedSuccessfullyMessage = (props: Props): InteractionUpdateOptions => {
    return {
        content: `${props.interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} Estoque adicionado ao produto com sucesso, veja abaixo o estoque adicionado!\n\`\`\`${props.stock_collector.join('\n')}\`\`\`\n**${emojis.box} | Produto:** ${props.product.title} \`(\`${props.product.id}\`)\``)
        ]
    }
}