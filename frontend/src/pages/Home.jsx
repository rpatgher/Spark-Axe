import styles from '../styles/Home.module.css';
import logo from '../assets/img/logo.png';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"

const Home = () => {
    const [logoIndex, setLogoIndex] = useState(0);
    const [fontIndex, setFontIndex] = useState(0);
    const logos = [logo, logo, logo]; // Add your logo paths here
    const fonts = ['arial', 'roboto', 'BrushScriptMT']; // Add your font class names here

    useEffect(() => {
        const interval = setInterval(() => {
            setLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
            setFontIndex((prevIndex) => (prevIndex + 1) % fonts.length);
        }, 1000); // Change image and font every 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className={styles.nav}>
                <ul className={styles.navbar}>
                    <li className={styles.navB}><Link to="/">Inicio</Link></li>
                    <li className={styles.navB}><Link to="/about">Sobre Nosotros</Link></li>
                    <li className={styles.navB}><Link to="/contact">Contactanos</Link></li>
                    <li className={styles.rightnavB}><Link to="/signup">Registrarse</Link></li>
                    <li className={styles.rightnavB}><Link to="/login">Iniciar Sesion</Link></li>
                </ul>
            </div>
            <div className={styles.header}>
                <img className={styles.logo} src={logos[logoIndex]} alt="Sparkaxe-logo" />
                <h1 className={`${styles.head} ${styles[fonts[fontIndex]]}`}>
                    Sparkaxe La mejor forma de manejar tu negocio a tu manera
                </h1>
            </div>
        </div>
    )
}

export default Home;
