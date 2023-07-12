import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { NotHavePackCreatedErrorMessage } from "../../@shared/messages/not-have-pack-created-error.message";
import { PackRepository } from "../../repositories/Pack.repository";
import { SelectPackMessage } from "../../@shared/messages/select-pack.message";
import { emojis } from "@/modules/@shared/utils/emojis";

class AddOptionPackCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "addoptionpack",
            description: "Adicionar uma opção a um pack",
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const packCount = await PackRepository.count();
        if (packCount < 1) {
            interaction.reply({ ...NotHavePackCreatedErrorMessage({ interaction }) })
            return;
        }

        interaction.reply({
            ...await SelectPackMessage({
                interaction,
                description: `> ${emojis.notifiy} Escolha um pack para adicionar opções a ele!`,
                customId: 'add-option-pack'
            })
        });

        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new AddOptionPackCommand()
    commandContainer.addCommand(command)
}