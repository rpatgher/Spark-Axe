import { Link } from "react-router-dom";
// **************** Hooks ****************
import useAuth from "../../hooks/useAuth";
import React, { useState } from "react";

// **************** Styles ****************
import styles from "./ModalProfile.module.css";

const ModalProfile = () => {
    const { auth, setProfileModal } = useAuth();
    const [activeTab, setActiveTab] = useState("London");

    // console.log(auth);

    const { name, lastname, email, phone, websites } = auth;

    const openCity = (cityName) => {
        setActiveTab(cityName);
    };
    return (
        <div className={styles["modal-wrapper"]}>
            <div className={styles["modal-profile"]}>
                <button
                    className={styles["close-modal"]}
                    onClick={() => setProfileModal(false)}
                >
                    <i className="fa-solid fa-times"></i>
                </button>

                <div
                    id="London"
                    className={styles.tabcontent1}
                    style={{
                        display: activeTab === "London" ? "block" : "none",
                    }}
                >
                    <h2 className={styles["config-title"]}>Configuración de Perfil</h2>
                    <hr className={styles.line}></hr>
                    <div className={styles.info}>
                        <div className={styles["info-field"]}>
                            <h3>Nombre</h3>
                            <p>{name} {lastname}</p>
                        </div>
                        <div className={styles["info-field"]}>
                            <h3>Correo</h3>
                            <p>{email}</p>
                        </div>
                        <div className={styles["info-field"]}>
                            <h3>Número telefónico</h3>
                            <p>{phone}</p>
                        </div>
                        <div className={styles["info-field"]}>
                            <h3>Contraseña</h3>
                            <p>Cambiar contraseña</p>
                        </div>
                        {/* <p className={styles.p3}><strong>Avatar</strong></p> */}
                        <div className={styles["info-field"]}>
                            <h3>Websites</h3>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Dominio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {websites.map((website) => (
                                        <tr key={website.id}>
                                            <td>{website.name}</td>
                                            <td>
                                                <a
                                                    href={website.url_address}
                                                    target="_blank"
                                                >
                                                    {website.url_address}
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={2}>
                                            <Link to="/support">
                                                <button className={styles.Newwebsite}>
                                                    Agregar website
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <button
                            className={styles.edit}
                            onClick={() => openCity("Editar")}
                        >
                            Configurar Perfil
                        </button>
                    </div>
                </div>
                <div
                    id="Editar"
                    className={styles.tabcontent1}
                    style={{
                        display: activeTab === "Editar" ? "block" : "none",
                    }}
                >
                    <h2>
                        {" "}
                        <span
                            className={styles.backhead}
                            onClick={() => openCity("London")}
                        >
                            Configuracion de perfil
                        </span>{" "}
                        / Editar
                    </h2>
                    <button
                        onClick={() => openCity("London")}
                        className={styles.back}
                    >
                        <i className="fa-solid fa-arrow-left"></i> Regresar
                    </button>

                    <hr className={styles.line}></hr>
                    <form className={styles.body}>
                        <h3 className={styles["config-title"]}>Configuración General</h3>
                        <div className={styles.field}>
                            <label htmlFor="name">Tu Nombre</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder={`${name} ${lastname}`}
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder={`ejemplo@correo.com`}
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="phone">Numero de telefono</label>
                            <input
                                type="number"
                                id="phone"
                                name="phone"
                                placeholder={`+55 55 5555 5555`}
                            />
                        </div>
                        <h3 className={styles["config-title"]}>Cambiar contraseña</h3>
                        <div className={styles.field}>
                            <label htmlFor="password">Pon contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder={`Contraseña actual`}
                            />
                            <label htmlFor="password2">Pon Nueva contraseña</label>
                            <input
                                type="password"
                                id="password2"
                                name="password2"
                                placeholder={`Contraseña nueva`}
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
                </div>
            </div>
        </div>
    );
};

export default ModalProfile;
