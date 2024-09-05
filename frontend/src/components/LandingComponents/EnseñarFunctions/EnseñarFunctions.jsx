import styles from './Functions.module.css'; 
import Spark from "../../../assets/img/Spark.png";


const EnseñarFunctions = () => {
  return (
    <div className={styles.container}>
      {/* Sección de texto a la izquierda */}
      <div className={styles.textSection}>
        <h2>Crea tu propias funciones</h2>
        <h3>Escoje que necesita tener tu portal</h3>
        <p>Tu llegas con la idea nosotros la convertimos realidad</p>
        <a href="#" className={styles.learnMore}>Aplicar</a>
      </div>

      {/* Sección de imagen a la derecha */}
      <div className={styles.imageSection}>
        <img 
          src={Spark}
          alt="Apple Fitness on iPad" 
          className ={styles.ipadImage}
        />
      </div>
    </div>
  );
}

export default EnseñarFunctions;
