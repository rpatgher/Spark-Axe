

// **************** Hooks ****************
import useAuth from "../../hooks/useAuth";
import React, { useState } from 'react';

// **************** Styles ****************
import styles from './ModalProfile.module.css';

const ModalProfile = () => {
    const { auth, setProfileModal } = useAuth();
    const [activeTab, setActiveTab] = useState('London');

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
                <h2>Configuracion de perfil</h2>
                <hr></hr>


                <div id="London" className={styles.tabcontent1} style={{display: activeTab === 'London' ?  'block' : 'none'}}>
                <p><strong>Nombre</strong></p>
                <p>Diego</p>
                <p><strong>Correo</strong></p>
                <p>correo2@correo.com</p>
                <p><strong>Numero telefonico</strong></p>
                <p>+5560890823</p>
                <p><strong>Contraseña</strong></p>
                <p>Cambiar contraseña</p>
                <p><strong>Avatar</strong></p>
                <p><strong>Websites</strong></p>
                <p>Shakalo store</p>
                    <button className={styles.linksettings} onClick={() => openCity('Editar')}>Cambiar Perfil</button>
                    </div>
                    <div id="Editar" className={styles.tabcontent1} style={{display: activeTab === 'Editar' ?  'block' : 'none'}}>
                    <form 
            className={styles.body}
        >
            <div className={styles.field}>
                    <label htmlFor="">Tu Nombre</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`Nombre completo`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Correo</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`ejemplo@correo.com`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Numero de telefono</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`dominio.com`}
            
                    />
                </div>
                <p>Cambiar contraseña</p>
                
                </form>
                <button className={styles.linksettings} onClick={() => openCity('London')}>Guardar cambios</button>
                    </div>
                    
                    </div>
        </div>
    )
}

export default ModalProfile
