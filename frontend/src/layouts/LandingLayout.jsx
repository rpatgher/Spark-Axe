// ParentComponent.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from '../styles/LandingLayout.module.css';
import Logo from '../assets/img/Landing/Logo.png';

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
      <div className={styles.footer}>
        <div className={styles.footerimgdiv}>
          <img className={styles.footerimg} src={Logo} alt="Logo" />
          <p>Sparkaxe</p>
        </div>
        <div className={styles.footermenu}>
        Hello this is a footer
        <Link to="/">Inicio</Link>
        <Link to="/about"><a>Sobre Nosotros</a></Link>
        <Link to="/contact"><a>Contactanos</a></Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/signup">Registrarse</Link>
        <Link to="/login">Iniciar Sesion</Link>
        </div>
        <div className={styles.footermenu}>
          Aplicar y contacto
          <button>Aplicar</button>
          Tienes alguna pregunta?
          <button>Ve las preguntas frquentes</button>
          Necesitas ayuda?
          <button>Contactanos</button>
        </div>
      </div> 
    </div>
  );
}

export default Landinglayout;
