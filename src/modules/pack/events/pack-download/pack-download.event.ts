import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { PackRepository } from "../../repositories/Pack.repository";
import { PackNotExistErrorMessage } from "../../@shared/messages/pack-not-exist-error.message";
import { PackPanelMessage } from "../../@shared/messages/pack-panel.message";
import { NotHavePermissionMessage } from "./messages/not-have-permission.message";
import { PackOptionRepository } from "../../repositories/PackOption.repository";
import { PackOptionNotExistErrorMessage } from "../../@shared/messages/pack-option-not-exist-error.message";
import { PackDownloadMessage } from "./messages/pack-download.message";
import { PackDownloadSent } from "./messages/pack-download-sent.message";


class PackDownloadEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (!interaction.customId.startsWith("pack-download")) return;
        if (Array.isArray(interaction.member?.roles)) return;

        const [_, packId] = interaction.customId.split('_');
        const pack = await PackRepository.findById(packId);

        if (!pack) {
            interaction.reply({ ...PackNotExistErrorMessage({ interaction }) as Discord.InteractionReplyOptions })
        }

        const pack_role = interaction.guild?.roles.cache.get(pack?.role!);
        if (!interaction.member?.roles.cache.get(pack_role?.id!)) {
            interaction.reply({ ...await NotHavePermissionMessage({ interaction, role: pack_role! }) })
            return;
        }

        const option_pack = await PackOptionRepository.findById(packId, interaction.values[0]);
        if (!option_pack) {
            interaction.reply({ ...PackOptionNotExistErrorMessage({ interaction }), })
            return;
        }

        await interaction.user.send({ ...PackDownloadMessage({ interaction, option: option_pack!, pack: pack! }) })

        interaction.reply({ ...PackDownloadSent({ interaction }) })
        return
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PackDownloadEvent()
    buttonClickedEvent.setupConsumer(client)
}