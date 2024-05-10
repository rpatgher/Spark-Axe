// ******************** Styles ********************
import styles from './contact.module.css';

import { Link } from "react-router-dom"
import logo from '../../assets/img/axolotl worker.png';
import error from '../../assets/img/marcar_error.png';

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
            <h1 className={styles.head}>Contactanos</h1>
            <div className={styles.background}> 
            <p className={styles.headp}>Ofrecemos Soporte Técnico 24/7 para optimizar tu experiencia en nuestro sitio web. ¡Confía en nuestros expertos para resolver cualquier inconveniente y garantizar un funcionamiento óptimo en todo momento!</p>
            <div className={styles.enviocontent}>
                <div>
            <img className={styles["axworker"]} src={logo} alt="Sparkaxe-logo" />

            <h3><span className={styles.headingother}>Soporte</span></h3>
            </div>
            <div>
            <img className={styles["axworker"]} src={logo} alt="Sparkaxe-logo" />

            <h3><span className={styles.headingother}>Aplicar</span></h3>
            </div>
            <div>
            <img className={styles["axworker"]} src={logo} alt="Sparkaxe-logo" />

            <h3><span className={styles.headingother}>Preguntas frequentes</span></h3>
            </div>

            </div>
            <div className={styles.enviocontent2}>
        
            <div className={styles.marcarerrordivinfo}>
            <h2><span className={styles.heading}>Soporte dentro de tu cuenta sparkaxe</span></h2>
            <p>En tu panel de control, en la esquina inferior derecha, encontrarás un botón rojo etiquetado como "Marcar error". Si necesitas soporte de cualquier tipo, simplemente haz clic en él. Se tomará una captura de pantalla de tu pantalla y se te proporcionará un formulario para que describas el error ocurrido. Nuestro equipo de soporte te contestará lo antes posible para ayudarte, contando con especialistas en la materia para resolver tu inconveniente.</p>
            </div>
            <div className={styles.marcarerrordiv}>
            <button className={styles.marcarerror}>Marcar error</button>
            </div>
          
            </div>
        <div className={styles.enviocontent}>
        <div className={styles.tabcontent1}>
            <h2 className={styles.heading}>Soporte</h2>
            <p>Si ya tienes cuenta y necesitas soporte llena este formulario de caso de no tener cuenta y querer solicitar una <span>Haz clic aqui</span></p>
            
           
            <form 
            className={styles.body}
        >
            <div className={styles.field}>
                    <label htmlFor="">Tu nombre</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`Nombre completo`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Correo</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`ejemplo@correo.com`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Nombre del sitio web</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`dominio.com`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Describe el problema</label>
                    <textarea 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`Describe el problema`}
            
                    />
                </div>
                </form>
                <Link to='/dashboard/inventory'> <button className={styles.Buttonguardar}>Enviar</button></Link>
                </div>
                </div>
            </div>
        </div>
    )
}

export default About