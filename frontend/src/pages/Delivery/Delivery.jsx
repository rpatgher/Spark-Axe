
// ******************** Images ********************
import lunaAxImage from '../../assets/img/envio.png';


// ******************** Styles ********************
import styles from './Delivery.module.css';

const Delivery = () => {
    return (
        <div>
            <h1>Envio</h1>
            <div>  <img className={styles["imgA"]} src={lunaAxImage} alt="Axolotl-Waiting" /></div>

        </div>
    )
}

export default Delivery
