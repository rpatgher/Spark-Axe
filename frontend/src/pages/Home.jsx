import styles from '../styles/Home.module.css';
import logo from '../assets/img/logo.png';
import HDLogo from '../assets/img/logos/logohd.png';
import chalkLogo from '../assets/img/logos/logochalk.png';
import Graflogo from '../assets/img/logos/logografitti.png';
import Normlogo from '../assets/img/logos/logonormal.png';
import Shocklogo from '../assets/img/logos/logoshock.png';
import Warplogo from '../assets/img/logos/logowarp.png';
import Wavelogo from '../assets/img/logos/logowave.png';
import Carousel from '../components/LandingComponents/Carousel/Carousel';
import EnseñarFunction1 from '../components/LandingComponents/EnseñarFunctions/EnseñarFunction1';
import EnseñarFunction2 from '../components/LandingComponents/EnseñarFunctions/EnseñarFunction2';
import EnseñarFunction3 from '../components/LandingComponents/EnseñarFunctions/EnseñarFunction3';
import HeaderSparkaxe from '../assets/img/HeaderSparkaxe.jpg';




import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"

const Home = () => {
    const [logoIndex, setLogoIndex] = useState(0);
    const [fontIndex, setFontIndex] = useState(0);
    const logos = [ HDLogo, chalkLogo, Graflogo, Shocklogo, Warplogo,  Normlogo, Wavelogo  ]; // Add your logo paths here         logo,
    const fonts = [
        'HDLogoFont',      // HDLogo
        'ChalkLogoFont',    // chalkLogo
        'GraflogoFont',     // Graflogo
        'ShocklogoFont',       // Shocklogo
        'WarplogoFont',         // Warplogo
        'Open Sans',      // Normlogo
        'WavelogoFont'       // Wavelogo
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
            setFontIndex((prevIndex) => (prevIndex + 1) % fonts.length);
        }, 1000); // Change image and font every 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className={styles.header}>
                <img className={styles.logo} src={logos[logoIndex]} alt="Sparkaxe-logo" />
                <h1 className={`${styles.head}`}>
                    Sparkaxe <br></br> La mejor forma de manejar tu negocio<br></br><span className={`${styles[fonts[fontIndex]]}`}> a tu manera
                    </span>
                    
                </h1>
                </div>
            <EnseñarFunction1 />
            <EnseñarFunction2 />
            <EnseñarFunction3 />
       
        </div>
    )
}

export default Home;
