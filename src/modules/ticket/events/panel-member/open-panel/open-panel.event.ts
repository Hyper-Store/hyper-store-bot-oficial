import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { NotIsOwnerMessage } from "@/modules/ticket/@shared/not-is-owner/not-is-owner.message";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"

class PainelMemberOpenPanelTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "panel-member") return;

        const ticketData: any = await new Database().get(`ticket.sessions.${interaction.channelId}`);

        if (ticketData.ownerId !== interaction.user.id) {
            interaction.reply({ ...NotIsOwnerMessage({ interaction, client }) })
            return;
        }

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.notifiy} Seja bem-vindo ao painel membro do nosso sistema de ticket, escolha uma opção abaixo para continuar`)
            ],
            components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId('panel-member-options')
                            .setPlaceholder('➡️ Escolha uma opção para continuar')
                            .addOptions(
                                {
                                    emoji: emojis.save,
                                    label: 'Salvar logs',
                                    description: 'Fazer backup de todas as conversas',
                                    value: 'save-logs',
                                }
                            )
                    )
            ],
            ephemeral: true
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PainelMemberOpenPanelTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}