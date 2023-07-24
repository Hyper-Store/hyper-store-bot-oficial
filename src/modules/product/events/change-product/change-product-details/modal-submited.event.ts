import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { ProductNotFoundMessage } from "@/modules/product/@shared/messages/product-not-found/product-not-found.message";
import { FormatPrice } from "@/modules/@shared/utils/format-price";
import { PanelChangeProductMessage } from "../open-panel-change-product/messages/panel-change-product.message";
import { ProductUpdatedSucessfullyMessage } from "../@shared/messages/product-updated-successfully.message";


class ChangeProductDetailsModalSubmitedEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isModalSubmit()) return;
        if (!interaction.customId.startsWith('change-product-details')) return;
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

        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description');
        const image = interaction.fields.getTextInputValue('image');
        const youtubeURL = interaction.fields.getTextInputValue('youtube-url');
        const price = interaction.fields.getTextInputValue('price');

        const product_updated = await ProductRepository.update({
            ...product,
            title,
            description,
            price: FormatPrice({ value: price, output: "float" })!,
            image,
            youtubeURL
        })

        await interaction.editReply({ ...await PanelChangeProductMessage({ client, interaction, product: product_updated }) })
        interaction.followUp({ ...ProductUpdatedSucessfullyMessage({ client, interaction }) })
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ChangeProductDetailsModalSubmitedEvent()
    buttonClickedEvent.setupConsumer(client)
}