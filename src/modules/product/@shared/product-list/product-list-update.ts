import Discord, { Client, Interaction } from 'discord.js';
import { ProductStockRepository } from '@/modules/product/repositories/product-stock.repository';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { NotHaveProductMessage } from '../messages/not-have-product/not-have-product.message';
import { ProductListMessage } from './messages/product-list.message';

type Props = {
    interaction: Interaction,
    client: Client,
    description: string
    customId: string,
    page: number
}

export const ProductListUpdate = async (props: Props) => {
    const products = await ProductRepository.getAll();

    if (products.length < 1) {
        return NotHaveProductMessage({ client: props.client, interaction: props.interaction });
    }

    const list_product: Discord.SelectMenuComponentOptionData[][] = [[]];

    for (const product of Object.keys(products)) {
        const product_id = product as any
        const product_index = Object.keys(products).indexOf(product_id);
        const stockCount = await ProductStockRepository.stockCount(products[product_id].id!);

        const page = Math.floor(product_index / 25);
        while (page >= list_product.length) {
            list_product.push([]);
        }

        list_product[page].push({
            emoji: "📦",
            label: `${products[product_id].title} - ID: (${products[product_id].id?.slice(0, 8)})`,
            description: `💸 R$${products[product_id].price.toFixed(2)} - 🎁 ${stockCount} Estoque`,
            value: products[product_id].id!,
        })
    }

    return ProductListMessage({
        interaction: props.interaction,
        client: props.client,
        customId: props.customId,
        description: props.description,
        list_product,
        page: props.page
    })
}