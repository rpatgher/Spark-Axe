

// ********************* Styles ********************
import styles from './NewAd.module.css';

const NewAd = () => {
    return (
        <div>
            <h1>Anuncios</h1>
            <h4>Enseña tus anuncios</h4>
            <Link to='/dashboard/products/new'>
                        <button
                            className={styles["btn-new-product"]}
                        >
                            <i className="fa-solid fa-plus"></i>
                            <p>Agregar Producto</p>
                        </button>
        </div>
    )
}

export default NewAd