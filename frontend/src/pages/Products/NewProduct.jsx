
// ************** Styles *************
import styles from './NewProduct.module.css';

const NewProduct = () => {
    return (
        <>
            <h2 className={styles.heading}>Nuevo Producto</h2>
            <div className={styles.body}>
                <form className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="name">Nombre</label>
                        <input type="text" id="name" name="name" placeholder={`Nombre del producto`}/>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="description">Descripción</label>
                        <textarea id="description" rows="10" name="description" placeholder={`Descripción del producto`}></textarea>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="price">Precio</label>
                        <input type="number" id="price" name="price" placeholder={`Precio del producto`}/>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="stock">Cantidad</label>
                        <input type="number" id="stock" name="stock" placeholder={`Cantidad en existencia`}/>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="color">Color</label>
                        <input type="number" id="color" name="color" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="image">Imagen</label>
                        <input type="file" id="image" name="image" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="image2">Imagen 2</label>
                        <input type="file" id="image2" name="image2" />
                    </div>
                </form>
                <div className={styles.right}>
                    <div className={styles.preview}>
                        <p>Vista Previa</p>
                    </div>
                    <button
                        className={styles.button}
                    >
                        Crear Producto
                    </button>
                </div>
            </div>
        </>
    )
}

export default NewProduct
