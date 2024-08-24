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
import Delivery from "./Squares/Delivery";

const Dashboard = () => {
    const { auth } = useAuth();
    const { handleAlert } = useApp();
    const [orders, setOrders] = useState([]);
    
    // Los categoriza
    const [data, setData] = useState([]);
    const { name, websites, role } = auth;
    const [inventory, setInventory] = useState({
        low: 10,
        medium: 20,
        high: 30,
    });
    const [limit, setLimit] = useState(5);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setVisible(true);
        }, 100); // slight delay to ensure smooth transition
    }, []);

    // Consigue los inevntarios de la base de datos
    useEffect(() => {
        const getElements = async () => {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            try {
                const { data } = await clientAxios(
                    `/api/elements/${auth.websites[0].id}`,
                    config
                );
                setData(data);
            } catch (error) {
                console.log(error);
                handleAlert("Error al obtener los elementos", "error");
            }
        };
        return () => getElements();
    }, []);

    // Consigue los pedidos de la base de datos
    useEffect(() => {
        // Get orders from the server
        const getOrders = async () => {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            try {
                const { data } = await clientAxios.get(
                    `/api/orders/${auth.websites[0].id}`,
                    config
                );
                setOrders(data);
            } catch (error) {
                console.log(error);
                handleAlert("Error al obtener los pedidos", "error");
            }
        };
        return () => getOrders();
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
                    <Most />
                    <Big data={data} inventory={inventory} limit={limit} />
                </div>
                <div className={styles["row"]}>
                    <BigUpdates />
                    <ProfileCard />
                </div>
                <div className={styles["row"]}>
                    <BigOrders data={data} orders={orders} inventory={inventory} limit={limit} />
                    <Delivery />
                    <div className={styles["Menu"]}>
                        <i className="fa-solid fa-person-digging"></i>
                        <p>Trabajando para mejorar sparkaxe</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
