import { Navigate, Outlet } from "react-router-dom";
import { isAuth } from "../../../server/src/middlewares/auth.middleware";

function ProtectedRoutes() {
    const {isAuthenticated, loading} = isAuth();

    if(loading){
        return <div className="w-screen h-screen flex items-center justify-center">Checking Session...</div>;
    }

    if(isAuthenticated){
        return <Navigate to="/login" replace/>
    }


  return <Outlet />;
}

export default ProtectedRoutes
