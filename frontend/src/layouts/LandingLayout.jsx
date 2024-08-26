// ParentComponent.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from '../styles/LandingLayout.module.css';

import useAuth from '../hooks/useAuth';

function Landinglayout() {
  const { auth } = useAuth();


  
  return (
    <div>
      <div className={styles.nav}>
            <ul className={styles.navbar}>
            <li className={styles.navB}><Link to="/">Inicio</Link></li>
            <Link to="/about"><li className={styles.navB}><a>Sobre Nosotros</a></li></Link>
            <Link to="/contact"><li className={styles.navB}><a>Contactanos</a></li></Link>
            {auth.id ? (
                <li className={styles.rightnavB}><Link to="/dashboard">Dashboard</Link></li>
            ) : (
              <>
                  <li className={styles.rightnavB}><Link to="/signup">Registrarse</Link></li>
                  <li className={styles.rightnavB}><Link to="/login">Iniciar Sesion</Link></li>
              </>
            )}
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
