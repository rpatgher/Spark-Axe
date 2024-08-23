import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../config/clientAxios";


const SignupContext = createContext();

const SignupProvider = ({ children }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [user, setUser] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        password2: '',
        phone: '',
        // role: ''
    });
    const [validCode, setValidCode] = useState(false);


    const [characters, setCharacters] = useState(false); 
    const [number, setNumber] = useState(false);
    const [uppercase, setUppercase] = useState(false);
    const [lowercase, setLowercase] = useState(false);
    const [special, setSpecial] = useState(false);
    const [passwordsCheck, setPasswordsCheck] = useState(true);
    const [barpercentage, setBarPercentage] = useState(0);

    const [hidePassword, setHidePassword] = useState(true);

    const [continueBtn1, setContinueBtn1] = useState(false);
    const [continueBtn2, setContinueBtn2] = useState(false);
    const [continueBtn3, setContinueBtn3] = useState(false);

    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState({
        msg: '',
        error: true
    });

    const nextStep = () => {
        setStep(step + 1);
    }

    const prevStep = () => {
        setStep(step - 1);
    }

    const handleStep = (step) => {
        switch(step) {
            case 1:
                setStep(step);
            case 2:
                if(continueBtn1){
                    setStep(step);
                }
                break;
            // case 3:
            //     if(continueBtn2){
            //         setStep(step);
            //     }
            //     break;
            // case 4:
            //     if(continueBtn3){
            //         setStep(step);
            //     }
            //     break;
            default:
                break;
        }
        // setStep(step);
    }

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleRole = (e) => {
        let name;
        let value;
        if(e.target.name){
            name = e.target.name;
            value = e.target.value;
        }else if(e.target.tagName === 'I'){
            name = e.target.parentElement.name;
            value = e.target.parentElement.value;
        }
        setUser({
            ...user,
            [name]: value
        });
    }

    const handlePassword = (e) => {
        const password = e.target.value;
        const hasNumber = /\d/;
        const hasUppercase = /[A-Z]/;
        const hasLowercase = /[a-z]/;
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;
        let percentage = 0;

        if(password.length >= 8) {
            setCharacters(true);
            percentage += 25;
        } else {
            setCharacters(false);
        }
        if(hasNumber.test(password)) {
            setNumber(true);
            percentage += 25;
        }else{
            setNumber(false);
        }
        if(hasUppercase.test(password)) {
            setUppercase(true);
            percentage += 12.5;
        }else{
            setUppercase(false);
        }
        if(hasLowercase.test(password)) {
            setLowercase(true);
            percentage += 12.5;
        }else{
            setLowercase(false);
        }
        if(hasSpecial.test(password)) {
            setSpecial(true);
            percentage += 25;
        }else{
            setSpecial(false);
        }
        setBarPercentage(percentage);
    }

    const handlePassword2 = (e) => {
        if(e.target.value === user.password) {
            setPasswordsCheck(true);
        }else{
            setPasswordsCheck(false);
        }
    }

    const handleHidePassword = () => {
        setHidePassword(!hidePassword);
    }

    const handleSubmit = async (e) => {
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
        try {
            const response = await clientAxios.post('/api/users', user);
            if(response.status === 201){
                setUser({});
                setContinueBtn1(false);
                setContinueBtn2(false);
                setContinueBtn3(false);
                setBarPercentage(0);
                setCharacters(false);
                setNumber(false);
                setUppercase(false);
                setLowercase(false);
                setSpecial(false);
                setPasswordsCheck(true);
                setHidePassword(true);
                setValidCode(false);
                setStep(5);
            }
        } catch (error) {
            console.log(error);
            let msg;
            if(error.response){
                if(msg = error.response.data.msg === 'User already exists'){
                    msg = 'El usuario ya existe';
                }
            }else{
                msg = 'An error ocurred';
            }
            setAlert({
                msg: msg,
                error: true
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <SignupContext.Provider value={{
            step,
            nextStep,
            prevStep,
            handleStep,
            user,
            handleChange,
            handleRole,
            validCode,
            setValidCode,
            characters,
            number,
            uppercase,
            lowercase,
            special,
            barpercentage,
            handlePassword,
            passwordsCheck,
            handlePassword2,
            continueBtn1,
            setContinueBtn1,
            continueBtn2,
            setContinueBtn2,
            continueBtn3,
            setContinueBtn3,
            hidePassword,
            handleHidePassword,
            handleSubmit,
            loading,
            alert
        }}>
            {children}
        </SignupContext.Provider>
    );
}

export { SignupProvider };
export default SignupContext;   