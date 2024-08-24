import { useEffect, useState } from "react";


// **************** Styles ****************
import styles from "../styles/FormProfile.module.css";



const FormProfile = ({ auth }) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        const setUserInfo = async () => {
            setUser(auth);
        }
        setUserInfo();
    }, [auth]);


    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    }



    return (
        <form className={styles.body}>
            <h3 className={styles["form-title"]}>Configuración General</h3>
            <div className={styles.field}>
                <label htmlFor="name">Nombre</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={"Tu nombre"}
                    value={user.name}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="lastname">Apellido</label>
                <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder={"Tu apellido"}
                    value={user.lastname}
                    onChange={handleChange}
                />
            </div>
            {/* <div className={styles.field}>
                <label htmlFor="email">Correo Electrónico</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={`ejemplo@correo.com`}
                    value={user.email}
                    onChange={handleChange}
                />
            </div> */}
            <div className={styles.field}>
                <label htmlFor="phone">Número de Teléfono</label>
                <input
                    type="number"
                    id="phone"
                    name="phone"
                    placeholder={`+55 55 5555 5555`}
                    value={user.phone}
                    onChange={handleChange}
                />
            </div>
            <h3 className={styles["form-title"]}>Cambiar Contraseña</h3>
            <div className={styles.field}>
                <label htmlFor="currentPassword">Contraseña Actual</label>
                <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    placeholder={`Contraseña actual`}
                />
                <label htmlFor="password">Nueva Contraseña</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder={`Contraseña nueva`}
                />
                <label htmlFor="password2">Repetir Nueva Contraseña</label>
                <input
                    type="password"
                    id="password2"
                    name="password2"
                    placeholder={`Repetir contraseña nueva`}
                />
            </div>
            {/* <p><strong>Avatar</strong></p> */}
            <button
                onClick={() => openCity("London")}
                className={styles.Buttonguardar}
            >
                Guardar cambios
            </button>
        </form>
    );
};

export default FormProfile;