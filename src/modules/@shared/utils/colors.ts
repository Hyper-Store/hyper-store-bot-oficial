import { ColorResolvable } from "discord.js"

type CustomColors = {
    primary: ColorResolvable;
    invisible: ColorResolvable;
    error: ColorResolvable
};

const colors: Partial<CustomColors> = {
    primary: "#00ff00",
    invisible: "#000000",
    error: "#ff0000"
}

export { colors }