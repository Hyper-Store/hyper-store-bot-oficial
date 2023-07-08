import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { Database } from "@/infra/app/setup-database";
import { ProductType } from "@/modules/purchases/@types/Product.type";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { CheckoutType } from "../../@shared/_types/Checkout.type";
import { CreatePaymentManagementUsecase } from "@/modules/payment/management/usecases";
import { GenerateMercadopagoPaymentUsecase } from "@/modules/payment/providers/mercadopago/usecases/mercadopago-actions";

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

        const checkout = await new Database().get(`purchases.checkouts.${interaction.channelId}`) as CheckoutType;
        const product: ProductType | undefined = await new Database().get(`purchases.products.${checkout.productId}`) as ProductType;

        if (interaction.user.id !== checkout.ownerId) return;

        new CreatePaymentManagementUsecase().execute({ checkoutId: checkout.id });

        new GenerateMercadopagoPaymentUsecase().execute({ product: {} })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new FinishPaymentMercadoPagoPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}