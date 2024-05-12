import React, { useState } from 'react';
import { Link, Outlet } from "react-router-dom";
// ******************** Images ********************
import lunaAxImage from '../../assets/img/envio.png';


// ******************** Styles ********************
import styles from './SetInventory.module.css';

function SetInventory() {
  
    return (
        <div className={styles.background}> 
        <div className={styles.enviocontent}>
        <div id="London" className={styles.tabcontent1}>
            <h2><Link to='/dashboard/inventory'><span className={styles.headingback} >Inventario / </span></Link><span className={styles.heading}>Editar</span></h2>
            <div className={styles["go-back"]}>
            <Link to='/dashboard/inventory'><button onClick={() => openCity('London')}> <i className="fa-solid fa-arrow-left"  ></i> Regresar</button></Link>
            </div>
            
            <form 
            className={styles.body}
        >
            <div className={styles.field}>
                    <label htmlFor="">Menos de la cantidad mínima para ser considerado inventario Bajo</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`10`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Menos de la cantidad mínima para ser considerado inventario Medio</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`20`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Mas de la cantidad mínima para ser considerado inventario Alto</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`30`}
            
                    />
                </div>
                <p style={{textAlign: "center", fontSize: "1.4rem"}}>Esta configuracion se aplicara para todos los productos y es para que tengas mas control sobre tu inventario</p>
                <Link to='/dashboard/inventory'> <button className={styles.Buttonguardar}>Guardar cambios</button></Link>
                </form>
               
                </div>
                </div>
            </div>
    )
}

export default SetInventory
