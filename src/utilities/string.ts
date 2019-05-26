// Import internal components.
import { IMappedObject } from "@/common/interfaces";

const unescapeMap: Readonly<IMappedObject<string>> = {
    "\\\"": "\"",
    "\\\'": "\'",
    "\\0": "\0",
    "\\n": "\n",
    "\\r": "\r",
    "\\t": "\t",
};

function backslashUnescape(_string: string): string {
    return _string.replace(/\\*\\[0nrt"']/g, (escapedCharacter) =>
        unescapeMap[escapedCharacter],
    );
}

function capitalize(_string: string): string {
    return _string[0].toUpperCase() + _string.slice(1);
}

function caseInsensitiveEquals(a: string, b: string): boolean {
    return a.toLowerCase() === b.toLowerCase();
}

function tabulate(string: string, level: number = 1): string {
    return (
        "\t".repeat(level) + string.replace(/\n/g, "\n" + "\t".repeat(level))
    );
}

function uncapitalize(_string: string): string {
    return _string[0].toLowerCase() + _string.slice(1);
}

// Expose components.
export const StringUtils = {
    backslashUnescape,
    capitalize,
    caseInsensitiveEquals,
    tabulate,
    uncapitalize,
};
