import { ColorResolvable } from "discord.js"

type CustomColors = {
    primary: ColorResolvable;
    invisible: ColorResolvable;
    error: ColorResolvable
};

const colors: Partial<CustomColors> = {
    primary: "#00ffff",
    invisible: "#000000",
    error: "#ff0000"
}

export { colors }