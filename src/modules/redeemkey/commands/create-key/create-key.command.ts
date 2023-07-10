import { Database } from "@/infra/app/setup-database";
import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { generateKey } from "@/modules/@shared/utils/generate-key";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"

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

        const type = interaction.options.getString("type");
        const content = interaction.options.getString("content");
        const quantity = interaction.options.getNumber("quantity") as number;

        if (type === "role" && !interaction.guild?.roles.cache.get(content!)) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.error!)
                        .setDescription(`> ${emojis.error} O cargo \`${content}\` não existe no servidor!`)
                ]
            })

            return;
        }


        const keys_generated: string[] = []

        for (let i = 0; i < quantity; i++) {
            const key_generated = generateKey('XXXX-XXXX-XXXX');
            keys_generated.push(key_generated)
            await new Database().set(`reedemkey.${key_generated}`, {
                type,
                content,
                status: true
            })
        }

        await interaction.user.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setAuthor({ name: `${interaction.guild?.name}`, iconURL: interaction.guild?.iconURL()! })
                    .setDescription(`> ${emojis.success} Parabens, Sua key foi gerada com sucesso!, agora so basta utilizar o comando para resgata-la.`)
                    .addFields(
                        {
                            name: `🔑 Key gerada, value:`,
                            value: `\`\`\`${keys_generated.join('\n')}\`\`\``
                        },
                        {
                            name: `${emojis.date} Data de criação`,
                            value: `<t:${Math.floor(new Date().getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date().getTime() / 1000)}:R>\`)\``
                        }
                    )
            ]
        })

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} Parabens, sua key foi gerada com sucesso e já foi enviada em seu privado!`)
            ]
        })

        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new CreateKeyCommand()
    commandContainer.addCommand(command)
}