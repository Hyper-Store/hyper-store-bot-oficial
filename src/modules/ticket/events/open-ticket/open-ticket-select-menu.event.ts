import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { TicketAlreadyOpenMessage } from "./messages/TicketAlreadyOpen.message";

export const formData = {
    typeTicket: ""
};

class ButtonClickedEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "open_ticket") return;

        const channel_exist = await interaction.guild?.channels.cache.find(c => /^(❌|💸|📦|💡)・(orçamento-|compra-|closed-|dúvida-)?\w+$/.test(c.name));
        if (channel_exist) {
            interaction.reply({ ...TicketAlreadyOpenMessage({ channel: channel_exist, client, interaction }) })
            return;
        }

        formData.typeTicket = interaction.values[0]

        const modal = new Discord.ModalBuilder()
            .setCustomId("start_ticket")
            .setTitle("Abrir ticket")

        const reason_input = new Discord.TextInputBuilder()
            .setCustomId("reason")
            .setLabel("Motivo do ticket")
            .setMinLength(5)
            .setRequired(true)
            .setStyle(2)

        modal.addComponents(
            new Discord.ActionRowBuilder<any>().addComponents(reason_input),
        )

        interaction.showModal(modal);
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ButtonClickedEvent()
    buttonClickedEvent.setupConsumer(client)
}