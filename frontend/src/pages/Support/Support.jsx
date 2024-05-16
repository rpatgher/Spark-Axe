// **************+ Styles +***************
import { Link } from 'react-router-dom';
import styles from './Support.module.css';
const Support = () => {
    const shareToWhatsApp = (message) => {
        const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const dataArray = ["Item 1", "Item 2", "Item 3"]; // Your array

    const shareArrayToWhatsApp = () => {
        const message = dataArray.join('\n'); // Join array elements with new lines
        shareToWhatsApp(message);
    };

    return(
        <div>
             <div className={styles.enviocontent}>
        <div className={styles.tabcontent1}>
        <Link to='/contact'> <button className={styles.goback}><i className="fa-solid fa-arrow-left"  ></i> Regresar</button></Link>
            <h2 className={styles.heading}>Aplicar</h2>
            
            <p style={{ textAlign: 'center' }} >Muchas gracias por escoger Sparkaxe estamos emocionados por ayudarte en crecer tu negocio</p>
            <p style={{ textAlign: 'center' }} >Si ya tienes cuenta y necesitas soporte  <Link to="/contact"><strong style={{cursor: "pointer"}}> Haz clic aqui</strong></Link></p>
            
           
            <form 
            className={styles.body}
        >
            <div className={styles.field}>
                    <label htmlFor="">Tu nombre</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`Nombre completo`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Nombre de empresa</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`Nombre de empresa`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Correo</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`ejemplo@correo.com`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Numero de telefono</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`+52 55 5555 5555`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Nombre del sitio web (Si no tienes no llenar)</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`dominio.com`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Describe tu sitio o dashboard ideal</label>
                    <textarea 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`
Consejo:

     - Que funciones necesitas para configurar tu tienda
     - Que tipo de productos vendes
     - Como se veria tu sitio web
                        
                        `}
            
                    />
                </div>
                </form>
                <Link to='/dashboard/inventory'> <button className={styles.Buttonguardar}>Enviar</button></Link>
                </div>
                </div>
        </div>
    );
}

export default Support;
