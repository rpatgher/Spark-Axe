import React, { useState } from 'react';
import styles from './Settings.module.css';

const StoreSettings = () => {
  const [currentView, setCurrentView] = useState('infotienda');

  const toggleView = () => {
    setCurrentView(currentView === 'infotienda' ? 'Especificaciones' : 'infotienda');
  };

  return (
    <div className={styles.container}>
      <h1>Configuración de Tienda</h1>

      {currentView === 'infotienda' ? (
        <section className={styles.section}>
          <h2>Información de la Tienda <button onClick={toggleView} className={styles.button}>Especificaciones</button></h2>
          

          <form>
            <div className={styles.formGroup}>
              <label htmlFor="storeName">Nombre de la Tienda:</label>
              <input type="text" id="storeName" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="storeType">Tipo de Tienda:</label>
              <input type="text" id="storeType" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="administrator">Administrador:</label>
              <input type="text" id="administrator" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Descripción:</label>
              <textarea id="description" className={styles.textarea}></textarea>
              <div>
              <button className={styles.button2}>Crear Tienda</button>
              </div>
            </div>
          </form>
        </section>
      ) : (
        <section className={styles.section}>
          <h2>Especificaciones <button onClick={toggleView} className={styles.button3}>Volver a Información</button></h2>
          

           <form>
            <div className={styles.formGroup}>
              <label htmlFor="storeName">Tiempo Zona: Mexico</label>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="administrator">Idioma de tienda: Español</label>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Moneda: MXN$</label>

              <div>
              <button className={styles.button1}>Borrar Tienda</button>
              </div>
           
             
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default StoreSettings;
