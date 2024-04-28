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
            <h1 className={styles.head}>Conoce mas de nosotros</h1>
            <div className={styles.content}>
            <p>
            Bienvenido a Sparkaxe, tu herramienta confiable en el control y gestión de sitios web. En un mundo digital en constante evolución, comprendemos la importancia de mantener la integridad y seguridad de tus activos en línea.
            </p>
            <p>
            En Sparkaxe, nos especializamos en la creación de portales web personalizados, diseñados específicamente para tus necesidades y objetivos. Cada sitio web que creamos es único y adaptado a la identidad y visión de tu marca. Desde pequeñas empresas hasta grandes corporaciones, nuestro equipo de expertos trabaja contigo para entender tus requerimientos y crear soluciones a medida que se adapten perfectamente a tu marca y audiencia.
            </p>
            <p>
            Nos enorgullece ofrecer un enfoque personalizado en cada proyecto, asegurando que tu presencia en línea refleje tu identidad única y cumpla con tus expectativas. En Sparkaxe, creemos en la transparencia y la confianza. Trabajamos incansablemente para garantizar que tengas el control total sobre tus sitios web. Nuestra plataforma te proporciona las herramientas necesarias para monitorear y gestionar tu contenido de manera efectiva, permitiéndote mantener tu presencia en línea actualizada y segura en todo momento.
            </p>
            <p>
            Únete a nosotros y descubre cómo Sparkaxe puede ayudarte a llevar tus sitios web al siguiente nivel, con seguridad, confiabilidad y una experiencia de usuario excepcional. Tu éxito en línea es nuestra prioridad.
            </p>
            </div>
        </div>
    )
}

export default About