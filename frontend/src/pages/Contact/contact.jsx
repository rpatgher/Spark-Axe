
// ******************** Images ********************
import Contactimg from '../../assets/img/Illustrations/Contact.png';

// **************** Styles ****************
import styles from './Contact.module.css';

// ********************* Components ********************
import PageHeaderDash from '../../components/PageHeaderDash/PageHeaderDash';

const Contact = () => {
    return (
        <div className={styles['contact-wrapper']}>
        <PageHeaderDash 
                title={'Contacto'}
                description={'Mantente en contacto con tus clientes'}
                image={Contactimg}
            />
    </div>
    )
}

export default Contact;