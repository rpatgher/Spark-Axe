import styles from '../styles/Alert.module.css'

const Alert = ({error, message}) => {
    return (
        <div className={`${styles.alert} ${error ? styles.error : styles.success}`}>
            <p>{message}</p>
        </div>
    )
}

export default Alert