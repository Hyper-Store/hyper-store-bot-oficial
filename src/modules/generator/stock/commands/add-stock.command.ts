import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client, Message } from "discord.js";
import Discord from "discord.js"
import { AxiosGeneratorTemplate } from "@/modules/generator/keys/@shared/utils/axios-template";
import { CreateKeyModel, CreateKeyModelMap } from "../../keys/models/CreateKey.model";
import { AddStockGeneratorMessage } from "./messages/add-stock-generator.message";
import { GeneratorStockAddedSuccessfullyMessage } from "./messages/stock-added-sucessfully.message";
import { GeneratorStockAddedErrorMessage } from "./messages/stock-added-error.message";

class AddStockGeneratorCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "generator_addstock",
            description: "Adicionar estoque ao gerador",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: "service",
                    description: "Escolha o tipo de coisa que deve ser entregue",
                    type: 3,
                    choices: Object.entries(CreateKeyModelMap).map(([key, value]) => ({
                        name: value,
                        value: key,
                    })),
                    required: true
                },
            ]
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrador" }) })
            return;
        }

        const service = interaction.options.getString('service') as CreateKeyModel["service"];
        await interaction.reply({ ...AddStockGeneratorMessage({ client, interaction, service }) });


        const stock_collector: string[] = [];

        const collectorFilter = (m: Message) => m.author.id === interaction.user.id
        const collector = interaction.channel?.createMessageCollector({ filter: collectorFilter });

        collector?.on('collect', (message) => {
            message.delete();

            if (message.content === "finalizar") return collector.stop();
            message.content.split('\n').forEach(m => {
                stock_collector.push(m);
            })
        })

        collector?.on('end', async (message) => {
            try {
                const request = await AxiosGeneratorTemplate.post('/server/stock', {
                    stocks: stock_collector.map((s) => { return { value: s, serviceId: service } })
                })

                if (request.status !== 201) throw new Error('Error not found')

                interaction.editReply({ ...GeneratorStockAddedSuccessfullyMessage({ client, interaction, service, stock_collector }) })
            } catch (error) {
                interaction.editReply({ ...GeneratorStockAddedErrorMessage({ client, interaction, service }) })
            }
            return;
        })
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new AddStockGeneratorCommand()
    commandContainer.addCommand(command)
}