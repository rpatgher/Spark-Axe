import styles from './Functions.module.css'; 
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
        <h2>Fitness+</h2>
        <h3>Get 3 months free when you buy an iPad.</h3>
        <p>From HIIT to Meditation, there's something for everyone.</p>
        <a href="#" className={styles.learnMore}>Learn more &gt;</a>
      </div>
    </div>
  );
}

export default EnseñarFunctions;
