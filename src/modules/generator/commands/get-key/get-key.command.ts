import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { RoleNotExistMessage } from "@/modules/@shared/messages/role-not-exist/role-not-exist.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { CreateKeyModel, CreateKeyModelMap } from "../../models/CreateKey.model";
import { KeyGeneratedModel } from "../../models/KeyGenerated.model";
import { QueryingTheKeyMessage } from "./messages/QueryingTheKey.message";
import { AxiosGeneratorTemplate } from "../../@shared/utils/axios-template";
import { KeyNotFoundMessage } from "../../@shared/messages/KeyNotFound.message";

class CreateKeyGeneratoCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "generator_getkey",
            description: "Crie uma key para resgatar",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [

                {
                    name: "key",
                    description: "Insira a key que você deseja buscar",
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
            const request = await AxiosGeneratorTemplate.get(`/server/keys/${key}`)

            console.log(request.data)
        } catch (error) {
            interaction.editReply({ ...KeyNotFoundMessage({ client, interaction }) })
        }
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new CreateKeyGeneratoCommand()
    commandContainer.addCommand(command)
}