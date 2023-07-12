import { PackOptionModel } from "./PackOption.model"

export type PackModel = {
    id?: string,
    title: string,
    description?: string,
    options?: { [key: string]: PackOptionModel }
    image?: string,
    role: string,
    createdAt?: Date
}