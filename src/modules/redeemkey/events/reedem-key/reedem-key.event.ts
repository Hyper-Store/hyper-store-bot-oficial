import { BaseEvent } from "@/modules/@shared/domain";
import { CacheType, Interaction, ClientEvents } from "discord.js";
import Discord, { Client } from "discord.js"


class ReedemKeyEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "reedem_key") return;

        const modal = new Discord.ModalBuilder()
            .setCustomId("reedem_key")
            .setTitle("Resgatar key")

        const reason_input = new Discord.TextInputBuilder()
            .setCustomId("key")
            .setLabel("Insira sua key")
            .setPlaceholder("XXXX-XXXX-XXXX")
            .setMinLength(5)
            .setRequired(true)
            .setStyle(1)

        modal.addComponents(
            new Discord.ActionRowBuilder<any>().addComponents(reason_input),
        )

        interaction.showModal(modal);
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ReedemKeyEvent()
    buttonClickedEvent.setupConsumer(client)
}