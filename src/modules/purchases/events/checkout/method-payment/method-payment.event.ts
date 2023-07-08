import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction, Message } from "discord.js";
import Discord, { Client } from "discord.js"
import { Database } from "@/infra/app/setup-database";
import { ProductType } from "@/modules/purchases/@types/Product.type";
import { CheckoutType } from "../@shared/_types/Checkout.type";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { DatabaseConfig } from "@/infra/app/setup-config";

class MethodPaymentCheckoutPurchasesPurchasesEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'go-method-payment') return;

        const checkout = await new Database().get(`purchases.checkouts.${interaction.channelId}`) as CheckoutType;
        const product: ProductType | undefined = await new Database().get(`purchases.products.${checkout.productId}`) as ProductType;

        if (interaction.user.id !== checkout.ownerId) return;

        interaction.update({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setTitle(`${interaction.guild?.name} | Método de pagamento`)
                    .setDescription(`> ${emojis.notifiy} Selecione um método de pagamento para continuar sua compra!`)
                    .setImage(new DatabaseConfig().get(`purchases.products.banner`) as string)
            ],
            components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId('method-payment')
                            .setPlaceholder('🏦 Escolha o método de pagamento')
                            .setOptions(
                                {
                                    emoji: "💰",
                                    label: "Saldo na conta",
                                    description: "Taxa 0% | Entrega automática",
                                    value: "saldo",
                                },
                                {
                                    emoji: emojis.mercadopago,
                                    label: "Mercado Pago (PIX E QR CODE)",
                                    description: "Taxa 0% | Entrega automática",
                                    value: "mercadopago"
                                },
                                {
                                    emoji: emojis.paypal,
                                    label: "Paypal",
                                    description: "Taxa 10% | Entrega automática",
                                    value: "paypal"
                                }
                            )
                    )
            ]
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new MethodPaymentCheckoutPurchasesPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}