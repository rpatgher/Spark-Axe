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
        <div className={styles.footertop}>
        <div className={styles.footerimgdiv}>
          <img className={styles.footerimg} src={Logo} alt="Logo" />
          <p>Sparkaxe</p>
        </div>
        <div className={styles.footermenu}>
        <h3>Menu</h3>
        <Link to="/" className={styles.link}>Inicio</Link>
        <Link to="/about" className={styles.link}><a>Sobre Nosotros</a></Link>
        <Link to="/contact " className={styles.link}><a>Contactanos</a></Link>
        <Link to="/dashboard" className={styles.link}>Dashboard</Link>
        <Link to="/signup" className={styles.link}>Registrarse</Link>
        <Link to="/login" className={styles.link}>Iniciar Sesion</Link>
        </div>
        <div className={styles.footermenu}>
          Aplicar y contacto
          <Link to="/support">
          <button className={styles.learnMore}>Aplicar</button>
          </Link>
          Tienes alguna pregunta?
          <Link to="/support/questions">
          <button className={styles.learnMore}>Ver</button>
          </Link>
          Necesitas ayuda?
          <Link to="/contact">
          <button className={styles.learnMore}>Contactanos</button>
          </Link>
        </div>
      </div> 
      <div className={styles.footerbottom}>
        <p>© 2024 Sparkaxe. All rights reserved</p>
        </div>
      </div>
    </div>
  );
}

export default Landinglayout;
