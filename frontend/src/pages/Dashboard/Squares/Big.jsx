// ***************** Styles *****************
import styles from "./Big.module.css";

// ***************** Images *****************
import happy from "../../../assets/img/axhappy.png";

const Big = ({elements, inventory}) => {

    const setStatus = (stock) => {
        if (stock >= inventory.high) {
            return (<p className={`${styles.status} ${styles["status-high"]}`}>Alto</p>);
        } else if (stock > inventory.low && stock < inventory.high) {
            return (<p className={`${styles.status} ${styles["status-medium"]}`}>Medio</p>);
        } else {
            return (<p className={`${styles.status} ${styles["status-low"]}`}>Bajo</p>);
        }
    };

    return (
        <div className={styles["big"]}>
            <div className={styles["bigtop"]}>
                <p>
                    <i className="fa-solid fa-dolly"></i> Inventario bajo
                </p>
            </div>
            {elements.length === 0 ? (
                <div className={styles["Noinvent"]}>
                    <img
                        className={styles["happyax"]}
                        src={happy}
                        alt="Most sold product"
                    />
                    <h2>¡Muy bien no hay inventario bajo!</h2>
                </div>
            ) : (
                <table className={styles["anouncetable"]}>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Estatus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elements.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.stock}</td>
                                <td>
                                    {setStatus(item.stock)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Big;
