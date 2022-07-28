/**
 * Get item by key from local storage
 * Returns data in object base on key, otherwise return null
 * @param {string} key - local storage key.
 */
export const getItem = (key) => {
    if (!key) return;
    let result = localStorage.getItem(key);

    return JSON.parse(result);
}

/**
 * Set item by key to local storage
 * Returns null if key not exist
 * @param {string} key - local storage key.
 * @param {object} data - storing data.
 */
export const setItem = (key, data = null) => {
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(data));
}