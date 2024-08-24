import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import html2canvas from 'html2canvas';

// **************** Styles ****************
import styles from '../styles/Dashboard.module.css';

// *********** Components ************ 
import SidebarDashboard from '../components/SidebarDashboard/SidebarDashboard'
import HeaderDashboard from '../components/HeaderDashboard/HeaderDashboard'
import ModalError from "../components/Modals/ModalError";
import ModalProfile from "../components/Modals/ModalProfile";
import FloatAlert from '../components/Alert/FloatAlert';
import NotFound from "../pages/NotFound/NotFound";

// **************** Hooks ****************
import useApp from '../hooks/useApp';
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
    const location = useLocation();
    const { darkmode, openModalError, modalError, setScreenshotImage } = useApp();
    const { auth, profileModal, logoutAuth } = useAuth();
    const { alert } = useApp();

    const [validURL, setValidURL] = useState(false);

    useEffect(() => {
        const validateURL = () => {
            const features = auth.websites[0]?.features.map(feature => feature.url);
            if(location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
                setValidURL(true);
            } else{
                setValidURL(features.some(feature => {
                    if(location.pathname.includes(feature)) return true;
                }));
            }
        }
        return () => validateURL();
    }, [location]);


    const takeScreenshot = async () => {
        // Use html2canvas to capture the screenshot
        const screenshot = await html2canvas(document.body);
        setScreenshotImage(screenshot.toDataURL("image/png", 1.0));
        // Open the modal
        openModalError();
        
        // ******* Download the screenshot ********
        // const fakeLink = window.document.createElement("a");
        // fakeLink.style = "display:none;";
        // fakeLink.download = "screenshot.png";
        // fakeLink.href = screenshot.toDataURL("image/png", 1.0);
        // document.body.appendChild(fakeLink);
        // fakeLink.click();
        // document.body.removeChild(fakeLink);
        // fakeLink.remove();
    }

    if(auth.websites.length === 0) return (
        <div className={styles.Noweb}>
            <h1>No websites</h1>
            <Link to="/contact">
                <button>Contact us</button>
            </Link>
            <button
                onClick={logoutAuth}
            ><i className="fa-solid fa-right-from-bracket"></i>Cerrar Sesión</button>
        </div>
    )


    if(!validURL) return (
        <NotFound />
    )

    
    return (
        <div className={styles.dashboard}>
            <SidebarDashboard />
            <div className={styles.body}>
                <HeaderDashboard />
                <main className={styles.main}>
                    {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />}
                    <Outlet />
                    <div className={styles["red-box"]} onClick={takeScreenshot}>
                        <p>Marcar error</p>
                    </div>
                    {modalError && <ModalError />}
                </main>
            </div>
            {profileModal && (
                <ModalProfile />
            )}
        </div>
    )
}

export default DashboardLayout
