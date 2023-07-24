import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { AxiosGeneratorTemplate } from "../../@shared/utils/axios-template";
import { KeyNotFoundMessage } from "../../@shared/messages/KeyNotFound.message";
import { QueryingTheKeyMessage } from "../../@shared/messages/QueryingTheKey.message";
import { KeyDisableSuccessfullyMessage } from "./messages/KeyDisableSuccessfully.message";
import { KeyAlreadyDisabledMessage } from "./messages/KeyAlreadyDisabled.message";
import { KeyGeneratedModel } from "../../models/KeyGenerated.model";

class DisableKeyGeneratorCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "generator_disablekey",
            description: "Crie uma key para resgatar",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: "key",
                    description: "Desativar uma key que esteja ativada",
                    type: 3,
                    required: true
                }
            ]
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {

        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrador" }) })
            return;
        }

        const key = interaction.options.getString("key") as KeyGeneratedModel["key"]

        await interaction.reply({ ...QueryingTheKeyMessage({ interaction, client }) });

        try {
            const request = await AxiosGeneratorTemplate.post(`/server/keys/disable/${key}`)

            if (request.data.error.name === "KeyAlreadyDisabledError") {
                interaction.editReply({ ...KeyAlreadyDisabledMessage({ interaction, client }) });
                return;
            }

            if (request.status !== 201) throw new Error('Error not found');

            await interaction.editReply({ ...KeyDisableSuccessfullyMessage({ interaction, client }) })
        } catch (error) {
            interaction.editReply({ ...KeyNotFoundMessage({ client, interaction }) })
        }
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new DisableKeyGeneratorCommand()
    commandContainer.addCommand(command)
}