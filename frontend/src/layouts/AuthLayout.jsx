import { Outlet, Link } from 'react-router-dom'
import styles from '../styles/AuthLayout.module.css'

const AuthLayout = () => {
    return (
        <div className={styles.auth}>
            <div className={styles.card}>
                <div className={styles.form}>
                    <Outlet />
                </div>
                <div className={styles.image}>
                    
                    <Link
                        className={styles.exit}
                        to="/"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
