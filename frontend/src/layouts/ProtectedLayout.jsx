import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "../styles/ProtectedLayout.module.css";
import logo from "../assets/img/logo.png";

const ProtectedLayout = () => {
    const { auth, loading } = useAuth();

    // TODO: Add loading spinner
    if (loading)
        return (
            <div className={styles.loadercontainer}>
                <div>
                    <img
                        className={styles["logo"]}
                        src={logo}
                        alt="Sparkaxe-logo"
                    />
                </div>
                <div className={styles.row}>
                    <div className={styles.loader}>
                        <span className={styles.hour}></span>
                        <span className={styles.min}></span>
                        <span className={styles.circel}></span>
                    </div>
                    <h2 className={styles.Loading}> Sparkaxe</h2>
                </div>
            </div>
        );
    return (
        <div className={styles.loaded}>
            {auth.id ? <Outlet /> : <Navigate to="/login" />}
        </div>
    );
};

export default ProtectedLayout;
