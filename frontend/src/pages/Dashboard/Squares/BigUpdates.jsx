// ***************** Styles *****************
import styles from "./Big.module.css";

const BigUpdates = () => {
    return (
        <div className={styles["big"]}>
            <div className={styles["bigtop"]}>
                <p>
                    <i className="fa-solid fa-bell"></i> Avisos
                </p>
            </div>
            <table className={styles["anouncetable"]}>
               <tbody>
                <tr>
                        <th>Update version 1.4</th>
                        <td>
                            Update a funcionalidades de agregacion de
                            productos y animaciones
                        </td>
                    </tr>
                    <tr>
                        <th>Update version 1.3</th>
                        <td>
                            Update a funcionalidades de agregacion de
                            productos y animaciones
                        </td>
                    </tr>
                    <tr>
                        <th>Update version 1.2</th>
                        <td>
                            Update a funcionalidades de agregacion de
                            productos y animaciones
                        </td>
                    </tr>
               </tbody>
            </table>
        </div>
    )
}

export default BigUpdates;