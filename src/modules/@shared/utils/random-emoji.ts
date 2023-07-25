export const RandomEmoji = () => {
    const emojis: string[] = ['📦', '💸', '💚', '🎁', '💎'];

    const index: number = Math.floor(Math.random() * emojis.length);
    return emojis[index];
}