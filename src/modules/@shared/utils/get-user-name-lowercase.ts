export const GetUserNameLowerCase = (username: string) => {
    return username.toLowerCase().replace(/ /g, '-')
}