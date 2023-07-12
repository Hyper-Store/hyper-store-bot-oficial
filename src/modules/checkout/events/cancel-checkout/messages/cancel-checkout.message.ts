import { CheckoutModel } from "@/modules/checkout/models/Checkout.model"
import { ProductModel } from "@/modules/product/models/product.model"
import { colors } from "@/modules/@shared/utils/colors"
import Discord, { Interaction } from "discord.js"
import { emojis } from "@/modules/@shared/utils/emojis"
import { DatabaseConfig } from "@/infra/app/setup-config"

type Props = {
    interaction: Interaction,
    checkout: CheckoutModel,
    product: ProductModel
}

export const CancelCheckoutMessage = async (props: Props) => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setAuthor({ name: `${props.interaction.guild?.name}`, iconURL: props.interaction.guild?.iconURL()! })
                .setTitle('Compra cancelada')
                .setDescription(`> ${emojis.notifiy} Sua compra foi cancelada por você mesmo, caso queira comprar novamente você pode abrir um novo carrinho!`)
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
                        name: `**${emojis.date} | Data de cancelamento:**`,
                        value: `<t:${Math.floor(new Date().getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date().getTime() / 1000)}:R>\`)\``
                    }
                )
                .setImage(await new DatabaseConfig().get('purchases.products.banner') as string)
                .setFooter({ text: `📦 ${props.interaction.guild?.name} - Todos os direitos reservados` })
        ],
    }
}