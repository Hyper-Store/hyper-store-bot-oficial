import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { HasPermissionTeam } from "@/modules/ticket/@shared/has-permission-team/has-permission-team";
import { NotIsOwnerMessage } from "@/modules/ticket/@shared/not-is-owner/not-is-owner.message";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"

class PainelTeamOpenPanelTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "panel-team") return;

        const ticketConfig: any = await new Database().get(`ticket.config.support_role`);

        if (!HasPermissionTeam({ interaction, client, support_role: ticketConfig?.support_role })) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: 'Suporte' }) })
            return;
        }

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.notifiy} Seja bem-vindo ao painel team do nosso sistema de ticket, escolha uma opção abaixo para continuar`)
            ],
            components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId('panel-team-options')
                            .setPlaceholder('➡️ Escolha uma opção para continuar')
                            .addOptions(
                                {
                                    emoji: emojis.email,
                                    label: 'Verificar e-mail',
                                    description: 'Veja o e-mail para contato adicionado pelo usuário',
                                    value: 'verify-email',
                                },
                                {
                                    emoji: emojis.save,
                                    label: 'Salvar logs',
                                    description: 'Fazer backup de todas as conversas',
                                    value: 'save-logs',
                                },
                                {
                                    emoji: emojis.notifiy,
                                    label: 'Enviar notificação',
                                    description: 'Envie uma notificação no privado do usuário',
                                    value: 'send-notify',
                                },
                                {
                                    emoji: emojis.delete,
                                    label: 'Fechar ticket',
                                    description: 'Fechar o ticket diretamente',
                                    value: 'close-ticket',
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
    const buttonClickedEvent = new PainelTeamOpenPanelTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}