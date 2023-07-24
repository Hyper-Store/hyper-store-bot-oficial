import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { QueryingUserMessage } from "../../@shared/messages/QueryingUser.message";
import { UserNotFoundMessage } from "../../@shared/messages/UserNotFound.message";
import { AxiosGeneratorTemplate } from "@/modules/generator/keys/@shared/utils/axios-template";
import { UserAlreadyUnBannedMessage } from "./messages/UserAlreadyUnBanned.message";
import { UserUnBannedSucessfullyMessage } from "./messages/UserUnBannedSucessfully.message";

class UnbanUserCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "generator_unbanuser",
            description: "Desbanir um usuário do gerador",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: "userid",
                    description: "Insira o id do usuário que você deseja desbanir",
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

        await interaction.reply({ ...QueryingUserMessage({ interaction, client }) });

        try {
            const request_user = await AxiosGeneratorTemplate.post('/server/auth/get-user-details', {
                userId
            })

            if (request_user.status !== 200) throw new Error('Error not found');

            const request = await AxiosGeneratorTemplate.post('/server/auth/unban', {
                userId
            })

            if (request.data && request.data.error && request.data.error.name === "UserAlreadyUnBannedError") {
                interaction.editReply({ ...UserAlreadyUnBannedMessage({ client, interaction, user: request_user.data }) })
                return;
            }

            if (request.status !== 200) throw new Error('Error not found');

            await interaction.editReply({ ...UserUnBannedSucessfullyMessage({ interaction, client, user: request_user.data }) })
        } catch (error) {
            interaction.editReply({ ...UserNotFoundMessage({ client, interaction, user: userId }) })
        }
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new UnbanUserCommand()
    commandContainer.addCommand(command)
}