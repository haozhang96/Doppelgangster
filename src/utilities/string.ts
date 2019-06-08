// Import internal components.
import { IMappedObject } from "@/common/interfaces";

// Import built-in libraries.
import * as $Utilities from "util";

const unescapeMap: Readonly<IMappedObject<string>> = {
    "\\\"": "\"",
    "\\\'": "\'",
    "\\0": "\0",
    "\\n": "\n",
    "\\r": "\r",
    "\\t": "\t",
};

export function backslashUnescape(_string: string): string {
    return _string.replace(/\\*\\[0nrt"']/g, (escapedCharacter) =>
        unescapeMap[escapedCharacter],
    );
}

export function capitalize(_string: string): string {
    return _string[0].toUpperCase() + _string.slice(1);
}

export function caseInsensitiveEquals(a: string, b: string): boolean {
    return a.toLowerCase() === b.toLowerCase();
}

export function format(_format: string, ...formatters: any[]): string {
    return $Utilities.format(_format, ...formatters);
}

export function pluralize(word: string, count: number, pluralForm?: string) {
    return count === 1 ? word : (pluralForm || word + "s");
}

export function tabulate(_string: string, level: number = 1): string {
    return (
        "\t".repeat(level) + _string.replace(/\n/g, "\n" + "\t".repeat(level))
    );
}

export function uncapitalize(_string: string): string {
    return _string[0].toLowerCase() + _string.slice(1);
}

// Expose components.
export const StringUtils = {
    backslashUnescape,
    capitalize,
    caseInsensitiveEquals,
    format,
    pluralize,
    tabulate,
    uncapitalize,
};

// Expose a short-hand variable to the string formatter.
export const $ = format;
