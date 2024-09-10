import styles from './EnseñarFunction2.module.css'; 
import Spark from "../../../assets/img/Spark.png";
import SSAD from "../../../assets/img/Landing/SSAD.png";

const EnseñarFunctions = () => {
  return (
    <div className={styles.container}>
      

      {/* Sección de imagen a la derecha */}
      <div className={styles.imageSection}>
        <img 
          src={SSAD}
          alt="Apple Fitness on iPad" 
          className ={styles.ipadImage}
        />
      </div>

      {/* Sección de texto a la izquierda */}
      <div className={styles.textSection}>
        <h2>Funcionalidades de Anuncios</h2>
        <h3>Administracion de anuncios en tu sitio web</h3>
        <p>Publica anuncios de nuevos productos y haz tu empresa crecer</p>
        <a href="#" className={styles.learnMore}>Aplicar</a>
      </div>
    </div>
  );
}

export default EnseñarFunctions;
