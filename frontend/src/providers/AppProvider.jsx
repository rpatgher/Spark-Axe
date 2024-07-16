import { createContext, useEffect, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    // const [theme, setTheme] = useState(false);
    
    const [modalError, setModalError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [screenshotImage, setScreenshotImage] = useState(null);

    const [alert, setAlert] = useState({});
    
    useEffect(() => {
        const userSetPreference = getUserSetPreference();
        const mediaQueryPreference = getMediaQueryPreference();
     
        // if (userSetPreference) {
        //     setTheme(userSetPreference)
        // } else {
        //     setTheme(mediaQueryPreference)
        // }   
        // 
        document.body.dataset.theme = theme
    }, [theme]);

    const handleToggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme)
        storeUserSetPreference(newTheme);
        document.body.dataset.theme = theme;
    };

    const storeUserSetPreference = (pref) => {
        localStorage.setItem("theme", pref);
    };

    const getUserSetPreference = () => {
        return localStorage.getItem("theme");
    };

    const getMediaQueryPreference = () => {
        const mediaQuery = "(prefers-color-scheme: dark)";
        const mql = window.matchMedia(mediaQuery);
        const hasPreference = typeof mql.matches === "boolean";
        
        if (hasPreference) {
            return mql.matches ? "dark" : "light";
        }
    };

    const openModalError = () => {
        setModalError(true);
        setTimeout(() => {
            setShowModal(true);
        }, 300);
    }

    const closeModalError = () => {
        setShowModal(false);
        setTimeout(() => {
            setModalError(false);
        }, 300);
    }

    const handleAlert = (msg, error) => {
        setAlert({ msg, error });
        setTimeout(() => {
            setAlert({});
        }, 3500);
    }

    return (
        <AppContext.Provider value={{
            theme,
            handleToggleTheme,
            modalError,
            openModalError,
            closeModalError,
            showModal,
            screenshotImage,
            setScreenshotImage,
            alert,
            handleAlert
        }}>
            {children}
        </AppContext.Provider>
    );
}

export { AppProvider };
export default AppContext;