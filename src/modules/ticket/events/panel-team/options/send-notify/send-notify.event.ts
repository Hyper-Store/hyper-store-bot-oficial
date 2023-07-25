import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { HasPermissionTeam } from "@/modules/ticket/@shared/has-permission-team/has-permission-team";
import { NotIsOwnerMessage } from "@/modules/ticket/@shared/not-is-owner/not-is-owner.message";
import { TicketRepository } from "@/modules/ticket/repositories/Ticket.repository";
import { TicketConfigRepository } from "@/modules/ticket/repositories/TicketConfig.repository";
import { Collection, Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import fs from 'fs';
import { NotificationSent } from "./messages/NotificationSent.message";
import { NotifyMessage } from "./messages/Notify.message";

class PainelTeamSendNotifyTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "panel-team-options") return;
        if (interaction.values[0] !== "send-notify") return;
        if (interaction.channel?.type !== Discord.ChannelType.GuildText) return;

        const ticketConfig = await TicketConfigRepository.getAllOption()
        const ticketData = await TicketRepository.findById(interaction.channelId);
        const ownerUser = interaction.guild?.members.cache.get(ticketData?.ownerId!)

        if (!HasPermissionTeam({ interaction, client, support_role: ticketConfig?.support_role! })) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: 'Suporte' }) })
            return;
        }

        await ownerUser?.send({ ...NotifyMessage({ client, interaction }) });

        interaction.update({ ...NotificationSent({ client, interaction, ownerUser: ownerUser! }) })
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PainelTeamSendNotifyTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}