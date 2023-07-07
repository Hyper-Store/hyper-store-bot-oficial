import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { NotIsOwnerMessage } from "../../@shared/not-is-owner/not-is-owner.message";

class CloseTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "close-ticket") return;

        const ticketData: any = await new Database().get(`ticket.sessions.${interaction.channelId}`);

        if (ticketData.ownerId !== interaction.user.id) {
            interaction.reply({ ...NotIsOwnerMessage({ interaction, client }) })
            return;
        }

        interaction.reply({
            content: `||${interaction.user}||`,
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.notifiy} Você realmente deseja fechar seu ticket?`)
            ],
            components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('confirm-close-ticket')
                            .setLabel('Fechar ticket')
                            .setEmoji(emojis.confirm)
                            .setStyle(Discord.ButtonStyle.Danger)
                    )
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('cancel-close-ticket')
                            .setLabel('Cancelar')
                            .setEmoji(emojis.cancel)
                            .setStyle(Discord.ButtonStyle.Secondary)
                    )
            ],
            ephemeral: true
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new CloseTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}