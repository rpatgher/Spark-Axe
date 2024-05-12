import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// ******************** Styles ********************
import styles from './Dashboard.module.css';
// **************** Images ****************
import lunaAxImage from '../../assets/img/TiendaM.png';
import happy from '../../assets/img/axhappy.png';
import Vape from '../../assets/img/vape.webp';
import bustop from '../../assets/img/bustop.jpg';
import useAuth from '../../hooks/useAuth';
import clientAxios from '../../config/clientAxios';



const Dashboard = () => {

  useEffect(() => {
    const getElements = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const { data } = await clientAxios(`/api/elements/${auth.websites[0].id}`, config);
            setData(data);
        } catch (error) {
            console.log(error);
        }
    };
    return () => getElements();
}, []);

  const {auth} = useAuth();
  const [data, setData] = useState([]);
  const { name, lastname, websites, role } = auth;
  const [inventory, setInventory] = useState({
    low: 10,
    medium: 20,
    high: 30
});
const dataLength = data.length;
    const [limit, setLimit] = useState(4);
  
  const setStatus = (stock, item) => {
    if (stock >= inventory.high) {
        item.status = "high";
        return (<p className={`${styles.status} ${styles["status-high"]}`}>Alto</p>);
    } else if (stock >= inventory.medium) {
        item.status = "medium";
        return (<p className={`${styles.status} ${styles["status-medium"]}`}>Medio</p>);
    } else {
        item.status = "low";
        return (<p className={`${styles.status} ${styles["status-low"]}`}>Bajo</p>);
    }
};


  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles["Dashboard"]}>
        <h1 className={styles["Homehead"]}>Sparkaxe+<span className={styles["Homehead-grey"]}> La mejor forma de manejar tu negocio a tu manera</span></h1>
        <div className={styles["row"]}>
          <div className={styles["Profile"]}>
            <div>
              <img className={styles["ProfilePic"]} src={lunaAxImage} alt="Axolotl-Waiting" />
            </div>
            <h2 className={styles["ProfileHead"]}>Hola {name}</h2>
            <p className={styles["ProfileHead"]}>Bienvenido a {websites[0].name}, tienes <span style={{ fontWeight: 'bold' }}>4 notificaciones</span> </p>
            <p className={styles["ProfileHead"]}>Sparkaxe+</p>
          </div>
          <div className={styles["Most"]}>
            <img className={styles["Mostproduct"]} src={Vape} alt="Most sold product" />
            <h4>Producto mas vendido</h4>
          </div>
          <div className={styles["big"]}>
            <div className={styles["bigtop"]}>
              <p><i className="fa-solid fa-dolly"></i>  Inventario bajo</p>
            </div>
            {data.filter(product => product.stock < inventory.medium).length === 0 ? (
              <div className={styles["Noinvent"]}>
                 <img className={styles["happyax"]} src={happy} alt="Most sold product" />
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
            {data.filter(product => product.stock < inventory.medium).map((item, index) => {
                if (index < limit) {
                    item.visible = true;
                    return (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.stock}</td>
                            <td>{setStatus(item.stock, item)}</td>
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
        </div>
        <div className={styles["row"]}>
          <div className={styles["big"]}>
            <div className={styles["bigtop"]}>
              <p><i className="fa-solid fa-bell"></i> Avisos</p> 
            </div>
            <table className={styles["anouncetable"]}>
              <tr>
                <th>Update version 1.4</th>
                <td>Update a funcionalidades de agregacion de productos y animaciones</td>
              </tr>
              <tr>
                <th>Update version 1.3</th>
                <td>Update a funcionalidades de agregacion de productos y animaciones</td>
              </tr>
              <tr>
                <th>Update version 1.2</th>
                <td>Update a funcionalidades de agregacion de productos y animaciones</td>
              </tr>


            </table>
          </div>
          <div className={styles.profilecard}>
            <h3>Sparkaxe +</h3>
            <Link to='/dashboard/settings'><button className={styles.linkother} onClick={() => openCity('Tokyo')}><i className="fa-regular fa-credit-card"></i> Plan</button></Link>
            <Link to='/dashboard/settings'><button className={styles.linkother} onClick={() => openCity('Paris')}><i className="fa-solid fa-store" ></i> Configurar Tienda</button></Link>
            <button className={styles.linkother}><i className="fa-regular fa-credit-card"></i> Cambiar metodo de pago</button>
          </div>


        </div>
        <div className={styles["row"]}>
          <div className={styles["big"]}>
            <div className={styles["bigtop"]}>
              <p><i className="fa-solid fa-basket-shopping"></i>  Ultimos pedidos</p>
            </div>

            <table className={styles["anouncetable"]}>
              <tr>
                <th>Fecha de pedido	</th>
                <th>Estado</th>
                <th>Total</th>
              </tr>
              <tr>
                <td>3 de de mayo de 2024		</td>
                <td>En proceso</td>
                <td>$ 10000</td>
              </tr>
              <tr>
                <td>3 de de mayo de 2024		</td>
                <td>En proceso</td>
                <td>$ 10000</td>
              </tr>
              <tr>
                <td>3 de de mayo de 2024		</td>
                <td>En proceso</td>
                <td>$ 10000</td>
              </tr>
              <tr>
                <td>3 de de mayo de 2024		</td>
                <td>En proceso</td>
                <td>$ 10000</td>
              </tr>
            </table>
          </div>
          <div className={styles["enviodiv"]}>
            <div className={styles.left}> <img className={styles["bustop"]} src={bustop} alt="Most sold product" /></div>
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
              <Link to='/dashboard/delivery'><button className={styles.buttondeliver} >Envio</button></Link>
            </div>
          </div>
          <div className={styles["Menu"]}>
          <i className="fa-solid fa-person-digging"></i>
            <p>Trabajando para mejorar sparkaxe</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
