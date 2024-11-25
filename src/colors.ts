const reset = "\x1b[0m";
const outputFormat = "ansi256";
const magenta = Bun.color("#FF79C6", outputFormat);
const cyan = Bun.color("#8BE9FD", outputFormat);
const green = Bun.color("#50FA7B", outputFormat);
const red = Bun.color("#FF5555", outputFormat);
const yellow = Bun.color("#F1FA8C", outputFormat);
const black = Bun.color("#6272A4", outputFormat);

const bunColors = {
  magenta(str: string): string {
    return `${magenta}${str}${reset}`;
  },
  cyan(str: string): string {
    return `${cyan}${str}${reset}`;
  },
  green(str: string): string {
    return `${green}${str}${reset}`;
  },
  red(str: string): string {
    return `${red}${str}${reset}`;
  },
  yellow(str: string): string {
    return `${yellow}${str}${reset}`;
  },
  black(str: string): string {
    return `${black}${str}${reset}`;
  },
};

export { bunColors as bc };