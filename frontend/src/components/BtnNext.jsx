// ************** Hooks **************
import useSignup from '../hooks/useSignup';

// ************** Styles **************
import styles from '../styles/BtnNext.module.css';


const BtnPrevNext = ({disabled}) => {
    const { nextStep } = useSignup();
    return (
        <button
            className={`${styles['btn-next']} ${disabled ? styles.disabled : ''}`}
            onClick={nextStep}
            disabled={disabled}
        >
            Continuar
        </button>
    )
}

export default BtnPrevNext
