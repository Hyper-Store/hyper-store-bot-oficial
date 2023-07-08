import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { Interaction, Message } from "discord.js";
import Discord, { Client } from "discord.js"
import { Database } from "@/infra/app/setup-database";
import { ProductNotExist } from "../@shared/_error/ProductNotExist.error";
import { ProductType } from "@/modules/purchases/@types/Product.type";
import { NoStockProduct } from "../@shared/_error/NoStockProduct.error";


class StartCheckoutPurchasesEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith('buy')) return;

        const [, product_id] = interaction.customId.split("_");

        const product: ProductType | undefined = await new Database().get(`purchases.products.${product_id}`) as ProductType;

        if (!product) {
            interaction.reply({ ...ProductNotExist(interaction) })
            return;
        }

        if (product.stock.length < 1) {
            interaction.reply({ ...await NoStockProduct(interaction) })
            return;
        }
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new StartCheckoutPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}