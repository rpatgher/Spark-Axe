import { useState } from 'react';
import { Link } from 'react-router-dom';

// **************** Hooks ****************
import useApp from '../../hooks/useApp';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from "react-router-dom";


// **************** Styles ****************
import styles from './HeaderDashboard.module.css';

const HeaderDashboard = () => {
    const { theme, handleToggleTheme } = useApp();
    const { logoutAuth, auth, setProfileModal } = useAuth();
    const { name, lastname, websites, role } = auth;
    const navigate = useNavigate();

    const handleLogoutAndRedirect = () => {
    logoutAuth(); // Perform the logout function
    setProfileModal(false); // Close the profile modal, if necessary
    navigate("/"); // Redirect to the root ("/")
  };

    return (
        <header className={styles.header}>
            <div className={styles.heading}>
                <h2>Bienvenido a Spark Axe</h2>
                <p>{websites[0].name}</p>
            </div>
            <div className={styles.main}>
                {/* <button 
                    className={styles.darkmode}
                    onClick={handleToggleTheme}
                
                >
                    <div className={`${styles['darkmode-btn']} ${theme === 'dark' && styles['darkmode-btn-active']}`}> <div></div> </div>
                </button>
                <div className={styles.notification}>
                    <i className="fa-regular fa-bell"></i>
                    <div className={styles.dropdown2}>
                    <div className={styles.dropdownContent2}>
                       <p><strong><i className="fa-solid fa-bell"></i> Aviso 1</strong> que pedo remy</p>
                        <hr></hr>
                        <p><strong><i className="fa-solid fa-bell"></i> Aviso 2</strong> remy es gei</p>
                        <hr></hr>
                        <p><strong><i className="fa-solid fa-bell"></i> Aviso 3</strong> shakalitos at work this is something alalalalala ohh yeha</p>
                    </div>
                    </div>
                </div> */}
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
                        <button
                            onClick={() => setProfileModal(true)} 
                        >
                            <i className="fa-solid fa-user-gear"></i>Perfil 
                        </button>
                        <button
                            onClick={handleLogoutAndRedirect}
                        ><i className="fa-solid fa-right-from-bracket"></i>Cerrar Sesión</button>
                    </div>
                    </div>
                </div>
            </div>

        </header>
    )
}

export default HeaderDashboard;
