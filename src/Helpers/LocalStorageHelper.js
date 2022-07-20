export const getItem = (key) => {
    let result = localStorage.getItem(key);

    return JSON.parse(result);
}

export const setItem = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
}