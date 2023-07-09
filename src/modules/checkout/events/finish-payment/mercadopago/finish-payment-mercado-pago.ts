import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import { Client } from "discord.js"
import { CreatePaymentManagementUsecase } from "@/modules/payment/management/usecases";
import { GenerateMercadopagoPaymentUsecase } from "@/modules/payment/providers/mercadopago/usecases/mercadopago-actions";
import { CheckoutRepository } from "@/modules/checkout/repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { FinishPaymentMercadoPagoMessage } from "./@shared/messages/finish-payment-mercado-pago.message";
import { ButtonPixQrCode } from "./@shared/singletons/button-pix-qrcode.singleton";

export class FinishPaymentMercadoPagoCheckoutEvent {
    static async execute(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== 'method-payment') return;
        if (interaction.values[0] !== "mercadopago") return;

        const checkout = await CheckoutRepository.findById(interaction.channelId)
        const product = await ProductRepository.findById(checkout?.productId!);

        if (interaction.user.id !== checkout?.ownerId) return;

        new CreatePaymentManagementUsecase().execute({ checkoutId: checkout.id });

        const payment_data = await new GenerateMercadopagoPaymentUsecase().execute({
            product: {
                title: product?.title!,
                price: product?.price! * checkout?.quantity!
            },
            customer: {
                email: 'contato@gmail.com'
            },
            paymentManagementId: checkout.id
        })

        interaction.editReply({
            ...FinishPaymentMercadoPagoMessage({
                product: product!,
                totalValue: product?.price! * checkout.quantity!,
                linkPayment: payment_data.data.paymentLink,
                ...ButtonPixQrCode
            })
        })

        return;
    }
}