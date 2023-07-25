import { DatabaseConfig } from '@/infra/app/setup-config';
import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { CheckoutModel } from '@/modules/checkout/models/Checkout.model';
import { ProductStockModel } from '@/modules/product/models/product-stock.model';
import { ProductModel } from '@/modules/product/models/product.model';
import Discord, { Client, EmbedBuilder } from 'discord.js';

type Props = {
    client: Client,
    user: Discord.GuildMember,
    product: ProductModel,
    checkout: CheckoutModel,
    stock: ProductStockModel[]
}

export const CheckoutProductMessagePrivate = async (props: Props) => {

    const channel_avaibles = props.client.channels.cache.get(await new DatabaseConfig().get('purchases.channel_avaibles') as string)

    const embeds: EmbedBuilder[] = [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setAuthor({ name: `${props.user.guild.name}`, iconURL: props.user.guild.iconURL()! })
            .setTitle('Compra aprovada')
            .setDescription(`> ${emojis.notifiy} Caso queira você pode avaliar o produto ou a loja, deixe sua avaliação em: ${channel_avaibles}`)
            .addFields(
                {
                    name: `**${emojis.box} | Produto:**`,
                    value: `\`${props.product.title}\``
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
                    name: `**${emojis.id} | Protocolo (ID DA COMPRA):**`,
                    value: `\`${props.checkout.id}\``
                },
                {
                    name: `**${emojis.date} | Data da compra:**`,
                    value: `<t:${Math.floor(new Date().getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date().getTime() / 1000)}:R>\`)\``
                }
            )
            .setImage(await new DatabaseConfig().get('purchases.products.banner') as string)
            .setFooter({ text: `📦 ${props.client.guilds.cache.get(process.env.GUILD_ID!)?.name} - Todos os direitos reservados` })
    ]

    if (props.product.messageDelivery) {
        embeds.push(
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.info} ${props.product.messageDelivery}`)
        )
    }

    return {
        content: `||${props.user}||`,
        embeds: embeds
    }
}