import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { CreatePaymentManagementUsecase } from "@/modules/payment/management/usecases";
import { GenerateMercadopagoPaymentUsecase } from "@/modules/payment/providers/mercadopago/usecases/mercadopago-actions";
import { CheckoutRepository } from "@/modules/checkout/repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { FinishPaymentMercadoPagoMessage } from "./@shared/messages/finish-payment-mercado-pago.message";
import { ButtonPixQrCode } from "./@shared/singletons/button-pix-qrcode.singleton";
import { MercadopagoRepository } from "@/modules/payment/providers/mercadopago/repositories";
import { PaymentManagementRepository } from "@/modules/payment/management/repositories";
import mercadopago from "mercadopago";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";

class QrCodeMercadoPagoCheckoutEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'qrcode') return;

        const checkout = await CheckoutRepository.findById(interaction.channelId)
        const product = await ProductRepository.findById(checkout?.productId!);

        if (interaction.user.id !== checkout?.ownerId) return;

        const paymentManagementEntity = await PaymentManagementRepository.findById(checkout.id)
        const payment_data = await mercadopago.payment.findById(parseInt(paymentManagementEntity?.paymentProviderId!))

        ButtonPixQrCode.qrcode = true;

        await interaction.update({
            ...FinishPaymentMercadoPagoMessage({
                product: product!,
                totalValue: product?.price! * checkout.quantity!,
                linkPayment: payment_data.body.point_of_interaction.transaction_data.ticket_url,
                ...ButtonPixQrCode,
                paymentId: checkout.paymentId!
            })
        })

        const base64_img = payment_data.body.point_of_interaction.transaction_data.qr_code_base64;
        const buf = Buffer.from(base64_img, 'base64');
        const attachment = new Discord.AttachmentBuilder(buf, { name: 'qrcode.png' });

        interaction.followUp({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> 📱 Abra seu banco selecione a opção QRCODE e aponte a câmera de seu celular para o qrcode abaixo e realize o pagamento!`)
                    .setImage("attachment://qrcode.png")
            ],
            files: [attachment]
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new QrCodeMercadoPagoCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}