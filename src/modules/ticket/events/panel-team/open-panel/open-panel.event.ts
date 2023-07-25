import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { HasPermissionTeam } from "@/modules/ticket/@shared/has-permission-team/has-permission-team";
import { TicketConfigRepository } from "@/modules/ticket/repositories/TicketConfig.repository";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { PanelTeamMessage } from "./messages/PanelTeam.message";

class PainelTeamOpenPanelTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "panel-team") return;

        const ticketConfig = await TicketConfigRepository.getAllOption()

        if (!HasPermissionTeam({ interaction, client, support_role: ticketConfig?.support_role! })) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: 'Suporte' }) })
            return;
        }

        interaction.reply({ ...PanelTeamMessage({ client, interaction }) })
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PainelTeamOpenPanelTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}