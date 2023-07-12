import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { Interaction, Message, } from "discord.js";
import Discord, { Client } from "discord.js"
import { PackRepository } from "../../repositories/Pack.repository";
import { PackNotExistErrorMessage } from "../../@shared/messages/pack-not-exist-error.message";


class AddOptionPackEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "add-option-pack") return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const packId = interaction.values[0];
        const pack = PackRepository.findById(packId);

        if (!pack) {
            interaction.update({ ...PackNotExistErrorMessage({ interaction }) })
        }

        const modal = new Discord.ModalBuilder()
            .setCustomId(`addoptionpack_${packId}`)
            .setTitle("Adicionar opção ao pack")

        const title_input = new Discord.TextInputBuilder()
            .setCustomId("title")
            .setLabel("Títutlo")
            .setMinLength(3)
            .setRequired(true)
            .setStyle(1)

        const content_input = new Discord.TextInputBuilder()
            .setCustomId("content")
            .setLabel("Conteúdo enviado ao usuário")
            .setMinLength(3)
            .setRequired(true)
            .setStyle(2)

        const url_input = new Discord.TextInputBuilder()
            .setCustomId("url")
            .setLabel("URL Download ou Link")
            .setMinLength(3)
            .setRequired(false)
            .setStyle(1)

        const youtubeURL_input = new Discord.TextInputBuilder()
            .setCustomId("youtubeURL")
            .setLabel("Youtube URL")
            .setMinLength(3)
            .setRequired(false)
            .setStyle(1)

        const emoji_input = new Discord.TextInputBuilder()
            .setCustomId("emoji")
            .setLabel("Emoji")
            .setMinLength(1)
            .setRequired(false)
            .setStyle(1)

        modal.addComponents(
            new Discord.ActionRowBuilder<any>().addComponents(title_input),
            new Discord.ActionRowBuilder<any>().addComponents(content_input),
            new Discord.ActionRowBuilder<any>().addComponents(url_input),
            new Discord.ActionRowBuilder<any>().addComponents(youtubeURL_input),
            new Discord.ActionRowBuilder<any>().addComponents(emoji_input),
        )

        interaction.showModal(modal);
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new AddOptionPackEvent()
    buttonClickedEvent.setupConsumer(client)
}