const unescapeMap: { readonly [escaped: string]: string } = { "\\0": "\0", "\\n": "\n", "\\r": "\r", "\\t": "\t", "\\\"": "\"", "\\\'": "\'" };


export const String: {
    tabulate(string: string, level?: number): string;
    backslashUnescape(string: string): string;
} = {
    tabulate(string: string, level: number = 1): string {
        return "\t".repeat(level) + string.replace(/\n/g, "\n" + "\t".repeat(level));
    },

    backslashUnescape(string: string): string {
        return string.replace(/\\*\\[0nrt"']/g, escapedCharacter => unescapeMap[escapedCharacter]);
    }
};