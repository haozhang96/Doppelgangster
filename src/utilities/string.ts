function capitalize(_string: string): string {
    return _string[0].toUpperCase() + _string.slice(1);
}

function uncapitalize(_string: string): string {
    return _string[0].toLowerCase() + _string.slice(1);
}

// Expose components.
export const StringUtils = {
    capitalize,
    uncapitalize,
};
