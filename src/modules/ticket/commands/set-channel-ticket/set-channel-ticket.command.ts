import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { TypeTicket } from "../../@shared/type-tickets/type-tickets";
import { DatabaseConfig } from "@/infra/app/setup-config";
import { ChannelNotIsOfTypeMessage } from "@/modules/@shared/messages/channel-not-is-of-type/channel-not-is-of-type.message";
import { TicketConfigRepository } from "../../repositories/TicketConfig.repository";
import { PanelTicketMessage } from "./messages/panel.message";
import { ChannelSetedSuccessfullyMessage } from "./messages/channel-seted-successfully.message";

class SetChannelTicketCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "setchannelticket",
            description: "Setar este canal como o canal para abertura de ticket's",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: "category",
                    description: "Categoria de onde vai ser aberto o ticket",
                    type: 7,
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

        const category_channel = interaction.options.getChannel("category");

        if (category_channel?.type !== Discord.ChannelType.GuildCategory) {
            interaction.reply({ ...ChannelNotIsOfTypeMessage({ client, interaction, channelType: "Categoria" }) })
            return;
        }

        const ticketConfig = await TicketConfigRepository.getAllOption();

        await interaction.channel?.send({ ...PanelTicketMessage({ client, interaction, banner: ticketConfig?.banner!, ticketType: TypeTicket }) })

        interaction.reply({ ...ChannelSetedSuccessfullyMessage({ client, interaction }) })
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new SetChannelTicketCommand()
    commandContainer.addCommand(command)
}