import { getItem, setItem } from "./storage";

// returns true is user has set darkmode on thier browser preferences
export const isDarkMode = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

// get the initial theme to set
export const getInitialTheme = () => {
    let initialTheme = isDarkMode() ? "dark" : "light";
    if (getItem("theme")) {
        initialTheme = getItem("theme");
    }
    return initialTheme;
};

// set the theme
export const setTheme = (theme) => {
    setItem("theme", theme);
    window.location.reload();
};