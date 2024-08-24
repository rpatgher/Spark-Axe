// ***************** Styles *****************
import styles from "./Big.module.css";

// ***************** Images *****************
import happy from "../../../assets/img/axhappy.png";

// ******************** Helpers ********************
import formatDate from "../../../helpers/formatDate";
import formatMoney from "../../../helpers/formatMoney";


const BigOrders = ({ orders }) => {
    
    const setStatus = (status) => {
        switch (status) {
            case "IP":
                return (<p className={`${styles.select} ${styles["select-IP"]}`}>En proceso</p>);
            case "C":
                return (<p className={`${styles.select} ${styles["select-C"]}`}>Cerrado</p>);
            case "S":
                return (<p className={`${styles.select} ${styles["select-S"]}`}>Enviado</p>);
            case "CA":
                return (<p className={`${styles.select} ${styles["select-CA"]}`}>Cancelado</p>);
            default:
                return "Error";
        }
    };

    return (
        <div className={styles["big"]}>
            <div className={styles["bigtop"]}>
                <p>
                    <i className="fa-solid fa-basket-shopping"></i> Ultimos
                    pedidos
                </p>
            </div>

            {orders.length === 0 ? (
                <div className={styles["Noinvent"]}>
                    <img
                        className={styles["happyax"]}
                        src={happy}
                        alt="Most sold product"
                    />
                    <h2>¡Todavia no hay pedidos!</h2>
                </div>
            ) : (
                <table className={styles["anouncetable"]}>
                    <thead>
                        <tr>
                            <th>Fecha de pedido</th>
                            <th>Estado</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{formatDate(order.createdAt)}</td>
                                <td>{setStatus(order.status)}</td>
                                <td>{formatMoney(order.total)} MXN</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BigOrders;
