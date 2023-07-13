import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { SelectPackMessage } from "../../@shared/messages/select-pack.message";
import { emojis } from "@/modules/@shared/utils/emojis";

class EditPackCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "editpack",
            description: "Editar um pack",
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        interaction.reply({
            ...await SelectPackMessage({
                interaction,
                description: `> ${emojis.notifiy} Escolha um pack para editar!`,
                customId: 'edit-pack'
            })
        });
        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new EditPackCommand()
    commandContainer.addCommand(command)
}