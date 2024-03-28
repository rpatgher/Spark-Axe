import { Link } from 'react-router-dom';

// **************** Hooks ****************
import useApp from '../hooks/useApp';
import useAuth from '../hooks/useAuth';

// **************** Styles ****************
import styles from '../styles/HeaderDashboard.module.css';

const HeaderDashboard = () => {
    const { theme, handleToggleTheme } = useApp();
    const { logoutAuth, auth } = useAuth();
    const { name, lastname, websites, role } = auth;
    return (
        <header className={styles.header}>
            <div className={styles.heading}>
                <h2>Bienvenido a Spark Axe</h2>
                <p>{websites[0].name}</p>
            </div>
            <div className={styles.main}>
                <button 
                    className={styles.darkmode}
                    onClick={handleToggleTheme}
                
                >
                    <div className={`${styles['darkmode-btn']} ${theme === 'dark' && styles['darkmode-btn-active']}`}> <div></div> </div>
                </button>
                <div className={styles.notification}>
                    <i className="fa-regular fa-bell"></i>
                </div>
                <div className={styles.profile}>
                    <div className={styles.image}>

                    </div>
                    <div className={styles.info}>
                        <div className={styles.name}>
                            <p>{name} {lastname}</p>
                        </div>
                        <div className={styles.description}>
                            <p>{role}</p>
                        </div>
                    </div>
                    <div className={styles.dropdown}>
                    <div className={styles.dropdownContent}>
                        <Link to="/dashboard"><i className="fa-solid fa-user-gear"></i>Perfil</Link>
                        <button
                            onClick={logoutAuth}
                        ><i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesión</button>
                    </div>
                    </div>
                </div>
            </div>
            
        </header>
    )
}

export default HeaderDashboard;
