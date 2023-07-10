import { BaseEvent } from "@/modules/@shared/domain";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { FinishPaymentMercadoPagoCheckoutEvent } from "./mercadopago/finish-payment-mercado-pago";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { FinishPaypalPagoCheckoutEvent } from "./paypal/finish-payment-paypal";

class DefaultFinishPaymentCheckoutEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== 'method-payment') return;

        const checkout = await CheckoutRepository.findById(interaction.channelId);
        const product = await ProductRepository.findById(checkout?.productId!)

        await interaction.update({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.loading} Gerando pagamento, aguarde por favor...`)
            ],
            components: []
        })

        let priceCheckout = product?.price! * checkout?.quantity!

        if (interaction.values[0] === "paypal") priceCheckout = priceCheckout + (priceCheckout * 0.1);

        await CheckoutRepository.update({ ...checkout!, price: priceCheckout });

        if (interaction.values[0] === "mercadopago") {
            FinishPaymentMercadoPagoCheckoutEvent.execute(interaction, client);
            return;
        }

        if (interaction.values[0] === "paypal") {
            FinishPaypalPagoCheckoutEvent.execute(interaction, client);
            return;
        }

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new DefaultFinishPaymentCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}