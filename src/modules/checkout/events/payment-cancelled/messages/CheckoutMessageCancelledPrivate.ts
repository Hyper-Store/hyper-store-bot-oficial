import { DatabaseConfig } from '@/infra/app/setup-config';
import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { CheckoutModel } from '@/modules/checkout/models/Checkout.model';
import { ProductModel } from '@/modules/product/models/product.model';
import Discord, { Client } from 'discord.js';

type Props = {
    client: Client,
    user: Discord.GuildMember,
    product: ProductModel,
    checkout: CheckoutModel
}

export const CheckoutMessageCancelledPrivate = async (props: Props) => {
    return {
        content: `||${props.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setAuthor({ name: `${props.user.guild.name}`, iconURL: props.user.guild.iconURL()! })
                .setTitle('Compra cancelada')
                .setDescription(`> ${emojis.notifiy} Sua compra foi cancelada por não realizar o pagamento, o produto foi devolvido de volta ao estoque, caso queira continuar, você pode comprar novamente!`)
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
                        name: `**${emojis.id} | Protocolo (ID DA COMPRA):**`,
                        value: `\`${props.checkout.id}\``
                    },
                    {
                        name: `**${emojis.date} | Data do cancelamento:**`,
                        value: `<t:${Math.floor(new Date().getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date().getTime() / 1000)}:R>\`)\``
                    }
                )
                .setImage(await new DatabaseConfig().get('purchases.products.banner') as string)
                .setFooter({ text: `📦 ${props.client.guilds.cache.get(process.env.GUILD_ID!)?.name} - Todos os direitos reservados` })
        ]
    }
}