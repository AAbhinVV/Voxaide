import { useEffect, useState, createContext, useContext } from "react";
import { meRequest, logoutRequest } from "../apis/apis";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);



export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        meRequest()
            .then(() => setIsAuthenticated(true))
            .catch(() => setIsAuthenticated(false))
            .finally(() => setLoading(false));
    }, [])

    const logout = async () => {
        try{ 
            await logoutRequest(); 
            setIsAuthenticated(false); 
        }catch(error){ 
            console.error("Logout failed:", error);
         }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    // const [isAuthenticated, setIsAuthenticated] = useState(false);  
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     meRequest()
    //         .then(() => setIsAuthenticated(true))
    //         .catch(() => setIsAuthenticated(false))
    //         .finally(() => setLoading(false));
    // }, []);

    // return { isAuthenticated, loading };

    const context = useContext(AuthContext);

    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}