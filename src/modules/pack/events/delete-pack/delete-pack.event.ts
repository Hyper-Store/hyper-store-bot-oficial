import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { PackRepository } from "../../repositories/Pack.repository";
import { PackNotExistErrorMessage } from "../../@shared/messages/pack-not-exist-error.message";
import { PackPanelMessage } from "../../@shared/messages/pack-panel.message";
import { PackDeleteSuccessfully } from "./messages/pack-delete-successfully.message";


class DeletePackEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "delete-pack") return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const packId = interaction.values[0];
        const pack = await PackRepository.findById(packId);

        if (!pack) {
            interaction.update({ ...PackNotExistErrorMessage({ interaction }) })
        }

        await PackRepository.delete(packId);

        interaction.update({ ...await PackDeleteSuccessfully({ interaction, pack: pack! }) })
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new DeletePackEvent()
    buttonClickedEvent.setupConsumer(client)
}