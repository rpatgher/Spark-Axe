// ******************** Styles ********************
import styles from './contact.module.css';

import { Link } from "react-router-dom"
import logo from '../../assets/img/axolotl worker.png';


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
            <img className={styles["axworker"]} src={logo} alt="Sparkaxe-logo" />

            <h3><span className={styles.headingother}>Editar</span></h3>
            </div>
            <div className={styles.enviocontent}>
            <h2><span className={styles.headingother}>Marcar error</span></h2>
            <p>En tu dashboard en el lado derecho abajo hay un boton rojo nombrado Marcar error si deseas</p>
            </div>
        <div className={styles.enviocontent}>
        <div className={styles.tabcontent1}>
            <h2><span className={styles.heading}>Soporte</span></h2>
            
           
            <form 
            className={styles.body}
        >
            <div className={styles.field}>
                    <label htmlFor="">Tu nombre</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`10`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Correo</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`20`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Nombre del sitio web</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`30`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Describe el problema</label>
                    <textarea 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`30`}
            
                    />
                </div>
                </form>
                <Link to='/dashboard/inventory'> <button className={styles.Buttonguardar}>Guardar cambios</button></Link>
                </div>
                </div>
            </div>
        </div>
    )
}

export default About