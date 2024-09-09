
// ******************** Images ********************
import clients from '../../assets/img/clients.png';

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
                image={clients}
            />
    </div>
    )
}

export default Contact;