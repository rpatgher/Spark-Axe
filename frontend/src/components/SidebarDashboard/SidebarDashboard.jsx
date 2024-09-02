import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


// **************** Hooks ****************
import useAuth from '../../hooks/useAuth';

// **************** Styles ****************
import styles from './SidebarDashboard.module.css';

// **************** Images ****************
import categoryIcon from '../../assets/img/e-commerce_icon.jpeg';



const SidebarDashboard = () => {
    const location = useLocation();
    const { auth } = useAuth();
    const { websites } = auth;
    const website = websites[0];

    const [menuActive, setMenuActive] = useState(false);

    // const setIconFeature = (feature) => {
    //     if(feature === 'Pedidos'){
    //         return 'fa-solid fa-basket-shopping';
    //     } else if (feature === 'Productos') {
    //         return 'fa-solid fa-tags';
    //     } else if (feature === 'Inventario') {
    //         return 'fa-solid fa-dolly';
    //     } else if (feature === 'Clientes') {
    //         return 'fa-solid fa-users';
    //     } else if (feature === 'Estadísticas Generales') {
    //         return 'fa-solid fa-square-poll-vertical';
    //     } else if (feature === 'Cupones') {
    //         return 'fa-solid fa-ticket-simple';
    //     } else if (feature === 'Promociones') {
    //         return 'fa-solid fa-gifts';
    //     } else if (feature === 'Envío') {
    //         return 'fa-solid fa-truck-fast';
    //     } else if (feature === 'Anuncios') {
    //         return 'fa-solid fa-rectangle-ad';
    //     } else {
    //         return 'fa-solid fa-cube';
    //     }
    // }

    return (
        <aside className={styles.sidebar}>
            <header className={styles["sidebar-header"]}>
                <div className={styles.store}>
                    <div className={styles.logo}>
                        <img src={categoryIcon} alt="E-commerce Icon" />
                    </div>
                    <div className={styles.title}>
                        <h3>{website.name}</h3>
                        <p>{website.type}</p>
                    </div>
                </div>
                <div 
                
                    className={styles.menu}
                    onClick={() => setMenuActive(!menuActive)}
                >
                    <i className="fa-solid fa-bars"></i>
                </div>

            </header>
            <div className={`${styles.body} ${menuActive ? styles["menu-active"] : ""}`}>
                <div className={styles["main-menu"]}>
                    <Link to='/dashboard' className={`${styles.item} ${location.pathname === '/dashboard' ? styles.item_active : ''}`}>
                        <i className="fa-solid fa-house"></i>
                        <p>Inicio</p>
                    </Link>
                    {website.features.map(feature => (
                        <Link key={feature.id} to={`/dashboard/${feature.url}`} className={`${styles.item} ${location.pathname === `/dashboard/${feature.url}` ? styles.item_active : ''}`}>
                            <i className={feature.icon || 'fa-solid fa-cube'}></i>
                            <p>{feature.name}</p>
                        </Link>
                    ))}
                </div>
                <div className={styles["setting-menu"]}>
                    <Link to='/dashboard/settings' className={`${styles.item} ${location.pathname === '/dashboard/settings' ? styles.item_active : ''}`}>
                    <i className="fa-solid fa-gear"></i>
                        <p>Configuración Tienda</p>
                    </Link>
                </div>
            </div>
        </aside>    
        
    )
}


export default SidebarDashboard
