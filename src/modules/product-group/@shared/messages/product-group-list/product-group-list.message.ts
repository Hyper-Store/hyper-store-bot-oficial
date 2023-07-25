import { colors } from "@/modules/@shared/utils/colors"
import { ProductGroupModel } from "@/modules/product-group/models/product-group.model"
import { ProductModel } from "@/modules/product/models/product.model"
import { ProductRepository } from "@/modules/product/repositories/product.repository"
import Discord, { Client, Interaction, InteractionReplyOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client,
    description: string
    customId: string,
    groups: ProductGroupModel[]
}

export const ProductGroupListMessage = async (props: Props): Promise<InteractionReplyOptions> => {

    const list_group: Discord.SelectMenuComponentOptionData[] = [];

    for (const group of Object.keys(props.groups)) {
        const groupId = group as any

        const products: ProductModel[] = [];

        for (const productId of props.groups[groupId].products) {
            const product = await ProductRepository.findById(productId!);
            if (product) products.push(product);
        }

        list_group.push({
            emoji: "📦",
            label: `${props.groups[groupId].id}`,
            description: `🎁 Produtos: ${products.map(p => p.title).join(', ')}`,
            value: groupId,
        })
    }

    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(props.description)
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId(`${props.customId}`)
                        .setPlaceholder('⏩ Escolha algum grupo')
                        .setOptions(list_group)
                )
        ],
        ephemeral: true
    }
}