import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

function ProtectedRoutes() {
    const {isAuthenticated, loading} = useAuth();

    if(loading){
        return null
    }

    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }


  return <Outlet />;
}

export default ProtectedRoutes
