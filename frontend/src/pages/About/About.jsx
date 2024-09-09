// ******************** Styles ********************
import styles from './About.module.css';

import { Link } from "react-router-dom"
import About1 from '../../assets/img/about1.jpg';
import About2 from '../../assets/img/about2.jpg';
import About3 from '../../assets/img/about3.jpg';

import logo from '../../assets/img/axolotl worker.png';

const About = () => {
    return (
        <div>
            <div className={styles.header}>
            <h1 className={styles.head}>Descubre quiénes somos: <span>Dedicados a transformar tus ideas en realidad</span></h1>            </div>
            <div className={styles.imgdiv}>
            <img className={styles.aboutimg} src={About1} alt="About1" />
            </div>
        <div className={styles.about}>
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

           

           
            <div className={styles.contactSec}>
            <h1>Directivos de Sparkaxe</h1>
           <div className={styles.contactGrid}>
    <Link to='/contact'>
        <div className={styles.contactbuttons}>
            <img className={styles["axworker"]} src={logo} alt="Sparkaxe-logo" />
            <h3><span className={styles.headingother}>Diego</span></h3>
        </div>
    </Link>

    <Link to='/support'>
        <div className={styles.contactbuttons}>
            <img className={styles["axworker"]} src={logo} alt="Sparkaxe-logo" />
            <h3><span className={styles.headingother}>Joseph</span></h3>
        </div>
    </Link>

    <Link to='/support'>
        <div className={styles.contactbuttons}>
            <img className={styles["axworker"]} src={logo} alt="Sparkaxe-logo" />
            <h3><span className={styles.headingother}>Remy</span></h3>
        </div>
    </Link>

    <Link to='/support'>
        <div className={styles.contactbuttons}>
            <img className={styles["axworker"]} src={logo} alt="Sparkaxe-logo" />
            <h3><span className={styles.headingother}>Isaac</span></h3>
        </div>
    </Link>
</div>
</div>

            

          
            
            </div>

            

            

        </div>
    )
}  

export default About