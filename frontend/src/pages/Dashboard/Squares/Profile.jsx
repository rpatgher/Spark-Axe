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
            <h2 className={styles["ProfileHead"]}>Hola {name},</h2>
            <p className={styles["ProfileHead"]}>
                Bienvenido al portal de tu tienda online! Aquí podrás ver tus ventas, productos, clientes y mucho más.
            </p>
        </div>
    )
}

export default Profile
