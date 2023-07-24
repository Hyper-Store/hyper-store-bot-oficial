import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { ProductListUpdate } from "../../../@shared/product-list/product-list-update";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { PanelChangeProductMessage } from "./messages/panel-change-product.message";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { ProductNotFoundMessage } from "@/modules/product/@shared/messages/product-not-found/product-not-found.message";


class OpenPanelChangeProductEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "change-product") return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ client, interaction, permission: 'Administrador' }) })
            return;
        }

        const product = await ProductRepository.findById(interaction.values[0]);

        if (!product) {
            interaction.update({ ...ProductNotFoundMessage({ client, interaction }) })
        }

        interaction.update({ ...await PanelChangeProductMessage({ client, interaction, product: product! }) })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new OpenPanelChangeProductEvent()
    buttonClickedEvent.setupConsumer(client)
}