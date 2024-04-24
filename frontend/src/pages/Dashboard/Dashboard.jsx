// ******************** Styles ********************
import styles from './Dashboard.module.css';
// **************** Images ****************
import lunaAxImage from '../../assets/img/TiendaM.png';
import Vape from '../../assets/img/vape.webp';

const Dashboard = () => {
    return (
        <div>
            <div className={styles["Dashboard"]}>
                <h1>La mejor forma de manejar tu negocio a tu manera</h1>
            <div  className={styles["row"]}>
                <div className={styles["Profile"]}>
                <div>
                               <img className={styles["ProfilePic"]} src={lunaAxImage} alt="Axolotl-Waiting" />
                               </div>
                <h2 className={styles["ProfileHead"]}>Hola Diego,</h2>
                <p className={styles["ProfileHead"]}>Tienes <span style={{ color: 'blue' }}>4 notificaciones</span> </p>
                <p className={styles["ProfileHead"]}>Sparkaxe</p>
                </div>
                <div className={styles["Most"]}>
                <img className={styles["Mostproduct"]} src={Vape} alt="Most sold product" />
                    <h4>Producto mas vendido</h4>
                </div>
                <div className={styles["big"]}>
                    <div className={styles["bigtop"]}>
                    <p><i className="fa-solid fa-dolly"></i>  Inventario bajo</p>
                    </div>
                    <p>hello qorld</p>
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
                <p className={styles["ProfileHead"]}>Sparkaxe+</p>
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
