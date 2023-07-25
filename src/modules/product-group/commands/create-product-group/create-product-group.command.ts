import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client, User } from "discord.js";
import Discord from "discord.js"
import { NotFoundProductList } from "./messages/not-found-product-list.message";
import { ProductGroupRepository } from "../../repositories/product-group.repository";
import { ProductAlreadyInGroup } from "./messages/product-already-in-group.message";
import { ProductModel } from "@/modules/product/models/product.model";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { ProductGroupCreatedSucessfullyMessage } from "./messages/product-group-created-sucessfully.message";

class CreateProductGroupCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "create-product-group",
            description: "Criar vários produtos a um grupo",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: 'productsid',
                    description: 'Insira o id de cada produto a ser adicionado, separando por virgula!',
                    type: 3,
                    required: true
                },
                {
                    name: 'placeholder',
                    description: 'Insira o texto que vai ficar no menu de seleção',
                    type: 3,
                    required: false
                }
            ]
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const productsId = interaction.options.getString('productsid') as string;
        const placeholder = interaction.options.getString('placeholder') as string;

        const products: ProductModel[] = [];

        for (const p of productsId.replace(/\s*,\s*/g, ',').split(',')) {
            const product = await ProductRepository.findById(p);
            if (product) products.push(product);

            const checkInGroup = await ProductGroupRepository.checkProductIsInGroup(p);
            if (checkInGroup) {
                interaction.reply({ ...ProductAlreadyInGroup({ client, interaction, productId: p }) })
                return;
            }
        }

        if (products.length < 1) {
            interaction.reply({ ...NotFoundProductList({ client, interaction }) })
            return;
        }

        await ProductGroupRepository.create({
            products: products.map(p => p.id),
            placeholder
        })

        interaction.reply({ ...ProductGroupCreatedSucessfullyMessage({ client, interaction }) });
        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new CreateProductGroupCommand()
    commandContainer.addCommand(command)
}