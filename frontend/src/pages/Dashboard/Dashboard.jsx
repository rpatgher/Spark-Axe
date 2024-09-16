import { useState, useEffect } from "react";
import clientAxios from "../../config/clientAxios";


// ******************** Hooks ********************
import useAuth from "../../hooks/useAuth";
import useApp from "../../hooks/useApp";


// ******************** Styles ********************
import styles from "./Dashboard.module.css";

// **************** Components ****************
import Profile from "./Squares/Profile";
import Most from "./Squares/Most";
import Big from "./Squares/Big";
import BigUpdates from "./Squares/BigUpdates";
import ProfileCard from "./Squares/ProfileCard";
import BigOrders from "./Squares/BigOrders";
import FourSmall from "./Squares/FourSmall";
import Delivery from "./Squares/Delivery";

const Dashboard = () => {
    const { auth } = useAuth();
    const { handleAlert } = useApp();
    const [orders, setOrders] = useState([]);
    const [elements, setElements] = useState([]);
    const { name, websites } = auth;
    const [visible, setVisible] = useState(false);
    const [inventory, setInventory] = useState({});
    const [mostSold, setMostSold] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [sales, setSales] = useState(0);
    const [totalPos, setTotalPos] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setVisible(true);
        }, 100); // slight delay to ensure smooth transition
    }, []);

    useEffect(() => {
        const getInfo = async () => {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            try {
                const response = await clientAxios.get(`/api/websites/${auth.websites[0].id}/main-info`, config);
                const { elements, orders, inventory, mostSoldProduct, totalElements, sales, totalCustomers, totalPos } = response.data;
                setElements(elements);
                setOrders(orders);
                setInventory(inventory);
                setMostSold(mostSoldProduct);
                setTotalElements(totalElements);
                setSales(sales);
                setTotalCustomers(totalCustomers);
                setTotalPos(totalPos);
            } catch (error) {
                console.log(error);
                handleAlert("Error al obtener la información", "error");
            }
        }
        return () => getInfo();
    }, []);

    return (
        <div
            className={`${styles.dashboardcontainer} ${
                visible ? styles.visible : ""
            }`}
        >
            <div className={styles["Dashboard"]}>
                {/* {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />} */}
                <h1 className={styles["Homehead"]}>
                    Sparkaxe+
                    <span className={styles["Homehead-grey"]}>
                        {" "}
                        La mejor forma de manejar tu negocio a tu manera
                    </span>
                </h1>
                <div className={styles["row"]}>
                    <Profile name={name} websites={websites} />
                    <Most mostSold={mostSold} />
                    <Big elements={elements} inventory={inventory} />
                </div>
                <div className={styles["row"]}>
                    {/* <Delivery /> */}
                    <FourSmall 
                        squares={[
                            { title: "Productos", value: totalElements },
                            { title: "Ventas", value: sales },
                            { title: "Puntos de Venta", value: totalPos },
                            { title: "Clientes", value: totalCustomers },
                        ]}
                    />
                    <BigOrders orders={orders} />
                    <div className={styles["Menu"]}>
                        <i className="fa-solid fa-person-digging"></i>
                        <p>Trabajando para mejorar sparkaxe</p>
                    </div>
                </div>
                <div className={styles["row"]}>
                    {/* <BigUpdates /> */}
                    <ProfileCard />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
