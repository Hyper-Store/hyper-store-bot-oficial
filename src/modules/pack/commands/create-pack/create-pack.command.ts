import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { PackRepository } from "../../repositories/Pack.repository";
import { PackCreatedSuccessfully } from "./messages/pack-created-successfully.message";

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
                    type: 11
                },
            ]
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const role = interaction.options.getRole('role');
        const image = interaction.options.getAttachment('image')

        const pack = await PackRepository.create({
            title: title!,
            description: description!,
            role: role?.id!,
            image: image?.url
        })

        interaction.reply({ ...PackCreatedSuccessfully({ interaction, pack }) })
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new CreatePackCommand()
    commandContainer.addCommand(command)
}