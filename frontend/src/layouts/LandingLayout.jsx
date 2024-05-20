// ParentComponent.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from '../styles/LandingLayout.module.css';

function Landinglayout() {
  return (
    <div>
      <div className={styles.nav}>
            <ul className={styles.navbar}>
            <Link to="/"><li className={styles.navB}><a>Inicio</a></li></Link>
            {/* <Link to="/about"><li className={styles.navB}><a>Sobre Nosotros</a></li></Link>
            <Link to="/contact"><li className={styles.navB}><a>Contactanos</a></li></Link> */}
            <Link to="/signup"><li className={styles.rightnavB}><a>Registrarse</a></li></Link>
            <Link to="/login"><li className={styles.rightnavB}><a>Iniciar Sesion</a></li></Link>
</ul>
            </div>
      <Outlet /> {/* This will render child routes here */}
      {/* <div className={styles.footer}>
        Hello this is a footer
      </div> */}
    </div>
  );
}

export default Landinglayout;
