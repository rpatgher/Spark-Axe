// ******************** Styles ********************
import styles from '../styles/Home.module.css';
import logo from '../assets/img/logo.png';
import { Link } from "react-router-dom"


const Home = () => {
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
            <div className={styles.header}>
            <img className={styles["logo"]} src={logo} alt="Sparkaxe-logo" />
            <h1 className={styles.head}>Sparkaxe La mejor forma de manejar tu negocio a tu manera</h1>
            </div>
            <Link to="/support">support</Link>
        </div>
    )
}

export default Home
