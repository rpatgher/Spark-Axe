// ******************** Styles ********************
import styles from './Dashboard.module.css';
// **************** Images ****************
import lunaAxImage from '../../assets/img/TiendaM.png';

const Dashboard = () => {
    return (
        <div>
            <div className={styles["Dashboard"]}>
            <div  className={styles["row"]}>
                <div className={styles["Profile"]}>
                <div>
                               <img className={styles["ProfilePic"]} src={lunaAxImage} alt="Axolotl-Waiting" />
                               </div>
                <h2 className={styles["ProfileHead"]}>Hola Diego,</h2>
                <p className={styles["ProfileHead"]}>Tienes <span style={{ color: 'blue' }}>4 notificaciones</span> </p>
                <p className={styles["ProfileHead"]}>Sparkaxe</p>
                </div>
                <div className={styles["Menu"]}>
                    <div className={styles["Menu-item"]}>
                    Hello
                    </div>
                    
                </div>
                <div className={styles["big"]}>
                    <div className={styles["Menu-item"]}>
                    Hello
                    </div>
                    </div>  
                </div>




                <div  className={styles["row"]}>
                <div className={styles["big"]}>
                    <div className={styles["Menu-item"]}>
                    Hello
                    </div>
                    </div> 
                <div className={styles["Profile"]}>
                <div>
                               <img className={styles["ProfilePic"]} src={lunaAxImage} alt="Axolotl-Waiting" />
                               </div>
                <h2 className={styles["ProfileHead"]}>Hola Diego,</h2>
                <p className={styles["ProfileHead"]}>Tienes <span style={{ color: 'blue' }}>4 notificaciones</span> </p>
                <p className={styles["ProfileHead"]}>Sparkaxe</p>
                </div>
                <div className={styles["Menu"]}>
                    <div className={styles["Menu-item"]}>
                    Hello
                    </div>
                    
                </div>
                 
                </div>








                <div  className={styles["row"]}>
                <div className={styles["big"]}>
                    <div className={styles["Menu-item"]}>
                    Hello
                    </div>
                    </div> 
                    <div className={styles["big"]}>
                    <div className={styles["Menu-item"]}>
                    Hello
                    </div>
                    </div> 
                
                 
                </div>
            </div>
        </div>
    )
}

export default Dashboard
