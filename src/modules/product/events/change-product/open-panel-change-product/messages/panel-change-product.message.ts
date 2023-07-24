import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import { ProductModel } from "@/modules/product/models/product.model"
import { ProductStockRepository } from "@/modules/product/repositories/product-stock.repository"
import Discord, { Client, Interaction, InteractionUpdateOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client,
    product: ProductModel
}

export const PanelChangeProductMessage = async (props: Props): Promise<InteractionUpdateOptions> => {

    const productStock = await ProductStockRepository.stockCount(props.product.id!)

    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.notifiy} Você está editando o produto: \`${props.product.id}\``)
                .addFields(
                    {
                        name: `${emojis.info} Nome:`,
                        value: `\`${props.product.title}\``
                    },
                    {
                        name: `${emojis.money} Valor:`,
                        value: `\`R$${props.product.price.toFixed(2)}\``
                    },
                    {
                        name: `${emojis.box} Estoque:`,
                        value: `\`${productStock}\``
                    },
                    {
                        name: `${emojis.date} Criado há:`,
                        value: `\`${new Date(props.product.createdAt!).toLocaleString()}\``
                    }
                )
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`change-product-details_${props.product.id}`)
                        .setLabel('Editar produto')
                        .setEmoji(emojis.box)
                        .setStyle(1)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`change-product-info_${props.product.id}`)
                        .setLabel('Editar informações de entrega')
                        .setEmoji(emojis.accept)
                        .setStyle(3)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('delete')
                        .setLabel('Deletar produto')
                        .setEmoji(emojis.delete)
                        .setStyle(4)
                )
        ]
    }
}