import { Database } from "@/infra/app/setup-database";
import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { generateKey } from "@/modules/@shared/utils/generate-key";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { KeyRepository } from "../../repositories/Keys.repository";
import { KeyModel } from "../../models/Key.model";
import { RoleNotExistMessage } from "@/modules/@shared/messages/role-not-exist/role-not-exist.message";
import { KeyCreatedMessage } from "./messages/key-created.message";
import { KeyCreatedSuccessfullyMessage } from "./messages/key-created-successfully.message";

class CreateKeyCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "createkey",
            description: "Crie uma key para resgatar",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: "type",
                    description: "Escolha o tipo de coisa que deve ser entregue",
                    type: 3,
                    choices: [
                        {
                            name: "Mensagem",
                            value: "message"
                        },
                        {
                            name: "Cargo",
                            value: "role",
                        }
                    ],
                    required: true
                },
                {
                    name: "content",
                    description: "Insira o conteúdo, id do cargo ou conteúdo da mensagem",
                    type: 3,
                    required: true
                },
                {
                    name: "quantity",
                    description: "Insira a quantidade você deseja",
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

        const type = interaction.options.getString("type") as KeyModel["type"];
        const content = interaction.options.getString("content") as string;
        const quantity = interaction.options.getNumber("quantity") as number;

        if (type === "role" && !interaction.guild?.roles.cache.get(content!)) {
            interaction.reply({ ...RoleNotExistMessage({ client, interaction, role: content }) })
            return;
        }


        const keys_generated: KeyModel[] = []

        for (let i = 0; i < quantity; i++) {
            const key_result = await KeyRepository.create({
                type,
                content,
                createdAt: new Date()
            })

            keys_generated.push(key_result)
        }

        await interaction.user.send({ ...KeyCreatedMessage({ client, interaction, keys_generated }) })

        interaction.reply({ ...KeyCreatedSuccessfullyMessage({ client, interaction }) })
        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new CreateKeyCommand()
    commandContainer.addCommand(command)
}