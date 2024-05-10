import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../config/clientAxios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    const [profileModal, setProfileModal] = useState(false);

    useEffect(() => {
        const authUser = async () => {
            const token = localStorage.getItem('token');
            if(!token) {
                setLoading(false)
                return;
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const { data } = await clientAxios('/api/users/profile', config);
                setAuth(data);
                // TODO: Fix the redirect to projects only if the user is in the login page
                // navigate('/projects');
            } catch (error) {
                setAuth({});
                console.log(error);
            } finally{
                setLoading(false)
            }
        }
        return () => authUser();
    }, []);
    

    const logoutAuth = () => {
        setAuth({});
        localStorage.removeItem('token');
    }

    const updateMatrixAmount = () => {
        setAuth({
            ...auth,
            matrix_amount: auth.matrix_amount - 1
        })
    }
    
    return (
        <AuthContext.Provider value={{
            auth,
            setAuth,
            loading,
            logoutAuth,
            updateMatrixAmount,
            profileModal,
            setProfileModal
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
export {
    AuthProvider
}