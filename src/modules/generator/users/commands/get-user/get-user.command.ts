import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { QueryingUserMessage } from "../../@shared/messages/QueryingUser.message";
import { UserNotFoundMessage } from "../../@shared/messages/UserNotFound.message";
import { AxiosGeneratorTemplate } from "@/modules/generator/keys/@shared/utils/axios-template";
import { UserDetailsMessage } from "./messages/UserDetails.message";

class GetUserCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "generator_getuser",
            description: "Buscar por um usuário no gerador",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: "type",
                    description: "Insira o tipo de credencial para buscar",
                    type: 3,
                    choices: [
                        {
                            name: 'ID',
                            value: 'id'
                        },
                        {
                            name: 'Nome de usuário',
                            value: 'username',
                        },
                        {
                            name: 'Endereço de e-mail',
                            value: 'email'
                        }
                    ],
                    required: true
                },
                {
                    name: "user",
                    description: "Insira o usuário, seja: nome de usuário, email ou id",
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

        const type = interaction.options.getString('type') as string;
        const user = interaction.options.getString('user') as string;

        await interaction.reply({ ...QueryingUserMessage({ interaction, client }) });

        let credentials: any = {};

        if (type === "id") credentials.userId = user
        if (type === "username") credentials.username = user
        if (type === "email") credentials.email = user

        try {
            const request = await AxiosGeneratorTemplate.post('/server/auth/get-user-details', credentials)

            if (request.status !== 200) throw new Error('Error not found');

            await interaction.editReply({ ...UserDetailsMessage({ interaction, client, user: request.data }) })
        } catch (error) {
            interaction.editReply({ ...UserNotFoundMessage({ client, interaction, user }) })
        }
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new GetUserCommand()
    commandContainer.addCommand(command)
}