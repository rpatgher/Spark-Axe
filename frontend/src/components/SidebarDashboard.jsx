import { Link, useLocation } from 'react-router-dom';


// **************** Hooks ****************
import useAuth from '../hooks/useAuth';

// **************** Styles ****************
import styles from '../styles/SidebarDashboard.module.css';

// **************** Images ****************
import categoryIcon from '../assets/img/e-commerce_icon.jpeg';



const SidebarDashboard = () => {
    const location = useLocation();
    const { auth } = useAuth();
    const { websites } = auth;
    const website = websites[0];
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
            </header>
            <div className={styles.body}>
                <Link to='/dashboard' className={`${styles.item} ${location.pathname === '/dashboard' ? styles.item_active : ''}`}>
                    <i className="fa-solid fa-house"></i>
                    <p>Inicio</p>
                </Link>
                <Link to='/dashboard/orders' className={`${styles.item} ${location.pathname === '/dashboard/orders' ? styles.item_active : ''}`}>
                <i className="fa-solid fa-basket-shopping"></i>
                    <p>Pedidos</p>
                </Link>
                <Link to='/dashboard/products' className={`${styles.item} ${location.pathname === '/dashboard/products' ? styles.item_active : ''}`}>
                <i className="fa-solid fa-tags"></i>
                    <p>Productos</p>
                </Link>
                <Link to='/dashboard/inventory' className={`${styles.item} ${location.pathname === '/dashboard/inventory' ? styles.item_active : ''}`}>
                <i className="fa-solid fa-dolly"></i>
                    <p>Inventario</p>
                </Link>
                <Link to='/dashboard/customers' className={`${styles.item} ${location.pathname === '/dashboard/customers' ? styles.item_active : ''}`}>
                <i className="fa-solid fa-users"></i>
                    <p>Clientes</p>
                </Link>
                <Link to='/dashboard/stats' className={`${styles.item} ${location.pathname === '/dashboard/stats' ? styles.item_active : ''}`}>
                <i className="fa-solid fa-square-poll-vertical"></i>
                    <p>Estadísticas Generales</p>
                </Link>
                <Link to='/dashboard/coupons' className={`${styles.item} ${location.pathname === '/dashboard/coupons' ? styles.item_active : ''}`}>
                <i className="fa-solid fa-ticket-simple"></i>
                    <p>Cupones</p>
                </Link>
                <Link to='/dashboard/promotions' className={`${styles.item} ${location.pathname === '/dashboard/promotions' ? styles.item_active : ''}`}>
                <i className="fa-solid fa-gifts"></i>
                    <p>Promociones</p>
                </Link>
                <Link to='/dashboard/delivery' className={`${styles.item} ${location.pathname === '/dashboard/delivery' ? styles.item_active : ''}`}>
                <i className="fa-solid fa-truck-fast"></i>
                    <p>Envío</p>
                </Link>
                <Link to='/dashboard/settings' className={`${styles.item} ${location.pathname === '/dashboard/settings' ? styles.item_active : ''}`}>
                <i className="fa-solid fa-gear"></i>
                    <p>Configuración Tienda</p>
                </Link>
            </div>
        </aside>    
        
    )
}


export default SidebarDashboard
