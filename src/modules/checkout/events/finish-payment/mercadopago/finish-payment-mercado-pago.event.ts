import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { Database } from "@/infra/app/setup-database";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { CreatePaymentManagementUsecase } from "@/modules/payment/management/usecases";
import { GenerateMercadopagoPaymentUsecase } from "@/modules/payment/providers/mercadopago/usecases/mercadopago-actions";
import { CheckoutRepository } from "@/modules/checkout/repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";

class FinishPaymentMercadoPagoPurchasesEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
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

        console.log(payment_data.data.paymentLink)
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new FinishPaymentMercadoPagoPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}