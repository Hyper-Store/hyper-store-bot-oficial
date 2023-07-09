import { DatabaseConfig } from '@/infra/app/setup-config';
import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { CheckoutModel } from '@/modules/checkout/models/Checkout.model';
import { ProductStockModel } from '@/modules/product/models/product-stock.model';
import { ProductModel } from '@/modules/product/models/product.model';
import Discord, { Client } from 'discord.js';

type Props = {
    client: Client,
    user: Discord.User,
    product: ProductModel,
    checkout: CheckoutModel,
    stock: ProductStockModel[]
}

export const CheckoutProductMessagePrivate = async (props: Props) => {

    const channel_avaibles = props.client.channels.cache.get(await new DatabaseConfig().get('purchases.channel_avaibles') as string)

    return {
        content: `${props.user} - Compra aprovada`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setTitle(`${props.user.username} | Compra aprovada`)
                .setDescription(`> ${emojis.notifiy} Caso queira você pode avaliar o produto ou a loja, deixe sua avaliação em: ${channel_avaibles}`)
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
                        value: `\`\`\`${props.stock.map(s => s.content).join(',\n')}\`\`\``
                    },
                    {
                        name: `**${emojis.date} | Data de entrega:**`,
                        value: `<t:${Math.floor(new Date().getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date().getTime() / 1000)}:R>\`)\``
                    }
                )
                .setImage(await new DatabaseConfig().get('purchases.products.banner') as string)
                .setFooter({ text: `📦 ${props.client.guilds.cache.get(process.env.GUILD_ID!)?.name} - Todos os direitos reservados` })
        ]
    }
}