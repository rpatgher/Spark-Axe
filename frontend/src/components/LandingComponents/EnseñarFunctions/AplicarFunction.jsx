import styles from './Functions.module.css'; 
import Spark from "../../../assets/img/Spark.png";
import { Link } from 'react-router-dom';

const AplicarFunction = () => {
  return (
    <div className={styles.container}>
      {/* Sección de texto a la izquierda */}
      <div className={styles.textSection}>
        <h1>Sparkaxe</h1>
        <h3>La mejor forma de manejar tu negocio a tu manera</h3>
        <p>Aplica hoy para crear tu sitio personalizado con su dahsboard personalizado</p>
        <p className={styles.learnMore}> <Link to="/Support">Aplicar</Link></p>
      </div>
    </div>
  );
}

export default AplicarFunction;
