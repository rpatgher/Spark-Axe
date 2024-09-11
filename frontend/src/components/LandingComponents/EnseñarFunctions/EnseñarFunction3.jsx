import styles from './Functions.module.css'; 
import Spark from "../../../assets/img/Spark.png";



const EnseñarFunctions = () => {
  return (
    <div className={styles.container}>
      {/* Sección de texto a la izquierda */}
      <div className={styles.textSection}>
      <h2>Sparkaxe</h2>
        <h3>La mejor forma de manejar tu negocio a tu manera</h3>
        <p>Aplica hoy para crear tu sitio personalizado con su dahsboard personalizado</p>
        <a href="#" className={styles.learnMore}>Learn more &gt;</a>
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
