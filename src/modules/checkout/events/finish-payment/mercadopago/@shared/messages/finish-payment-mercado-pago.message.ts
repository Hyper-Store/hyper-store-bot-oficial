import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { ProductModel } from '@/modules/product/models/product.model';
import Discord, { Interaction } from 'discord.js';

type Props = {
    product: ProductModel,
    totalValue: number,
    linkPayment: string,
    pix: boolean,
    qrcode: boolean
}

export const FinishPaymentMercadoPagoMessage = (props: Props) => {

    const expire_in = new Date()
    expire_in.setMinutes(expire_in.getMinutes() + 10);

    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`\`\`\`Selecione uma opção abaixo de pagamento para pareceber o produto.\`\`\`\n\n**${emojis.box} | Produto:** \`${props.product.title}\`\n**${emojis.money} | Valor:** \`R$${props.totalValue.toFixed(2)}\`\n**${emojis.date} | Expira em:** <t:${Math.floor(expire_in.getTime() / 1000)}:f> \`(\`<t:${Math.floor(expire_in.getTime() / 1000)}:R>\`)\``)
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('pix')
                        .setEmoji(emojis.pix)
                        .setLabel('Pagar com PIX')
                        .setDisabled(props.pix)
                        .setStyle(1)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('qrcode')
                        .setEmoji(emojis.qrcode)
                        .setLabel('Pagar com QRCODE')
                        .setDisabled(props.qrcode)
                        .setStyle(2)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setEmoji(emojis.mercadopago)
                        .setLabel('Pagar pelo site')
                        .setStyle(5)
                        .setURL(props.linkPayment)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('cancel-cart')
                        .setEmoji(emojis.notaccept)
                        .setLabel('Cancelar')
                        .setStyle(4)
                )
        ]

    }
}