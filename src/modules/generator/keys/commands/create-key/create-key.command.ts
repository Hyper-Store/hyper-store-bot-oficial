import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { RoleNotExistMessage } from "@/modules/@shared/messages/role-not-exist/role-not-exist.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { CreateKeyModel, CreateKeyModelMap } from "../../models/CreateKey.model";
import { GeneratingKeyMessage } from "./messages/GeneratingKey.message";
import { AxiosGeneratorTemplate } from "../../@shared/utils/axios-template";
import { ErrorGenerateKeyMessage } from "./messages/ErrorGenerateKey.message";
import { AxiosError } from "axios";
import { KeyGeneratedSuccessfully } from "./messages/KeyGeneratedSuccessfully.message";
import { KeyGeneratedMessage } from "./messages/KeyGenerated.message";

class CreateKeyGeneratoCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "generator_createkey",
            description: "Crie uma key para resgatar",
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
                {
                    name: "daystoexpire",
                    description: "Insira após quantos dias a key deve expirar",
                    type: 10,
                    min_value: 1,
                    max_value: 30,
                    required: true
                },
                {
                    name: "quantityperday",
                    description: "Insira a quantidade de contas o usuário pode gerar por dia",
                    type: 10,
                    min_value: 1,
                    max_value: 10,
                    required: true
                },
                {
                    name: "quantity",
                    description: "Insira a quantidade de keys você deseja duplicar",
                    type: 10,
                    min_value: 1,
                    max_value: 20,
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

        const service = interaction.options.getString("service") as CreateKeyModel["service"]
        const daysToExpire = interaction.options.getNumber("daystoexpire") as CreateKeyModel["daysToExpire"];
        const quantity = interaction.options.getNumber("quantity") as CreateKeyModel["quantity"];
        const quantityPerDay = interaction.options.getNumber("quantityperday") as CreateKeyModel["quantityPerDay"];

        await interaction.reply({ ...GeneratingKeyMessage({ interaction, client }) });

        try {
            const request = await AxiosGeneratorTemplate.post('/server/keys', {
                serviceId: service,
                validUntil: daysToExpire,
                quantity,
                quantityPerDay
            })

            if (request.status !== 201) throw new Error('Error not found');

            await interaction.user.send({ ...KeyGeneratedMessage({ client, interaction, keys_generated: request.data, daysToExpire, quantityPerDay, service }) })

            interaction.editReply({ ...KeyGeneratedSuccessfully({ client, interaction }) })

        } catch (error) {
            const customError = error as Error
            interaction.editReply({ ...ErrorGenerateKeyMessage({ client, interaction, errorMessage: customError.message }) })
        }
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new CreateKeyGeneratoCommand()
    commandContainer.addCommand(command)
}