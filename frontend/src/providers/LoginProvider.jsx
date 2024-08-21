import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../config/clientAxios";

// ************* Hooks *************
import useAuth from '../hooks/useAuth';

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        password: '',
        remember: false
        // TODO: Add remember me functionality
    });
    const [loading, setLoading] = useState(false);

    const [hidePassword, setHidePassword] = useState(true);
    const [alert, setAlert] = useState({
        msg: '',
        error: true
    });

    const { setAuth } = useAuth();

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const handleHidePassword = () => {
        setHidePassword(!hidePassword);
    }

    const submitLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(Object.values(user).includes('')){
            setAlert({
                msg: 'Todos los campos son obligatorios',
                error: true
            });
            setTimeout(() => {
                setAlert({});
            }, 3000);
            setLoading(false);
            return;
        }
        setAlert({});
        try{
            const { data } = await clientAxios.post('/api/users/login', user);
            setAuth(data);
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        }catch(error){
            console.log(error);
            let msg;
            switch(error?.response?.status){
                case 404:
                    msg = 'El usuario no existe';
                    break;
                case 401:
                    msg = 'La contraseña es incorrecta o el usuario no está confirmado';
                    break;
                default:
                    msg = error?.response?.data?.msg;
                    break;
            }
            setAlert({
                msg: msg,
                error: true
            });
        } finally{
            setLoading(false);
        }
    }

    return (
        <LoginContext.Provider value={{
            user,
            handleChange,
            hidePassword,
            handleHidePassword,
            submitLogin,
            alert,
            loading
        }}>
            {children}
        </LoginContext.Provider>
    )
}


export { LoginProvider };
export default LoginContext;