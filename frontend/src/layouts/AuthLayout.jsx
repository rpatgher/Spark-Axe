import { Outlet, Link } from 'react-router-dom'
import styles from '../styles/AuthLayout.module.css'
import Dashboard from '../assets/img/DashboardSS.png';

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
                    <div className={styles.content}>
                    <h2>Sparkaxe <span className={styles.grayT}>La mejor forma de manejar tu negocio a tu manera</span></h2>
                    <img className={styles.dashboard} src={Dashboard} alt="Dashboard" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
