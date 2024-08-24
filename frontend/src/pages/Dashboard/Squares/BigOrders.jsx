// ***************** Styles *****************
import styles from "./Big.module.css";


// ***************** Images *****************
import happy from "../../../assets/img/axhappy.png";


const BigOrders = ({data, orders, inventory, limit}) => {
    return (
        <div className={styles["big"]}>
            <div className={styles["bigtop"]}>
                <p>
                    <i className="fa-solid fa-basket-shopping"></i> Ultimos
                    pedidos
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
                    <h2>¡Todavia no hay pedidos!</h2>
                </div>
            ) : (
                <table className={styles["anouncetable3"]}>
                    <thead>
                        <tr>
                            <th>Fecha de pedido</th>
                            <th>Estado</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => {
                            if (index < limit) {
                                return (
                                    <tr key={order.id}>
                                        <td>{order.delivery_date}</td>
                                        <td>{order.status}</td>
                                        <td>{order.total}</td>
                                    </tr>
                                );
                            } else {
                                return null; // Si no se muestra, retornamos null
                            }
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BigOrders;
