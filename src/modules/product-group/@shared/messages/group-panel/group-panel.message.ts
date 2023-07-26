import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Guild, Interaction } from 'discord.js';
import { DatabaseConfig } from '@/infra/app/setup-config';
import { ProductStockRepository } from '@/modules/product/repositories/product-stock.repository';
import { ProductGroupRepository } from '@/modules/product-group/repositories/product-group.repository';
import { GroupNotExistMessage } from '../group-not-exist/group-not-exist.message';
import { ProductModel } from '@/modules/product/models/product.model';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { NotHaveProductGroupMessage } from '../not-have-product-group/not-have-product-group.message';
import { RandomEmoji } from '@/modules/@shared/utils/random-emoji';

export type GroupPanelMessageProps = {
    client: Client
    groupId: string
    guild: Guild
}

export const GroupPanelMessage = async (props: GroupPanelMessageProps): Promise<any> => {

    const group = await ProductGroupRepository.findById(props.groupId);
    if (!group) return GroupNotExistMessage({ ...props })

    const embed = new Discord.EmbedBuilder()
        .setColor(colors.invisible!)
        .setTitle(group.title)
        .setFooter({ text: '💚 Para comprar selecione um produto abaixo' })

    if (group.image) embed.setImage(group.image);
    if (group.description) embed.setDescription(`> ${emojis.info} ${group.description}`);

    const products: ProductModel[] = [];

    for (const productId of group.products) {
        const product = await ProductRepository.findById(productId!);
        if (product) products.push(product);
    }


    if (products.length < 1) return NotHaveProductGroupMessage({ ...props })

    const product_options: Discord.SelectMenuComponentOptionData[] = [];

    for (const product of products) {
        const stockCount = await ProductStockRepository.stockCount(product.id!);

        product_options.push({
            emoji: RandomEmoji(),
            label: `${product.title}`,
            description: `💸 | Valor: R$${product.price.toFixed(2)} - 📦 | Estoque: ${stockCount}`,
            value: product.id!,
        })
    }

    return {
        embeds: [embed],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('buy')
                        .setPlaceholder(`🛒 | ${products.map(p => p.title).join(', ')}`)
                        .setOptions(product_options)
                )
        ]
    }
}