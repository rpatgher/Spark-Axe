import { useContext } from "react";
import LoginContext from "../providers/LoginProvider";

const useLogin = () => {
    return useContext(LoginContext);
}

export default useLogin;