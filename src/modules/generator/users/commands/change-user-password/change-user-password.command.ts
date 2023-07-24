import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { QueryingUserMessage } from "../../@shared/messages/QueryingUser.message";
import { UserNotFoundMessage } from "../../@shared/messages/UserNotFound.message";
import { AxiosGeneratorTemplate } from "@/modules/generator/keys/@shared/utils/axios-template";
import { ChangeUserPasswordSucessfullyMessage } from "./messages/ChangeUserPasswordSucessfully.message";

class ChangeUserPasswordCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "generator_changepassword",
            description: "Trocar senha de um usuário do gerador",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: "userid",
                    description: "Insira o id do usuário que você deseja desbanir",
                    type: 3,
                    required: true
                },
                {
                    name: "password",
                    description: "Insira a nova senha do usuário",
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

        const userId = interaction.options.getString('userid') as string;
        const password = interaction.options.getString('password') as string;

        await interaction.reply({ ...QueryingUserMessage({ interaction, client }) });

        try {
            const request_user = await AxiosGeneratorTemplate.post('/server/auth/get-user-details', {
                userId
            })

            if (request_user.status !== 200) throw new Error('Error not found');

            const request = await AxiosGeneratorTemplate.post('/server/auth/change-password', {
                userId,
                password
            })

            if (request.status !== 200) throw new Error('Error not found');

            await interaction.editReply({ ...ChangeUserPasswordSucessfullyMessage({ interaction, client, user: request_user.data, password }) })
        } catch (error) {
            interaction.editReply({ ...UserNotFoundMessage({ client, interaction, user: userId }) })
        }
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new ChangeUserPasswordCommand()
    commandContainer.addCommand(command)
}