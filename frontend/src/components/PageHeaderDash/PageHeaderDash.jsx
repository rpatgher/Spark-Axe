


// ******************** Styles ********************
import HeadingsRuta from '../HeadingsRuta/HeadingsRuta';

// ******************** Componentes ********************
import styles from './PageHeaderDash.module.css';



const PageHeaderDash = ({title, description, image}) => {
    return (
        <div className={styles.top}>
            <div className={styles["top-content"]}>
                <HeadingsRuta
                    currentHeading={title}
                    routes={[]}
                />
                <h4>{description}</h4>
            </div>
            <div className={styles["top-image"]}>
                <img src={image} alt="Axolotl-Waiting" />
            </div>
        </div>
    )
}

export default PageHeaderDash;