import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { CheckoutModel } from '@/modules/checkout/models/Checkout.model';
import { ProductStockModel } from '@/modules/product/models/product-stock.model';
import { ProductModel } from '@/modules/product/models/product.model';
import Discord from 'discord.js';

type Props = {
    user: Discord.User,
    product: ProductModel,
    checkout: CheckoutModel,
    stock: ProductStockModel[]
}

export const CheckoutProductMessagePrivate = (props: Props) => {
    return {
        content: `${props.user} - Compra aprovada`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .addFields(
                    {
                        name: `**${emojis.box} | Produto:**`,
                        value: `\`R$${props.product.title}\``
                    },
                    {
                        name: `**${emojis.buy} | Quantidade:**`,
                        value: `\`${props.checkout.quantity}\``
                    },
                    {
                        name: `**${emojis.money} | Valor total:**`,
                        value: `\`R$${props.checkout.price?.toFixed(2)}\``
                    },
                    {
                        name: `**${emojis.accept} | Entrega(s):**`,
                        value: `\`\`\`${props.stock.map(stock => stock.content).join('\n')}\`\`\``
                    }
                )
        ]
    }
}