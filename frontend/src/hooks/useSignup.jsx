import { useContext } from "react";
import SignupContext from "../providers/SignupProvider";

const useSignup = () => {
    return useContext(SignupContext);
}

export default useSignup;