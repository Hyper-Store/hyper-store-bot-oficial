import { DatabaseConfig } from '@/infra/app/setup-config';
import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { CheckoutModel } from '@/modules/checkout/models/Checkout.model';
import { ProductModel } from '@/modules/product/models/product.model';
import Discord, { Client } from 'discord.js';

type Props = {
    client: Client,
    user: Discord.GuildMember,
    checkout: CheckoutModel,
    product: ProductModel
}

export const CancelCheckoutByInativityMessageChannel = async (props: Props) => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setAuthor({ name: `${props.user.guild.name}`, iconURL: props.user.guild.iconURL()! })
                .setTitle('Compra cancelada')
                .setDescription(`> ${emojis.notifiy} Sua compra foi cancelada por inatividade, você não escolheu um método de pagamento e sua compra foi finalizada após 10 minutos, caso ainda queira continuar, realize a compra novamente!`)
                .addFields(
                    {
                        name: `**${emojis.box} | Produto:**`,
                        value: `\`${props.product.title}\``
                    },
                    {
                        name: `**${emojis.id} | Protocolo (ID DO CARRINHO):**`,
                        value: `\`${props.checkout.id}\``
                    },
                    {
                        name: `**${emojis.date} | Data de finalização:**`,
                        value: `<t:${Math.floor(new Date().getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date().getTime() / 1000)}:R>\`)\``
                    }
                )
                .setImage(await new DatabaseConfig().get('purchases.products.banner') as string)
                .setFooter({ text: `📦 ${props.client.guilds.cache.get(process.env.GUILD_ID!)?.name} - Todos os direitos reservados` })
        ],
    }
}