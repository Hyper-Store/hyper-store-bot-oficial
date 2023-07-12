import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { CancelCheckoutMessage } from "./messages/cancel-checkout.message";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { CancelCheckoutUsecase } from "../../usecases";
import { CloseChannelCheckoutRabbitMq } from "../../@shared/rabbitmq/close-channel-checkout.rabbitmq";
import { PaymentManagementRepository } from "@/modules/payment/management/repositories";
import { RabbitmqSingletonService } from "@/modules/@shared/services";

class CancelChannelCheckoutEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })

    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "cancel-checkout") return;

        const checkout = await CheckoutRepository.findById(interaction.channelId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const paymentManagment = await PaymentManagementRepository.findById(checkout?.id!);

        if (interaction.user.id !== checkout?.ownerId) return;


        if (paymentManagment?.hasPaymentProvider()) {
            const rabbitmq = await RabbitmqSingletonService.getInstance()
            await rabbitmq.publishInQueue('cancelPaymentProviderQueue', JSON.stringify({ checkoutId: checkout?.id! }))
        } else {
            await CancelCheckoutUsecase.execute({ checkoutId: checkout.id, emmitEvent: false })
        }

        await CloseChannelCheckoutRabbitMq.execute({ checkoutId: checkout.id })

        interaction.user.send({
            ...await CancelCheckoutMessage({
                interaction,
                checkout: checkout!,
                product: product!
            })
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new CancelChannelCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}