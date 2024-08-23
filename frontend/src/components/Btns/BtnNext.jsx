// ************** Hooks **************
import useSignup from '../../hooks/useSignup';

// ************** Styles **************
import styles from './BtnNext.module.css';


const BtnPrevNext = ({disabled, msg, action}) => {
    return (
        <button
            className={`${styles['btn-next']} ${disabled ? styles.disabled : ''}`}
            onClick={action}
            disabled={disabled}
        >
            {msg}
        </button>
    )
}

export default BtnPrevNext
