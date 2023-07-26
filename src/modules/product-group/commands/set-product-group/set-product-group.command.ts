import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client, User } from "discord.js";
import Discord from "discord.js"
import { ProductGroupRepository } from "../../repositories/product-group.repository";
import { NotHaveProductGroupMessage } from "../../@shared/messages/not-have-product-group/not-have-product-group.message";
import { ProductGroupListMessage } from "../../@shared/messages/product-group-list/product-group-list.message";
import { emojis } from "@/modules/@shared/utils/emojis";
class SetProductGroupCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "productgroup_set",
            description: "Setar um grupo a este canal",
            type: Discord.ApplicationCommandType.ChatInput,
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const groupList = await ProductGroupRepository.getAll();
        if (groupList.length < 1) {
            interaction.reply({ ...NotHaveProductGroupMessage({ client }) })
            return;
        }

        interaction.reply({
            ...await ProductGroupListMessage({
                client,
                customId: 'set-product-group',
                description: `> ${emojis.notifiy} Escolha um grupo para setar a este canal`,
                groups: groupList,
                interaction
            })
        })
        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new SetProductGroupCommand()
    commandContainer.addCommand(command)
}