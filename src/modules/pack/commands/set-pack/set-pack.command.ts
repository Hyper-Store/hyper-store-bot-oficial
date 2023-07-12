import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { PackRepository } from "../../repositories/Pack.repository";
import { NotHavePackCreatedErrorMessage } from "../../@shared/messages/not-have-pack-created-error.message";
import { SelectPackMessage } from "../../@shared/messages/select-pack.message";
import { emojis } from "@/modules/@shared/utils/emojis";

class SetPackCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "setpack",
            description: "Setar um pack a este canal",
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
                description: `> ${emojis.notifiy} Escolha um pack para setar neste canal!`,
                customId: 'set-pack'
            })
        });
        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new SetPackCommand()
    commandContainer.addCommand(command)
}