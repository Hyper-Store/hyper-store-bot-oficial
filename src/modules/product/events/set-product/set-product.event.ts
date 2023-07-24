import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { ProductMessage } from "../../@shared/messages/product-message/product-message";
import { ProductRepository } from "../../repositories/product.repository";
import { ProductNotFoundMessage } from "../../@shared/messages/product-not-found/product-not-found.message";
import { ProductSetSucessfullyMessage } from "./messages/ProductSetSucessfully.message";


class SetProductEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "set-product") return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ client, interaction, permission: 'Administrador' }) })
            return;
        }

        const product = await ProductRepository.findById(interaction.values[0]);

        if (!product) {
            interaction.update({ ...ProductNotFoundMessage({ client, interaction }) })
        }

        const message_created = await interaction.channel?.send(await ProductMessage({ interaction, product: product! }))

        await ProductRepository.update({
            ...product!,
            channelId: message_created?.channelId,
            messageId: message_created?.id
        })

        interaction.update({ ...ProductSetSucessfullyMessage({ client, interaction }) });

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new SetProductEvent()
    buttonClickedEvent.setupConsumer(client)
}