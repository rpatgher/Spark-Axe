import React, { useState } from 'react';
// ******************** Images ********************
import lunaAxImage from '../../assets/img/envio.png';


// ******************** Styles ********************
import styles from './Delivery.module.css';

function Delivery() {
    const [activeTab, setActiveTab] = useState('London');

    const openCity = (cityName) => {
        setActiveTab(cityName);
      };
  
    return (
        <div>
        <div id="London" className={styles.tabcontent} style={{display: activeTab === 'London' ?  'block' : 'none'}}>
            <h1>Envio</h1>
            <div>  <img className={styles["imgA"]} src={lunaAxImage} alt="Axolotl-Waiting" /></div>
            <p>Con Sparkaxe llega mas lejos personaliza precios de envio</p>
            <strong>Precio de envio Normal</strong>
            <p>$100 MXn</p>
            <strong>Precio de envio Extra</strong>
            <p>$25 MXn</p>
            <button onClick={() => openCity('Editar')}>Cambiar precios de envio</button>
            </div>
            <div id="Editar" className={styles.tabcontent} style={{display: activeTab === 'Editar' ?  'block' : 'none'}}>
            <h2><span className={styles.headingback} onClick={() => openCity('London')} >Envio / </span><span className={styles.heading}>Editar</span></h2>
            <form 
            className={styles.body}
        >
            <div className={styles.field}>
                    <label htmlFor="">Precio de envio Normal</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`Precio de envio Normal`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Precio de envio Extra</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`Precio de envio Extra`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Distancia para precio Extra en Km</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`Distancia para precio Extra en Km`}
            
                    />
                </div>
                </form>
                <button onClick={() => openCity('London')}>Guardar cambios</button>
                </div>
            </div>
    )
}

export default Delivery
