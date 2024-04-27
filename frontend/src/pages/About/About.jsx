// ******************** Styles ********************
import styles from './About.module.css';

import { Link } from "react-router-dom"


const About = () => {
    return (
        <div>
            <div className={styles.nav}>
            <ul className={styles.navbar}>
            <Link to="/"><li className={styles.navB}><a>Inicio</a></li></Link>
            <Link to="/about"><li className={styles.navB}><a>Sobre Nosotros</a></li></Link>
            <Link to="/contact"><li className={styles.navB}><a>Contactanos</a></li></Link>
            <Link to="/signup"><li className={styles.rightnavB}><a>Registrarse</a></li></Link>
            <Link to="/login"><li className={styles.rightnavB}><a>Iniciar Sesion</a></li></Link>
</ul>
            </div>
            <h1 className={styles.home}>About</h1>
        </div>
    )
}

export default About