import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { CheckoutChannelDelete } from "../../events/close-channel-checkout/checkout-channel-delete";

export class CloseChannelCheckoutRabbitMq {
    static async execute({ checkoutId, time }: CheckoutChannelDelete.Input): Promise<void> {
        const rabbitmq = await RabbitmqSingletonService.getInstance()
        rabbitmq.publishInQueue('closeChannelCheckoutCommandQueue', JSON.stringify({
            checkoutId,
            time
        }))

        return;
    }
}