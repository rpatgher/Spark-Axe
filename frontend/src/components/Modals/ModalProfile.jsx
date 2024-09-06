import { Link } from "react-router-dom";
// **************** Hooks ****************
import useAuth from "../../hooks/useAuth";
import React, { useEffect, useState } from "react";

// **************** Styles ****************
import styles from "./ModalProfile.module.css";

// **************** Components ****************
import FormProfile from "../FormProfile";


const ModalProfile = () => {
    const { auth, setProfileModal } = useAuth();
    const [activeTab, setActiveTab] = useState("London");

    const { name, lastname, email, phone, websites } = auth;

    const [show, setShow] = useState(false);

    useEffect(() => {
        const showModal = () => {
            setTimeout(() => {
                setShow(true);
            }, 300);
        }
        return () => showModal();
    }, []);

    const unshowModal = () => {
        setShow(false);
        setTimeout(() => {
            setProfileModal(false);
        }, 300);
    }

    const openCity = (cityName) => {
        setActiveTab(cityName);
    };


    
    return (
        <div className={styles["modal-wrapper"]}>
            <div className={`${styles["modal-profile"]} ${show ? styles.show : ''}`}>
                <button
                    className={styles["close-modal"]}
                    onClick={unshowModal}
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
                        {/* <p className={styles.p3}><strong>Avatar</strong></p> */}
                        <div className={styles["info-field-website"]}>
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

                    <hr className={styles.line}></hr>
                    <FormProfile auth={auth} />
                </div>
            </div>
        </div>
    );
};

export default ModalProfile;
