import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import { Client } from "discord.js"
import { CreatePaymentManagementUsecase } from "@/modules/payment/management/usecases";
import { GenerateMercadopagoPaymentUsecase } from "@/modules/payment/providers/mercadopago/usecases/mercadopago-actions";
import { CheckoutRepository } from "@/modules/checkout/repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { FinishPaymentMercadoPagoMessage } from "./@shared/messages/finish-payment-mercado-pago.message";
import { ButtonPixQrCode } from "./@shared/singletons/button-pix-qrcode.singleton";
import { MercadopagoRepository } from "@/modules/payment/providers/mercadopago/repositories";
import { PaymentManagementRepository } from "@/modules/payment/management/repositories";
import mercadopago from "mercadopago";

class PixMercadoPagoCheckoutEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'pix') return;

        const checkout = await CheckoutRepository.findById(interaction.channelId)
        const product = await ProductRepository.findById(checkout?.productId!);

        if (interaction.user.id !== checkout?.ownerId) return;

        const paymentManagementEntity = await PaymentManagementRepository.findById(checkout.id)
        console.log(paymentManagementEntity?.paymentProviderId)
        // const payment_data = mercadopago.payment.findById(parseInt(paymentManagementEntity?.paymentProviderId!))
        // if (!payment_data) return;

    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PixMercadoPagoCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}