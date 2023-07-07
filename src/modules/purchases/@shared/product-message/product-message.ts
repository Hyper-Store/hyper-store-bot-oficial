import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Interaction } from 'discord.js';
import { ProductType } from '../../@types/Product.type';
import { DatabaseConfig } from '@/infra/app/setup-config';

export const ProductMessage = async (interaction: Interaction, product: ProductType) => {


    const product_image = product.image || await new DatabaseConfig().get('purchases.products.banner') as string

    const embed = new Discord.EmbedBuilder()
        .setColor(colors.invisible!)
        .setTitle(`${interaction.guild?.name} | Produto`)
        .setDescription(`\`\`\`${product.description}\`\`\`\n**${emojis.info} | Nome:** \`${product.title}\`\n**${emojis.money} | Preço:** \`R$${product.price.toFixed(2)}\`\n**${emojis.box} | Estoque:** \`${product.stock.length}\``)
        .setImage(product_image)
        .setFooter({ text: 'Para comprar clique no botão comprar' })

    return {
        embeds: [embed],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('buy')
                        .setLabel('Comprar')
                        .setEmoji(emojis.buy)
                        .setStyle(3)
                )
        ]
    }
}