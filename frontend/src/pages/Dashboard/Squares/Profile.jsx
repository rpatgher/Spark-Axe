// ***************** Styles *****************
import styles from './Profile.module.css';

// ***************** Images *****************
import lunaAxImage from "../../../assets/img/TiendaM.png";

const Profile = ({name, websites}) => {
    return (
        <div className={styles["Profile"]}>
            <div>
                <img
                    className={styles["ProfilePic"]}
                    src={lunaAxImage}
                    alt="Axolotl-Waiting"
                />
            </div>
            <h2 className={styles["ProfileHead"]}>Hola {name}</h2>
            <p className={styles["ProfileHead"]}>
                Bienvenido a {websites[0].name}, tienes{" "}
                <span style={{ fontWeight: "bold" }}>
                    4 notificaciones
                </span>{" "}
            </p>
            <p className={styles["ProfileHead"]}>Sparkaxe+</p>
        </div>
    )
}

export default Profile
