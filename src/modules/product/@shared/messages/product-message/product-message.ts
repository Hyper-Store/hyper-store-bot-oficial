import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Interaction } from 'discord.js';
import { DatabaseConfig } from '@/infra/app/setup-config';
import { ProductModel } from '@/modules/product/models/product.model';
import { ProductStockRepository } from '@/modules/product/repositories/product-stock.repository';

export const ProductMessage = async (interaction: Interaction, product: ProductModel) => {
    const product_image = product.image || await new DatabaseConfig().get('purchases.products.banner') as string
    const stockCount = await ProductStockRepository.stockCount(product?.id!);

    const embed = new Discord.EmbedBuilder()
        .setColor(colors.invisible!)
        .setTitle(`${interaction.guild?.name} | Produto`)
        .setDescription(`\`\`\`${product.description}\`\`\`\n**${emojis.info} | Nome:** \`${product.title}\`\n**${emojis.money} | Preço:** \`R$${product.price.toFixed(2)}\`\n**${emojis.box} | Estoque:** \`${stockCount}\``)
        .setImage(product_image)
        .setFooter({ text: 'Para comprar clique no botão comprar' })

    return {
        embeds: [embed],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`buy_${product.id}`)
                        .setLabel('Comprar')
                        .setEmoji(emojis.buy)
                        .setStyle(3)
                )
        ]
    }
}