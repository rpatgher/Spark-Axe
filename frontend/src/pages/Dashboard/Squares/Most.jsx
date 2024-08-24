// ***************** Styles *****************
import styles from './Most.module.css';

// ***************** Images *****************
import Vape from "../../../assets/img/vape.webp";

const Most = () => {
    return (
        <div className={styles["Most"]}>
            <img
                className={styles["Mostproduct"]}
                src={Vape}
                alt="Most sold product"
            />
            <h4>Producto mas vendido </h4>
        </div>
    )
}

export default Most
