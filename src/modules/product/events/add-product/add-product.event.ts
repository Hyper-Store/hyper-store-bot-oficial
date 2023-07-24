import { DatabaseConfig } from "@/infra/app/setup-config";
import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { Interaction, Message, } from "discord.js";
import Discord, { Client } from "discord.js"


class AddProductEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "add_product") return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const modal = new Discord.ModalBuilder()
            .setCustomId("add_product")
            .setTitle("Adicionar novo produto")

        const title = new Discord.TextInputBuilder()
            .setCustomId("title")
            .setLabel("Título do produto")
            .setPlaceholder('Example')
            .setMinLength(2)
            .setRequired(true)
            .setStyle(1)

        const description = new Discord.TextInputBuilder()
            .setCustomId("description")
            .setLabel("Descrição do produto")
            .setPlaceholder('Example')
            .setMinLength(5)
            .setRequired(true)
            .setStyle(2)

        const image = new Discord.TextInputBuilder()
            .setCustomId("image")
            .setLabel("Imagem do produto")
            .setPlaceholder('https://imgur.com/1237138')
            .setMinLength(5)
            .setRequired(false)
            .setStyle(1)

        const price = new Discord.TextInputBuilder()
            .setCustomId("price")
            .setLabel("Preço do produto")
            .setPlaceholder('2,00')
            .setMinLength(1)
            .setRequired(true)
            .setStyle(1)

        const youtubeURL = new Discord.TextInputBuilder()
            .setCustomId("youtube-url")
            .setLabel("Vídeo no youtube")
            .setPlaceholder('youtube.com/@hyperstore')
            .setMinLength(1)
            .setRequired(false)
            .setStyle(1)

        modal.addComponents(
            new Discord.ActionRowBuilder<any>().addComponents(title),
            new Discord.ActionRowBuilder<any>().addComponents(description),
            new Discord.ActionRowBuilder<any>().addComponents(image),
            new Discord.ActionRowBuilder<any>().addComponents(price),
            new Discord.ActionRowBuilder<any>().addComponents(youtubeURL),
        )

        interaction.showModal(modal);
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new AddProductEvent()
    buttonClickedEvent.setupConsumer(client)
}