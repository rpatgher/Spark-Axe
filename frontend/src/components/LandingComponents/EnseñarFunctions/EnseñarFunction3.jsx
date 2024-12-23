import styles from './Functions.module.css'; 
import Spark from "../../../assets/img/Landing/Logo.png";
import  {	Link	}	from	"react-router-dom";



const EnseñarFunctions = () => {
  return (
    <div className={styles.container}>
      {/* Sección de texto a la izquierda */}
      <div className={styles.textSection}>
      <h2>Sparkaxe</h2>
        <h3>La mejor forma de manejar tu negocio a tu manera</h3>
        <p>Aplica hoy para crear tu sitio personalizado con su dahsboard personalizado</p>
        <Link to="/dashboard" className={styles.learnMore}>Entra a tu portal</Link>

      </div> 

      {/* Sección de imagen a la derecha */}
      <div className={styles.imageSection}>
        <img 
          src={Spark}
          alt="Sparkaxe image" 
          className ={styles.ipadImage}
        />
      </div>
    </div>
  );
}

export default EnseñarFunctions;
