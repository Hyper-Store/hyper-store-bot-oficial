import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { PanelKeyMessage } from "./messages/panel.message";
import { ChannelSetedSuccessfullyMessage } from "./messages/channel-seted-successfully.message";

class SetChannelReedemKeyCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "setchannelreedemkey",
            description: "Setar o canal atual para os usuários resgatarem as keys",
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {

        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrador" }) })
            return;
        }

        await interaction.channel?.send({ ...PanelKeyMessage({ client, interaction }) })

        interaction.reply({ ...ChannelSetedSuccessfullyMessage({ client, interaction }) })

        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new SetChannelReedemKeyCommand()
    commandContainer.addCommand(command)
}