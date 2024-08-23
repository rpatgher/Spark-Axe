

// ************** Hooks **************
import useSignup from '../hooks/useSignup';

// ************** Styles **************
import styles from '../styles/Signup.module.css'

// ***************** Components *****************
import SignupStepOne from './Signup/SignupStepOne';
import SignupStepTwo from './Signup/SignupStepTwo';
import SignupStepThree from './Signup/SignupStepThree';
import SignupStepFour from './Signup/SignupStepFour';
import SignupConfirmation from './Signup/SignupConfirmation';
import Alert from './Alert/Alert';

// const NUM_STEPS = [1, 2, 3, 4];
const NUM_STEPS = [1, 2];

const FormSignup = () => {
    const { step, handleStep, prevStep, alert } = useSignup();

    return (
        <>
            {step > 1 && step < 5 && <i onClick={prevStep} className={`fa-solid fa-arrow-left ${styles['btn-back']}`}></i>}
            <form className={styles['form-signup']}>
                {alert.msg && <Alert error={alert.error} message={alert.msg} />}
                {
                    step === 5 ? <SignupConfirmation /> : (
                        <div className={styles.steps}>
                            {NUM_STEPS.map(num => (
                                <button
                                    key={num}
                                    type='button'
                                    className={`${styles.step} ${step >= num && styles['step-active']}`}
                                    onClick={() => handleStep(num)}
                                    
                                ></button>
                            ))}
                        </div>
                    )
                }
                {
                    step === 1 && <SignupStepOne />
                }

                {
                    step === 2 && <SignupStepTwo />
                }

                {/* {
                    step === 3 && <SignupStepThree />
                }

                {
                    step === 4 && <SignupStepFour />
                } */}
                {/* <input 
                    className={styles.submit}
                    type="submit" 
                    value="Siguiente" 
                /> */}
            </form>
        </>
    )
}

export default FormSignup
