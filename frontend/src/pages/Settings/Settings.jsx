import React, { useState } from 'react';
import styles from  './Settings.module.css';
// **************** Images ****************
import TiendaM from '../../assets/img/TiendaM.png';

function Settings() {
  const [activeTab, setActiveTab] = useState('London');

  const openCity = (cityName) => {
    setActiveTab(cityName);
  };

  return (
    <div>
   
   <div className={styles.tab}>
        <button className={`${styles.tablinks} ${activeTab === 'London' ? styles.active : ''}`} onClick={() => openCity('London')}>General</button>
        <button className={`${styles.tablinks} ${activeTab === 'Paris' ? styles.active : ''}`} onClick={() => openCity('Paris')}>Configuración</button>
        <button className={`${styles.tablinks} ${activeTab === 'Tokyo' ? styles.active : ''}`} onClick={() => openCity('Tokyo')}>Plan</button>
      </div>

      <div id="London" className={styles.tabcontent} style={{display: activeTab === 'London' ? 'block' : 'none'}}>
      <h2 className={styles.heading}>Elibaba</h2>
      <p><strong>Nombre de Tienda</strong></p>
      <p>Elibaba</p>
    
      </div>

      <div id="Paris" className={styles.tabcontent} style={{display: activeTab === 'Paris' ? 'block' : 'none'}}>
      <h2 className={styles.heading}>Configuración de Tienda</h2>
      <p><strong>Nombre de Tienda</strong></p>
      <p>Elibaba</p>
      <p><strong>Tipo de sitio web</strong></p>
      <p>E-commerce</p>
      <p><strong>Administrador</strong></p>
      <p>Eli knanni</p>
      <p><strong>Descripcion de la tienda</strong></p>
      <p>Tienda de vapes</p>
      <p><strong>Avatar</strong></p>
      </div>

      <div id="Tokyo" className={styles.tabcontent} style={{display: activeTab === 'Tokyo' ? 'block' : 'none'}}>
      <h2 className={styles.heading}>Tu Sparkaxe Plan</h2>
      <h3>Sparkaxe+</h3>
      <p>$300/Mensual </p>
      <h3>Incluye</h3>
      <p>Manejo de Productos</p>
      <h3> Cuenta</h3>
      <p>Imediatamente borra tu cuenta de tienda y cancela tu plan </p>
      <button className={styles.Borrar}>Cancelar subscripcion</button>
      </div>
    </div>
  );
}

export default Settings;