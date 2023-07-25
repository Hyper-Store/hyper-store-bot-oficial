import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { ProductGroupRepository } from "../../repositories/product-group.repository";
import { GroupNotExistMessage } from "../../@shared/messages/group-not-exist/group-not-exist.message";
import { GroupPanelMessage } from "../../@shared/messages/group-panel/group-panel.message";


class SetProductGroupEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "set-product-group") return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ client, interaction, permission: 'Administrador' }) })
            return;
        }

        const group = await ProductGroupRepository.findById(interaction.values[0]);
        if (!group) {
            interaction.reply({ ...GroupNotExistMessage({ client, interaction }), ephemeral: true })
            return;
        }

        interaction.channel?.send({ ...await GroupPanelMessage({ client, interaction, groupId: group.id! }) })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new SetProductGroupEvent()
    buttonClickedEvent.setupConsumer(client)
}