export const setItem = (name, item) => {
    if (!window.localStorage) return false;
    window.localStorage.setItem(name, item);
    return true;
};

export const getItem = (name) => {
    try {
        const item = window.localStorage.getItem(name);
        return item !== null ? item : null;
    } catch (error) {
        console.error('Error accessing localStorage:', error);
        return null;
    }
};

export const removeItem = (name) => {
    if (!window.localStorage) return false;
    window.localStorage.removeItem(name);
    return true;
};

export const clearStorage = () => {
    window.localStorage.clear();
};
