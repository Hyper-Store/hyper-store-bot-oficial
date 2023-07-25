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

export const CheckoutProductMessageChannel = async (props: Props) => {

    const buttons = new Discord.ActionRowBuilder<any>();

    for (let i = 0; i < 5; i++) {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`review_${i + 1}`)
                .setEmoji('⭐')
                .setLabel(`${i + 1}`)
                .setStyle(2)
        )
    }

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
        components: [buttons]
    }
}