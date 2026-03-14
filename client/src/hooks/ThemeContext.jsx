import { useEffect, useState, useContext, createContext } from "react";

const ThemeContext = createContext();



export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("voxaide-theme");
        if (saved) return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    })

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme==='light' ? "dark" : "light"))
    }

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("voxaide-theme", theme);
    }, [theme])

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeContext = () => useContext(ThemeContext);