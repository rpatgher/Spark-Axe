import { Link, Outlet } from "react-router-dom";
import html2canvas from 'html2canvas';

// **************** Styles ****************
import styles from '../styles/Dashboard.module.css';

// *********** Components ************ 
import SidebarDashboard from '../components/SidebarDashboard/SidebarDashboard'
import HeaderDashboard from '../components/HeaderDashboard/HeaderDashboard'
import ModalError from "../components/Modals/ModalError";

// **************** Hooks ****************
import useApp from '../hooks/useApp';
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
    const { darkmode, openModalError, modalError, setScreenshotImage } = useApp();
    const { auth } = useAuth();


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

    if(auth.websites.length === 0) return <div className={styles.Noweb}>
        <h1>No websites</h1>
        <Link to="/contact"> <button>Contact us</button></Link>
        </div>
    
    return (
        <div className={styles.dashboard}>
            <SidebarDashboard />
            <div className={styles.body}>
                <HeaderDashboard />
                <main className={styles.main}>
                    <Outlet />
                    <div className={styles["red-box"]} onClick={takeScreenshot}>
                        <p>Marcar error</p>
                    </div>
                    {modalError && <ModalError />}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
