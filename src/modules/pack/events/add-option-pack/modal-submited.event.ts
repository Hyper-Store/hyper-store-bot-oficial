import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { Interaction, Message, } from "discord.js";
import Discord, { Client } from "discord.js"
import { PackRepository } from "../../repositories/Pack.repository";
import { PackNotExistErrorMessage } from "../../@shared/messages/pack-not-exist-error.message";
import { PackOptionRepository } from "../../repositories/PackOption.repository";
import { OptionPackCreatedSuccessMessage } from "./messages/option-pack-created-success.message";
import { UpdateMessagePack } from "../../@shared/workers/update-message-pack";


class AddOptionPackEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isModalSubmit()) return;
        if (!interaction.customId.startsWith('addoptionpack')) return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const [_, packId] = interaction.customId.split('_')
        const pack = await PackRepository.findById(packId);

        await interaction.deferUpdate({});

        if (!pack) {
            interaction.editReply({ ...PackNotExistErrorMessage({ interaction }) })
        }

        const title = interaction.fields.getTextInputValue("title");
        const content = interaction.fields.getTextInputValue("content");
        const url = interaction.fields.getTextInputValue("url");
        const youtubeURL = interaction.fields.getTextInputValue("youtubeURL");
        const emoji = interaction.fields.getTextInputValue("emoji");

        const option = await PackOptionRepository.create(packId, {
            title: title!,
            content: content!,
            url: url,
            youtubeURL: youtubeURL,
            emoji,
        })

        await UpdateMessagePack({ interaction, packId })

        interaction.editReply({ ...OptionPackCreatedSuccessMessage({ interaction, pack: pack!, option }) })
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new AddOptionPackEvent()
    buttonClickedEvent.setupConsumer(client)
}