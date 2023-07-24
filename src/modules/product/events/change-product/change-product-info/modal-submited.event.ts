import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ProductNotFoundMessage } from "@/modules/product/@shared/messages/product-not-found/product-not-found.message";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { Interaction, } from "discord.js";
import Discord, { Client } from "discord.js"
import { PanelChangeProductMessage } from "../open-panel-change-product/messages/panel-change-product.message";


class ModalSubmitedChangeProductInfoEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isModalSubmit()) return;
        if (!interaction.customId.startsWith("change-product-info")) return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ client, interaction, permission: 'Administrador' }) })
            return;
        }

        const [_, product_id] = interaction.customId.split('_')

        const product = await ProductRepository.findById(product_id);

        await interaction.deferUpdate({});

        if (!product) {
            interaction.editReply({ ...ProductNotFoundMessage({ client, interaction }) })
            return;
        }

        const roleDelivery = interaction.fields.getTextInputValue('roledelivery');
        const messageDelivery = interaction.fields.getTextInputValue('messagedelivery');

        const product_updated = await ProductRepository.create({
            ...product,
            roleDelivery,
            messageDelivery
        })

        await interaction.deferUpdate();

        interaction.editReply({ ...await PanelChangeProductMessage({ client, interaction, product: product_updated! }) })
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ModalSubmitedChangeProductInfoEvent()
    buttonClickedEvent.setupConsumer(client)
}