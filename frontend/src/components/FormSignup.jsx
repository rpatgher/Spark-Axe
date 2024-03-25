

// ************** Hooks **************
import useSignup from '../hooks/useSignup';

// ************** Styles **************
import styles from '../styles/Signup.module.css'

// ***************** Components *****************
import SignupStepOne from './SignupStepOne';
import SignupStepTwo from './SignupStepTwo';
import SignupStepThree from './SignupStepThree';
import SignupStepFour from './SignupStepFour';

const NUM_STEPS = [1, 2, 3, 4];

const FormSignup = () => {
    const { step, handleStep, prevStep } = useSignup();

    return (
        <>
            {step > 1 && <i onClick={prevStep} className={`fa-solid fa-arrow-left ${styles['btn-back']}`}></i>}
            <form className={styles['form-signup']}>
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
                {
                    step === 1 && <SignupStepOne />
                }

                {
                    step === 2 && <SignupStepTwo />
                }

                {
                    step === 3 && <SignupStepThree />
                }

                {
                    step === 4 && <SignupStepFour />
                }
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
