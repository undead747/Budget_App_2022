/**
 * Lower Object Properties keys
 * Returns lowered key object 
 * @param {object} obj - input object.
 */
export function lowercaseObjectPropKeys(obj) {
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
}