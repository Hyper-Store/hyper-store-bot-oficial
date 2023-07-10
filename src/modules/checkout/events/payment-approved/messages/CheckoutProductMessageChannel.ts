import { DatabaseConfig } from '@/infra/app/setup-config';
import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { CheckoutModel } from '@/modules/checkout/models/Checkout.model';
import { ProductStockModel } from '@/modules/product/models/product-stock.model';
import { ProductModel } from '@/modules/product/models/product.model';
import Discord, { Client } from 'discord.js';

type Props = {
    client: Client,
    user: Discord.GuildMember,
    product: ProductModel,
    checkout: CheckoutModel,
    stock: ProductStockModel[]
}

export const CheckoutProductMessageChannel = async (props: Props) => {

    return {
        content: `${props.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} Compra aprovada com sucesso, seu produto já foi entregue em seu privado!`),

            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.notifiy} Deixe sua avaliação sobre a compra, assim ajudando o servidor!`)
                .setFooter({ text: '⭐ Você tem apenas um minuto para deixar sua avaliação!' })
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('avaible_1')
                        .setEmoji('⭐')
                        .setLabel("1")
                        .setStyle(2)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('avaible_2')
                        .setEmoji('⭐')
                        .setLabel("2")
                        .setStyle(2)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('avaible_3')
                        .setEmoji('⭐')
                        .setLabel("3")
                        .setStyle(2)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('avaible_4')
                        .setEmoji('⭐')
                        .setLabel("4")
                        .setStyle(2)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('avaible_5')
                        .setEmoji('⭐')
                        .setLabel("5")
                        .setStyle(2)
                )
        ]
    }
}