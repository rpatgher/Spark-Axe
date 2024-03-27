// ******************** Styles ********************
import styles from './Orders.module.css';

const Orders = () => {
    // Datos de ejemplo (dummy data)
    const ordersList = [
        { id: '1001', orderDate: '2024-03-26', deliveryDate: '2024-04-02', status: 'Enviado', note: 'Ninguna', products: 'Helado de vainilla', total: 19.99 },
        { id: '1002', orderDate: '2024-03-27', deliveryDate: '2024-04-03', status: 'Procesando', note: 'Entregar antes de mediodía', products: 'Pizza de pepperoni', total: 29.99 },
        { id: '1003', orderDate: '2024-03-28', deliveryDate: '2024-04-05', status: 'Cancelado', note: 'Cliente no disponible', products: 'Zapatos deportivos', total: 49.99 },
        { id: '1004', orderDate: '2024-03-29', deliveryDate: '2024-04-06', status: 'En preparación', note: 'Sin plástico', products: 'Camiseta algodón', total: 15.99 }
    ];

    return (
        <div className={styles.ordersContainer}>
            <h2>Órdenes de Producto</h2>
            <table className={styles.ordersTable}>
                <thead>
                    <tr>
                        <th>Núm de pedido</th>
                        <th>Fecha pedido</th>
                        <th>Fecha entrega</th>
                        <th>Status</th>
                        <th>Nota</th>
                        <th>Productos</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {ordersList.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.orderDate}</td>
                            <td>{order.deliveryDate}</td>
                            <td>
                                <select className={styles.statusDropdown} value={order.status} onChange={(e) => {
                                    // Aquí puedes manejar el cambio de estado, por ejemplo actualizando el estado en la base de datos
                                    console.log(`Order ${order.id} status changed to ${e.target.value}`);
                                }}>
                                    <option value="En proceso">En proceso</option>
                                    <option value="Enviado">Enviado</option>
                                    <option value="Cerrado">Cerrado</option>
                                </select>
                            </td>
                            <td>{order.note}</td>
                            <td>{order.products}</td>
                            <td>${order.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Orders;
