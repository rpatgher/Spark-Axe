// ******************** Styles ********************
import styles from './Dashboard.module.css';
// **************** Images ****************
import lunaAxImage from '../../assets/img/TiendaM.png';

const Dashboard = () => {
    return (
        <div>
            <div className={styles["Dashboard"]}>
                <div className={styles["Profile"]}>
                <div>
                               <img className={styles["ProfilePic"]} src={lunaAxImage} alt="Axolotl-Waiting" />
                               </div>
                <h2 className={styles["ProfileHead"]}>Hola Diego,</h2>
                <p className={styles["ProfileHead"]}>Tienes <span style={{ color: 'blue' }}>4 notificaciones</span> </p>
                <p className={styles["ProfileHead"]}>Sparkaxe</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
