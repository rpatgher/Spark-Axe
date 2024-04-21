import { Link } from 'react-router-dom';

// ************** Styles *************
import styles from './HeadingsRuta.module.css';

const HeadingsRuta = ({currentHeading, routes}) => {
    return (
        <div>
            <h2>
                {routes.map((route, index) => (
                    <Link key={index} to={route.path} title="Regresar">
                        <span className={styles.headingback}>{route.name} / </span>
                    </Link>
                    
                ))}
                <span className={styles.heading}>{currentHeading}</span>
            </h2>
        </div>
    )
}

export default HeadingsRuta
