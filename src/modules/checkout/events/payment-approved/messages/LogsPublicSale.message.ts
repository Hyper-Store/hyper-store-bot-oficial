import { DatabaseConfig } from '@/infra/app/setup-config';
import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { CheckoutModel } from '@/modules/checkout/models/Checkout.model';
import { ProductStockModel } from '@/modules/product/models/product-stock.model';
import { ProductModel } from '@/modules/product/models/product.model';
import Discord, { Client, Interaction, MessageCreateOptions } from 'discord.js';

type Props = {
    client: Client,
    guild: Discord.Guild,
    user: Discord.GuildMember,
    product: ProductModel,
    checkout: CheckoutModel
}

export const LogsPublicSaleMessage = async (props: Props): Promise<MessageCreateOptions> => {
    return {
        content: `${props.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setAuthor({ name: `${props.user.guild.name}`, iconURL: props.user.guild.iconURL()! })
                .setTitle(`${props.guild.name} | Compra aprovada`)
                .addFields(
                    {
                        name: `**${emojis.support} | Comprador:**`,
                        value: `\`${props.user.user.username}\` - \`${props.user.user.id}\``
                    },
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
                        name: `**${emojis.start} | Avaliação**`,
                        value: `${props.checkout.review ? `${"⭐".repeat(props.checkout.review)} \`${props.checkout.review}\`` : `\`Nenhuma avaliação\``}`
                    },
                    {
                        name: `** ${emojis.date} | Data da compra:** `,
                        value: `< t:${Math.floor(new Date().getTime() / 1000)}: f > \`(\`<t:${Math.floor(new Date().getTime() / 1000)}:R>\`)\``
                    }
                )
                .setImage(await new DatabaseConfig().get('purchases.products.banner') as string)
                .setFooter({ text: `📦 ${props.client.guilds.cache.get(process.env.GUILD_ID!)?.name} - Todos os direitos reservados` })
        ]
    }
}