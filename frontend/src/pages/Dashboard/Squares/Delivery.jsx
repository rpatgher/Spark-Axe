import { Link } from "react-router-dom";

// ***************** Styles *****************
import styles from "./Delivery.module.css";


// **************** Images ****************
import bustop from "../../../assets/img/bustop.jpg";

const Delivery = () => {
    return (
        <div className={styles["enviodiv"]}>
            <div className={styles.left}>
                {" "}
                <img
                    className={styles["bustop"]}
                    src={bustop}
                    alt="Most sold product"
                />
            </div>
            <div className={styles.right}>
                <div className={styles.content}>
                    <p className={styles.result}>$100 MXN</p>
                    <p>Precio de envio </p>
                </div>
                <div className={styles.content}>
                    <p className={styles.result}>$25 MXN</p>
                    <p>Precio de envio extra</p>
                </div>
                <div className={styles.content}>
                    <p className={styles.result}>5 KM</p>
                    <p>Distancia para extra</p>
                </div>
                <Link to="/dashboard/delivery">
                    <button className={styles.buttondeliver}>Envio</button>
                </Link>
            </div>
        </div>
    );
};

export default Delivery;
