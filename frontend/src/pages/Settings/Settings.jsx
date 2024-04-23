import React, { useState } from 'react';
import styles from  './Settings.module.css';
// **************** Images ****************
import TiendaM from '../../assets/img/TiendaM.png';

function Settings() {
  const [activeTab, setActiveTab] = useState('London');
  const [activeTab2, setActiveTab2] = useState('Paris');

  const openCity = (cityName) => {
    setActiveTab(cityName);
  };
  const openCity2 = (cityName2) => {
    setActiveTab2 (cityName2);
  };

  return (
    <div>
   
   <div className={styles.tab}>
        <button className={`${styles.tablinks} ${activeTab === 'London' ? styles.active : ''}`} onClick={() => openCity('London')}>General</button>
        <button className={`${styles.tablinks} ${activeTab === 'Paris' ? styles.active : ''}`} onClick={() => openCity('Paris')}>Configuración</button>
        <button className={`${styles.tablinks} ${activeTab === 'Tokyo' ? styles.active : ''}`} onClick={() => openCity('Tokyo')}>Plan</button>
      </div>

      <div id="London" className={styles.tabcontent} style={{display: activeTab === 'London' ?  'flex' : 'none'}}>
      <div className={styles.leftdiv}>
      <h2 className={styles.heading}>Elibaba</h2>
      <div className={styles.profilecard}>
        <h2>Sparkaxe +</h2>
        <button className={styles.linkother} onClick={() => openCity('Tokyo')}><i class="fa-regular fa-credit-card"></i> Plan</button>
        <button className={styles.linkother} onClick={() => openCity('Paris')}><i class="fa-solid fa-store" ></i> Configurar Tienda</button>
        <button className={styles.linkother}><i class="fa-regular fa-credit-card"></i> Cambiar metodo de pago</button>
      </div>
      <p><strong>¿Algun problema?</strong></p>
      <button className={styles.linksettings}><i class="fa-solid fa-comments"></i> Contactanos</button>
      <p></p>
      <button className={styles.linksettings}><i class="fa-solid fa-cloud"></i> Sobre Nosotros</button>
      <p></p>
      <button className={styles.linksettings}><i class="fa-solid fa-box"></i> Otro</button>
      </div>
      <div className={styles.rightdiv}>
      <div className={styles.rightcontent}>
      <div className={styles.Tiendaprofile}> <img className={styles["TiendaM"]} src={TiendaM} alt="Axolotl-Waiting" />
        <h2>Resumen de Tienda</h2>
        <p><strong>Descripcion de la tienda</strong></p>
      <p>Tienda de vapes</p>
      </div>
     
      

      </div>
      </div>
      </div>

      <div id="Paris" className={styles.tabcontent} style={{display: activeTab === 'Paris' ? 'block' : 'none'}}>
        <div id="Paris" className={styles.tabcontent} style={{display: activeTab2 === 'Paris' ? 'block' : 'none'}}>
      <h2 className={styles.heading}>Configuración de Tienda</h2>
      <p><strong>Nombre de Tienda</strong></p>
      <p>Elibaba</p>
      <p><strong>Tipo de sitio web</strong></p>
      <p>E-commerce</p>
      <p><strong>Administrador</strong></p>
      <p>Eli knanni</p>
      <p><strong>Descripcion de la tienda</strong></p>
      <p>Tienda de vapes</p>
      <p><strong>Dominio Web</strong></p>
      <p>Elibaba.com</p>
      <p><strong>Tipo de divisa</strong></p>
      <p>$MXN</p>
      <p><strong>Avatar</strong></p>
      <button className={styles.linksettings} onClick={() => openCity2('Editar')}>Editar Configuración de Tienda</button>
      
      </div>

      <div id="Paris" className={styles.tabcontent} style={{display: activeTab2 === 'Editar' ? 'block' : 'none'}}>
        
      <h2><span className={styles.headingback} onClick={() => openCity2('Paris')}>Configuración de Tienda / </span><span className={styles.heading}>Editar</span></h2>
      <div className={styles["go-back"]} onClick={() => openCity2('Paris')}>
                <button> <i className="fa-solid fa-arrow-left"  ></i> Regresar</button>
            </div>
      <form 
            className={styles.body}
        >
            <div className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="">Nombre de Tienda</label>
                    <input 
                        type="text" 
                        id="" 
                        name="" 
                        placeholder={`Nombre de Tienda`}
                    />
                </div>
                <div className={styles.field}>
            <label for="" >Select an option:</label>
            <select id="" name="">
            <option value="" disabled selected>Escoje Tipo de Tienda</option>
                <option value="option1">E-commerce</option>
                <option value="option2">Enterprise</option>
                <option value="option3">Landing page</option>
                <option value="option2">Studio Portfolio</option>
                <option value="option2">Blog</option>
            </select>
        </div>
                <div className={styles.field}>
                    <label htmlFor="">Administrador</label>
                    <input 
                        type="text" 
                        id="" 
                        name="" 
                        placeholder={`Administrador de Tienda`}
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Descripción de Tienda</label>
                    <textarea 
                        id="" 
                        rows="10" 
                        name="" 
                        placeholder={`Descripción de Tienda`}
                    />
                </div>
                <div className={styles.fieldD} title="Contacte Sparkaxe">
                    <label htmlFor="">Dominio Web (si desea cambiarlo contacte sparkaxe)</label>
                    <input 
                        type="text" 
                        id="" 
                        name="" 
                        value={`Elibaba.com`}
                        disabled />
                        <div className={styles.buttondiv}>
                          <button className={styles.buttoncontactchange}>Contacte Sparkaxe <p className={styles.interiorbutton}>(Puede a ver costos adicionales)</p></button>
                          </div>
                        
                </div>
                <div className={styles.fieldD} title="Contacte Sparkaxe">
                    <label htmlFor="">Tipo de divisa</label>
                    <input 
                        type="text" 
                        id="" 
                        name="" 
                        value={`$MXN (Peso Mexicano)`}
                        disabled />
                        <div className={styles.buttondiv}>
                          <button className={styles.buttoncontactchange}>Contacte Sparkaxe <p className={styles.interiorbutton}>(Puede a ver costos adicionales)</p></button>
                          </div>
                        
                </div>

                <button className={styles.Buttonguardar} onClick={(e) => { e.preventDefault(); openCity2('Paris') }}>Guardar cambios</button>

                </div>
                </form>
                </div>  
                
      </div>
    

      <div id="Tokyo" className={styles.tabcontent} style={{ display: activeTab === 'Tokyo' ? 'flex' : 'none' }}>
  <div className={styles.leftdiv}>
    <h2 className={styles.heading}>Tu Sparkaxe Plan</h2>
    <h3>Sparkaxe+</h3>
    <p>$300/Mensual </p>
    <p><strong>Ciclo de facturación: </strong>Mensual</p>
    <h3>Incluye</h3>
    <ul>
      <li className={styles.list}>Manejo de Pedidos</li>
      <li className={styles.list}>Manejo de Productos</li>
      <li className={styles.list}>Manejo de Inventario</li>
      <li className={styles.list}>Manejo de Clientes</li>
      <li className={styles.list}>Manejo de Envio</li>
    </ul>
    <h3> Cuenta</h3>
    <p>Imediatamente borra tu cuenta de tienda y cancela tu plan </p>
    <button className={styles.Borrar}>Cancelar subscripcion</button>
  </div>
  <div className={styles.rightdiv}>
    <div className={styles.rightcontent}>
    <h3>Version de Sparkaxe+</h3>
      <p>Version 1.2</p>
      <div className={styles.divinfo}>
        <h4>¿Como cambiar metodo de pago?</h4>
        <p>En su metodo de pago seleccionado se hace el ciclo de facturación mensualmente si desea cambiarlo presione aqui.</p>
        <button className={styles.linksettings}><i class="fa-regular fa-credit-card"></i> Cambiar metodo de pago</button>
      </div>
      </div>
  </div>
</div>


    </div>
  );
}

export default Settings;