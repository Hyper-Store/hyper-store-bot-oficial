import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import { Client } from "discord.js"
import { ProductListUpdate } from "../../@shared/product-list/product-list-update";


class PageProductListEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith('page-', 5)) return;

        const [_, page_string] = interaction.customId.split('page-');

        let page = parseInt(page_string);

        if (interaction.customId.startsWith('next-page')) { page = page + 1; }
        if (interaction.customId.startsWith('back-page')) { page = page - 1; }

        const message = interaction.message;

        await interaction.deferUpdate();

        interaction.editReply({
            ...await ProductListUpdate({
                interaction,
                client,
                customId: message.components[0].components[0].customId!,
                description: message.embeds[0].description!,
                page: page,
            })
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PageProductListEvent()
    buttonClickedEvent.setupConsumer(client)
}