import styles from './Functions.module.css'; 
import SSPROD from "../../../assets/img/Landing/SSPROD.png";


const EnseñarFunctions = () => {
  return (
    <div className={styles.container}>
      {/* Sección de texto a la izquierda */}
      <div className={styles.textSection}>
        <h2>Crea tu propias funciones</h2>
        <h3>Como gestion de tus productos</h3>
        <p>Donde puedes subir, editar y ver tus productos</p>
        <a href="#" className={styles.learnMore}>Aplicar</a>
      </div>

      {/* Sección de imagen a la derecha */}
      <div className={styles.imageSection}>
        <img 
          src={SSPROD}
          alt="Apple Fitness on iPad" 
          className ={styles.ipadImage}
        />
      </div>
    </div>
  );
}

export default EnseñarFunctions;
