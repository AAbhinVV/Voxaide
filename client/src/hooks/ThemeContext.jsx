import { useEffect, useState, useContext, createContext } from "react";

const ThemeContext = createContext();



export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState("light")

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme==='light' ? "dark" : "light"))
    }

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
    }, [theme])

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeContext = () => useContext(ThemeContext);