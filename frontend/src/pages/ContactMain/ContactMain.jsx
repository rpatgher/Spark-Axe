// ******************** Styles ********************
import styles from './ContactMain.module.css';

import { Link } from "react-router-dom"
import logo from '../../assets/img/axolotl worker.png';
import PlusL from '../../assets/img/PlusL.png';
import FQL from '../../assets/img/FQL.png';
import Marcarerror from '../../assets/img/Marcarerror.png';
import HeadContact from '../../assets/img/HeadContact.png';

const About = () => {
    return (
        <div>
            <div className={styles.HeadContact}>
            <img className={styles.HeadContactimg} src={HeadContact} alt="HeadContact" />
            </div>
            <h1 className={styles.head}>Contactanos</h1>
            <div className={styles.background}> 
            <p className={styles.headp}>Ofrecemos Soporte Técnico 24/7 para optimizar tu experiencia en nuestro sitio web. ¡Confía en nuestros expertos para resolver cualquier inconveniente y garantizar un funcionamiento óptimo en todo momento!</p>
            <div className={styles.enviocontent0}>
            <Link to='/contact'>
                <div className={styles.contactbuttons}>
            <img className={styles["axworker"]} src={logo} alt="Sparkaxe-logo" />

            <h3><span className={styles.headingother}>Soporte</span></h3>
            </div>
            </Link>
            <Link to='/support'>
            <div className={styles.contactbuttons}>
            <img className={styles["axworker"]} src={PlusL} alt="Sparkaxe-logo" />

            <h3><span className={styles.headingother}>Aplicar</span></h3>
            </div>
            </Link>
            <Link to='/support/questions'>
            <div className={styles.contactbuttons}>
            <img className={styles["axworker"]} src={FQL} alt="Sparkaxe-logo" />

            <h3><span className={styles.headingother}>Preguntas frequentes</span></h3>
            </div>
            </Link>

            </div>
            <div className={styles.enviocontent2}>
            <div className={styles.marcarerrordivinfo}>
            <h2><span className={styles.heading}><i class="fa-solid fa-headset"></i></span></h2>
            <h2><span className={styles.heading}>Soporte dentro de tu cuenta sparkaxe</span></h2>
            <p>En tu panel de control, en la esquina inferior derecha, encontrarás un botón rojo etiquetado como "Marcar error". Si necesitas soporte de cualquier tipo, simplemente haz clic en él. Se tomará una captura de pantalla de tu pantalla y se te proporcionará un formulario para que describas el error ocurrido. Nuestro equipo de soporte te contestará lo antes posible para ayudarte, contando con especialistas en la materia para resolver tu inconveniente.</p>
            </div>
            <img className={styles.marcarerrorimg} src={Marcarerror} alt="Marcarerror" />
            </div>
        <div className={styles.enviocontent}>
        <div className={styles.tabcontent1}>
            <h2 className={styles.heading}>Soporte</h2>
            <p className={styles.supportText}>
        Si ya tienes cuenta y necesitas soporte,
        <Link to="/contact" className={styles.supportLink}>
          <strong>Haz clic aquí</strong>
        </Link>
      </p>
            
           
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
                <Link to='/dashboard/inventory'> <button className={styles.Buttonguardar}>Enviar</button></Link>
                </form>
                </div>
                </div>
            </div>
        </div>
    )
}

export default About