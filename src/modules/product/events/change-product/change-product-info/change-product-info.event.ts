import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { ProductNotFoundMessage } from "@/modules/product/@shared/messages/product-not-found/product-not-found.message";

class ChangeProductInfoEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith("change-product-info")) return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ client, interaction, permission: 'Administrador' }) })
            return;
        }

        const [_, product_id] = interaction.customId.split('_')

        const product = await ProductRepository.findById(product_id);

        if (!product) {
            interaction.update({ ...ProductNotFoundMessage({ client, interaction }) })
        }

        const modal = new Discord.ModalBuilder()
            .setCustomId(interaction.customId)
            .setTitle("Editar informações produto")

        const roleDelivery = new Discord.TextInputBuilder()
            .setCustomId("roledelivery")
            .setLabel("Cargo entrega")
            .setPlaceholder('000000000000')
            .setRequired(true)
            .setStyle(1)
            .setValue(product?.roleDelivery ?? "")

        const messageDelivery = new Discord.TextInputBuilder()
            .setCustomId("messagedelivery")
            .setLabel("Mensagem entrega")
            .setPlaceholder('Example')
            .setRequired(true)
            .setStyle(2)
            .setValue(product?.messageDelivery ?? "")

        modal.addComponents(
            new Discord.ActionRowBuilder<any>().addComponents(roleDelivery),
            new Discord.ActionRowBuilder<any>().addComponents(messageDelivery),
        )

        interaction.showModal(modal);
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ChangeProductInfoEvent()
    buttonClickedEvent.setupConsumer(client)
}