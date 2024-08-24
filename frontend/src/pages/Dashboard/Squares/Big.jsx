// ***************** Styles *****************
import styles from "./Big.module.css";

// ***************** Images *****************
import happy from "../../../assets/img/axhappy.png";

const Big = ({data, inventory, limit}) => {

    const setStatus = (stock, item) => {
        if (stock >= inventory.high) {
            item.status = "high";
            return (
                <p className={`${styles.status} ${styles["status-high"]}`}>
                    Alto
                </p>
            );
        } else if (stock >= inventory.medium) {
            item.status = "medium";
            return (
                <p className={`${styles.status} ${styles["status-medium"]}`}>
                    Medio
                </p>
            );
        } else {
            item.status = "low";
            return (
                <p className={`${styles.status} ${styles["status-low"]}`}>
                    Bajo
                </p>
            );
        }
    };

    return (
        <div className={styles["big"]}>
            <div className={styles["bigtop"]}>
                <p>
                    <i className="fa-solid fa-dolly"></i> Inventario bajo
                </p>
            </div>
            {data.filter((product) => product.stock < inventory.medium)
                .length === 0 ? (
                <div className={styles["Noinvent"]}>
                    <img
                        className={styles["happyax"]}
                        src={happy}
                        alt="Most sold product"
                    />
                    <h2>¡Muy bien no hay inventario bajo!</h2>
                </div>
            ) : (
                <table className={styles["anouncetable2"]}>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Estatus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data
                            .filter(
                                (product) => product.stock < inventory.medium
                            )
                            .map((item, index) => {
                                if (index < limit) {
                                    item.visible = true;
                                    return (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.stock}</td>
                                            <td>
                                                {setStatus(item.stock, item)}
                                            </td>
                                        </tr>
                                    );
                                } else {
                                    item.visible = false;
                                    return null; // Si no se muestra, retornamos null
                                }
                            })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Big;
