import { useEffect, useState } from 'react';

// ************** Hooks **************
import useSignup from '../hooks/useSignup';

// ************** Styles **************
import styles from '../styles/Signup.module.css'

// ***************** Components *****************
import BtnNext from './BtnNext';

// ************** Images **************
import verifyImage from '../assets/img/verify-tel.png';

const SignupStepThree = () => {
    const { prevStep, continueBtn3, setContinueBtn3, validCode, setValidcode } = useSignup();
    const [digit, setDigit] = useState(0);
    const [code, setCode] = useState('');

    const handleFocus = () => {
        document.getElementsByName('code')[digit].focus();
    }

    useEffect(() => {
        if(digit < 4 && digit >= 0){
            handleFocus();
        }
    }, [digit]);

    const handleDigit = (e) => {
        const inputs = document.getElementsByName('code');
        let codeValue = '';
        inputs.forEach(input => {
            codeValue += input.value;
        });
        if(e.target.value.length === 1 && digit < 4){
            setDigit(digit + 1);
            if(digit >= 3){
                submitCode();
            }
        }else if(e.target.value.length === 0){
            setDigit(digit - 1);
        }else{
            return;
        }
        setCode(codeValue);
    }

    const handleBackspace = (e) => {
        if(e.target.value.length === 0 && digit > 0 && e.key === 'Backspace'){
            setDigit(digit - 1);
            setCode(code.slice(0, -1));
        }
    }

    const submitCode = () => {
        console.log('Sending Code...');
    }

    return (
        <>
            <div className={styles["verify-image"]}>
                <img src={verifyImage} alt="Verify Tel" />
                <p>Verifique su celular</p>
            </div>
            <div className={styles["verify-code"]}>
                <div className={styles["verify-inputs"]}>
                    <input onKeyUp={handleBackspace} onChange={handleDigit} onFocus={handleFocus} value={code[0] ?? ''} type="tel" name="code" />
                    <input onKeyUp={handleBackspace} onChange={handleDigit} onFocus={handleFocus} value={code[1] ?? ''} type="tel" name="code" />
                    <input onKeyUp={handleBackspace} onChange={handleDigit} onFocus={handleFocus} value={code[2] ?? ''} type="tel" name="code" />
                    <input onKeyUp={handleBackspace} onChange={handleDigit} onFocus={handleFocus} value={code[3] ?? ''} type="tel" name="code" />
                </div>
                <button>Volver a mandar el código</button>
            </div>
            <p className={styles["verify-instructions"]}>Ingresa el código de 4 dígitos que se te ha enviado al celular <span>+XX XXXX XXXX</span></p>
            <button onClick={prevStep} className={styles["change-number"]}>Cambiar número de teléfono</button>
            <BtnNext
                disabled={!continueBtn3}
            />
        </>
    )
}

export default SignupStepThree
