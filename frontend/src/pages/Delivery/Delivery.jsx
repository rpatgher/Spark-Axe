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
        <div className={styles.background}> 
        <div className={styles.enviocontent}>
        <div id="London" className={styles.tabcontent1} style={{display: activeTab === 'London' ?  'block' : 'none'}}>
            <div className={styles.envio}>
                <div className={styles.content}>
                <h1 className={styles.heading} >Envia a cualquier parte del mundo</h1>
                <div className={styles.content2}>
                <img className={styles["imgA"]} src={lunaAxImage} alt="Axolotl-Waiting" />
                </div>
                <div className={styles.content}>
                <p>Punto de sucursal: <strong > Casa de Remy CDMX la roma norte en el aeropuerto</strong></p>
                </div>
                <div className={styles.envio}>
                    
                <div className={styles.content}>
                <p>Precio de envio </p>
            <p className={styles.result}>$100 MXN</p>
                </div>
                <div className={styles.content}>
                <p>Precio de envio extra</p>
                <p className={styles.result}>$25 MXN</p>
                </div>
                <div className={styles.content}>
                <p>Distancia para extra</p>
                <p className={styles.result}>5 KM</p>
            
                </div>
                
              
                </div>
            <button className={styles.linksettings} onClick={() => openCity('Editar')}>Cambiar precios de envio</button>
            
                </div>
            
            </div>
            
            </div>
            <div id="Editar" className={styles.tabcontent2} style={{display: activeTab === 'Editar' ?  'block' : 'none'}}>
            <h2><span className={styles.headingback} onClick={() => openCity('London')} >Envio / </span><span className={styles.heading}>Editar</span></h2>
            <div className={styles["go-back"]}>
                <button onClick={() => openCity('London')}> <i className="fa-solid fa-arrow-left"  ></i> Regresar</button>
            </div>
            <form 
            className={styles.body}
        >
            <div className={styles.field}>
                    <label htmlFor="">Punto de sucursal</label>
                    <input 
                        type="texto" 
                        id="" 
                        name="" 
                        placeholder={`Casa de Remy CDMX la roma norte en el aeropuerto`}
            
                    />
                </div>
            <div className={styles.field}>
                    <label htmlFor="">Precio de envio Normal</label>
                    <input 
                        type="number" 
                        id="" 
                        name="" 
                        placeholder={`Precio de envio Normal`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Precio de envio Extra</label>
                    <input 
                        type="number" 
                        id="" 
                        name="" 
                        placeholder={`Precio de envio Extra`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Distancia para precio Extra en Km</label>
                    <input 
                        type="number" 
                        id="" 
                        name="" 
                        placeholder={`Distancia para precio Extra en Km`}
            
                    />
                </div>
                <button className={styles.Buttonguardar} onClick={() => openCity('London')}>Guardar cambios</button>
                </form>
                
                </div>
                </div>
            </div>
    )
}

export default Delivery
