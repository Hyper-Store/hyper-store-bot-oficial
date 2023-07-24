type Props = {
    value: string,
    output: "float" | "int"
}

export const FormatPrice = (props: Props): number | undefined => {
    const formated = props.value.replace('R$', '').replace(',', '.');
    if (props.output === "float") {
        return parseFloat(formated);
    }

    if (props.output === "int") {
        return parseInt(formated);
    }
}