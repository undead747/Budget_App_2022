/**
 * check if input string is null or empty
 * Returns true - if input string is null or empty, otherwise return false
 * @param str - input string.
 */
export function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}