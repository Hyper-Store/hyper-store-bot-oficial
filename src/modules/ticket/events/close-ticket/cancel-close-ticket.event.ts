import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { NotIsOwnerMessage } from "../../@shared/not-is-owner/not-is-owner.message";

class CancelCloseTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "cancel-close-ticket") return;

        const ticketData: any = await new Database().get(`ticket.sessions.${interaction.channelId}`);

        if (ticketData.ownerId !== interaction.user.id) {
            interaction.reply({ ...NotIsOwnerMessage({ interaction, client }) })
            return;
        }

        interaction.update({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`${emojis.notifiy} Você cancelou o encerramento de seu ticket!`)
            ],
            components: []
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new CancelCloseTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}