import { useEffect, useState } from "react";
import { meRequest } from "../apis/apis";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);  
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        meRequest()
            .then(() => setIsAuthenticated(true))
            .catch(() => setIsAuthenticated(false))
            .finally(() => setLoading(false));
    }, []);

    return { isAuthenticated, loading };
}