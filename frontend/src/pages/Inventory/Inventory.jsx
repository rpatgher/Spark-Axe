// ******************** Styles ********************
import styles from './Inventory.module.css';

const Inventory = () => {
    return (
        <>
            <h2 className={styles.heading}>Inventario</h2>
            <div className={styles["table-wrapper"]}>
                <table className={styles["inventory-table"]}>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Stock</th>
                            <th>Precio</th>
                            <th>Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Producto 1</td>
                            <td>10</td>
                            <td>100</td>
                            <td>Editar</td>
                        </tr>
                        <tr>
                            <td>Producto 2</td>
                            <td>20</td>
                            <td>200</td>
                            <td>Editar</td>
                        </tr>
                        <tr>
                            <td>Producto 3</td>
                            <td>30</td>
                            <td>300</td>
                            <td>Editar</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Inventory
