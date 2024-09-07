


// ********************* Components ********************
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';

// **************** Styles ****************
import styles from './Contact.module.css';

const Contact = () => {
    return (
        <div className={styles['contact-wrapper']}>
        <HeadingsRuta 
            currentHeading="Contacto"
            routes={[]}
        />
        <h4>Mantente en contacto con tus clientes</h4>
    </div>
    )
}

export default Contact;