import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth";

const ProtectedLayout = () => {
    const { auth, loading } = useAuth();

    // TODO: Add loading spinner
    if(loading) return <div>Loading...</div>;
    return (
        <div>
            {auth.id ? 
            (
                <Outlet />
            )
            : <Navigate to="/login" />}
        </div>
    )
}

export default ProtectedLayout
