import { Link } from "react-router-dom";

// ***************** Styles *****************
import styles from './ProfileCard.module.css';

// ***************** Images *****************


const ProfileCard = () => {
    return (
        <div className={styles.profilecard}>
            <h3>Sparkaxe +</h3>
            <Link to="/dashboard/settings">
                <button
                    className={styles.linkother}
                    onClick={() => openCity("Tokyo")}
                >
                    <i className="fa-regular fa-credit-card"></i>{" "}
                    Plan
                </button>
            </Link>
            <Link to="/dashboard/settings">
                <button
                    className={styles.linkother}
                    onClick={() => openCity("Paris")}
                >
                    <i className="fa-solid fa-store"></i> Configurar
                    Tienda
                </button>
            </Link>
            <button className={styles.linkother}>
                <i className="fa-regular fa-credit-card"></i>{" "}
                Cambiar metodo de pago
            </button>
        </div>
    )
}

export default ProfileCard;