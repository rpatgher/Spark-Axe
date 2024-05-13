
import { Link } from "react-router-dom"
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

                <div id="London" className={styles.tabcontent1} style={{display: activeTab === 'London' ?  'block' : 'none'}}>
                <h2>Configuracion de perfil</h2>
                <hr></hr>
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
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Dominio</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Shakalo store</td>
                            <td>shakalo.com</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                            <Link to="/support"><button className={styles.Newwebsite}>Agregar website</button></Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
                    <button className={styles.edit} onClick={() => openCity('Editar')}>Configurar Perfil</button>
                    </div>
                    <div id="Editar" className={styles.tabcontent1} style={{display: activeTab === 'Editar' ?  'block' : 'none'}}>
                    <h2> <span className={styles.backhead} onClick={() => openCity('London')}>Configuracion de perfil</span> / Editar</h2>
                    <button onClick={() => openCity('London')} className={styles.back}><i className="fa-solid fa-arrow-left"></i> Regresar</button>
                    
                <hr></hr>
                    <form className={styles.body}>
            <p><strong>Configuracion General</strong></p>
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
                <p><strong>Cambiar contraseña</strong></p>
                <div className={styles.field}>
                    <label htmlFor="">Pon contraseña</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`dominio.com`}
            
                    />
                    <label htmlFor="">Pon Nueva contraseña</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`dominio.com`}
            
                    />
                </div>
                <p><strong>Avatar</strong></p>
                <button onClick={() => openCity('London')} className={styles.Buttonguardar}>Guardar cambios</button>
                </form>
               
                    </div>
                    
                    </div>
        </div>
    )
}

export default ModalProfile
