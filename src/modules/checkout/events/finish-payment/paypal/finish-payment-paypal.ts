import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import { Client } from "discord.js"
import { CreatePaymentManagementUsecase } from "@/modules/payment/management/usecases";
import { GenerateMercadopagoPaymentUsecase } from "@/modules/payment/providers/mercadopago/usecases/mercadopago-actions";
import { CheckoutRepository } from "@/modules/checkout/repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { GeneratePaypalPaymentUsecase } from "@/modules/payment/providers/paypal/usecases/paypal-actions";


export class FinishPaypalPagoCheckoutEvent {
    static async execute(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== 'method-payment') return;
        if (interaction.values[0] !== "paypal") return;

        const checkout = await CheckoutRepository.findById(interaction.channelId)
        const product = await ProductRepository.findById(checkout?.productId!);

        if (interaction.user.id !== checkout?.ownerId) return;

        new CreatePaymentManagementUsecase().execute({ checkoutId: checkout.id });

        await GeneratePaypalPaymentUsecase.execute({ amount: product?.price! * checkout?.quantity!, paymentManagementId: checkout?.id })

        interaction.editReply({
            // ...FinishPaymentMercadoPagoMessage({
            //     product: product!,
            //     totalValue: product?.price! * checkout.quantity!,
            //     linkPayment: payment_data.data.paymentLink,
            //     ...ButtonPixQrCode
            // })
        })

        return;
    }
}