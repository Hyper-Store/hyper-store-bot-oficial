import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { Interaction, } from "discord.js";
import Discord, { Client } from "discord.js"
import { ProductRepository } from "../../repositories/product.repository";
import { ProductCreatedSucessfullyMessage } from "./messages/ProductCreatedSuccessfully.message";
import { ProductPriceInvalidMessage } from "./messages/ProductPriceInvalid.message";
import { FormatPrice } from "@/modules/@shared/utils/format-price";


class ModalSubmitedAddProductEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "add_product") return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description');
        const image = interaction.fields.getTextInputValue('image');
        const youtubeURL = interaction.fields.getTextInputValue('youtube-url');
        const price_input = interaction.fields.getTextInputValue('price');

        const price = FormatPrice({ value: price_input, output: 'float' }) as number;

        await interaction.deferUpdate();

        if (isNaN(price) || price < 1 || price > 1000) {
            interaction.editReply({ ...ProductPriceInvalidMessage({ client, interaction, price }) })
            return;
        }

        const product = await ProductRepository.create({
            title,
            description,
            price,
            image,
            youtubeURL
        })


        interaction.editReply({ ...ProductCreatedSucessfullyMessage({ client, interaction, product: product! }) })
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ModalSubmitedAddProductEvent()
    buttonClickedEvent.setupConsumer(client)
}