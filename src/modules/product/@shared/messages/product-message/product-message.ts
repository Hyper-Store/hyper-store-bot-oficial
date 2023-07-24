import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Interaction } from 'discord.js';
import { DatabaseConfig } from '@/infra/app/setup-config';
import { ProductModel } from '@/modules/product/models/product.model';
import { ProductStockRepository } from '@/modules/product/repositories/product-stock.repository';

type Props = {
    interaction: Interaction,
    product: ProductModel
}

export const ProductMessage = async (props: Props) => {
    const product_image = props.product.image || await new DatabaseConfig().get('purchases.products.banner') as string
    const stockCount = await ProductStockRepository.stockCount(props.product?.id!);

    const embed = new Discord.EmbedBuilder()
        .setColor(colors.invisible!)
        .setTitle(`${props.interaction.guild?.name} | Produto`)
        .setDescription(`\`\`\`${props.product.description}\`\`\`\n**${emojis.info} | Nome:** \`${props.product.title}\`\n**${emojis.money} | Preço:** \`R$${props.product.price.toFixed(2)}\`\n**${emojis.box} | Estoque:** \`${stockCount}\``)
        .setImage(product_image)
        .setFooter({ text: 'Para comprar clique no botão comprar' })

    const button = new Discord.ActionRowBuilder<any>()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`buy_${props.product.id}`)
                .setLabel('Comprar')
                .setEmoji(emojis.buy)
                .setStyle(3)
        )

    if (props.product.youtubeURL) button.addComponents(
        new Discord.ButtonBuilder()
            .setLabel('Ver vídeo')
            .setStyle(5)
            .setEmoji(emojis.youtube)
            .setURL(props.product.youtubeURL!)
    )

    return {
        embeds: [embed],
        components: [button]
    }
}