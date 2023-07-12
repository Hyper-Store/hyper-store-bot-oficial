import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"

class CreatePackCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "createpack",
            description: "Criar um novo pack",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: 'title',
                    description: 'Adicione o título do pack',
                    type: 3,
                    required: true
                },
                {
                    name: 'description',
                    description: 'Adicione uma descrição ao pack',
                    type: 3,
                    required: true
                },
                {
                    name: "role",
                    description: "Insira o cargo que pode ter permissão para resgatar um pack!",
                    type: 8,
                    required: true
                },
                {
                    name: 'image',
                    description: 'Adicione uma imagem ao pack',
                    type: 11,
                },
            ]
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const role = interaction.options.getRole('role');


    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new CreatePackCommand()
    commandContainer.addCommand(command)
}