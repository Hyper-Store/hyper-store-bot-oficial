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
            name: "productgroup_create",
            description: "Criar vários produtos a um grupo",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: 'title',
                    description: 'Insira o titlo do grupo',
                    type: 3,
                    required: true
                },
                {
                    name: 'productsid',
                    description: 'Insira o id de cada produto a ser adicionado, separando por virgula!',
                    type: 3,
                    required: true
                },
                {
                    name: 'description',
                    description: 'Insira o a descrição do grupo',
                    type: 3,
                    required: false
                },
                {
                    name: 'image',
                    description: 'Insira uma imagem para o grupo',
                    type: 11,
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

        const title = interaction.options.getString('title') as string;
        const productsId = interaction.options.getString('productsid') as string;
        const description = interaction.options.getString('description') as string;
        const image = interaction.options.getAttachment('image');

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
            title,
            description,
            image: image?.url
        })

        interaction.reply({ ...ProductGroupCreatedSucessfullyMessage({ client, interaction }) });
        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new CreateProductGroupCommand()
    commandContainer.addCommand(command)
}