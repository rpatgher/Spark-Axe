import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import clientAxios from '../config/clientAxios';

// ************** styles *************
import styles from '../styles/FormProduct.module.css';

// ************** hooks *************
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';

// ************** components *************
import FloatAlert from './Alert/FloatAlert';
import DynamicElement from './DynamicElement';
import InputCategories from './InputCategories/InputCategories';
import RichText from './RichText/RichText';

const FormProduct = ({ initalProduct, setModalDelete }) => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: initalProduct?.name || '',
        description: initalProduct?.description || '',
        price: initalProduct?.price || '',
        stock: initalProduct?.stock || '',
        color: initalProduct?.color || '',
        instructions: initalProduct?.instructions || '',
        fact_sheet: initalProduct?.fact_sheet || '',
        safety_sheet: initalProduct?.safety_sheet || '',
        image: '',
        image2: '',
        main: initalProduct?.main || false,
        published: initalProduct?.published || false
    });
    const [categories, setCategories] = useState([]);

    const [savingProduct, setSavingProduct] = useState(false);
    const [publishingProduct, setPublishingProduct] = useState(false);

    const [configElement, setConfigElement] = useState({});

    useEffect(() => {
        const getElemetConfig = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const { data } = await clientAxios(`/api/config/elements/${auth.websites[0].id}`, config);
                setConfigElement(data.config);
            } catch (error) {
                console.log(error);
            }
        }
        return () => getElemetConfig();
    }, []);


    useEffect(() => {
        setProduct({
            name: initalProduct?.name || '',
            description: initalProduct?.description || '',
            price: initalProduct?.price || '',
            stock: initalProduct?.stock || '',
            color: initalProduct?.color || '',
            instructions: initalProduct?.instructions || '',
            fact_sheet: initalProduct?.fact_sheet || '',
            safety_sheet: initalProduct?.safety_sheet || '',
            image: '',
            image2: '',
            initialImage: initalProduct?.image || '',
            initialImage2: initalProduct?.image2 || '',
            main: initalProduct?.main || false,
            published: initalProduct?.published || false
        });
        setCategories(initalProduct?.categories || []);
    }, [initalProduct]);


    const handleChange = (e) => {
        if(Array.from(e.target.classList).includes(styles["empty-field"])){
            e.target.classList.remove(styles["empty-field"]);
        }
        if(e.target.name === 'main' ){
            setProduct({
                ...product,
                [e.target.name]: e.target.checked
            });
        }else{
            setProduct({
                ...product,
                [e.target.name]: e.target.value
            });
        }
    }

    const handleChangeFile = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.files[0]
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ([product.name, product.description, product.price, product.stock].includes('')) {
            handleAlert("Todos los campos son obligatorios", true);
            const objKeys = Object.keys(product).filter(key => key !== 'initialImage' && key !== 'image2' && key !== 'initialImage2' && key !== 'published' && key !== 'color');
            objKeys.forEach(key => {
                if(product[key] === ''){
                    if(key === 'image'){
                        document.getElementById('image-field').classList.add(styles["empty-field-image"]);
                    }else{
                        document.getElementById(key).classList.add(styles["empty-field"]);
                    }
                }
            });
            return;
        }
        if(configElement.instructions && product.instructions.length > 3000){
            handleAlert('Las instrucciones no pueden ser mayor a 3000 caracteres', true);
            return;
        }
        if (product.image === '' && !initalProduct?.id) {
            handleAlert("La imagen es obligatoria", true);
            // console.log(document.getElementById('image-field'));
            document.getElementById('image-field').classList.add(styles["empty-field-image"]);
            return;
        }
        let msgAlert = '';
        if(e.nativeEvent.submitter.dataset.action === 'publish'){
            product.published = true; 
            setPublishingProduct(true);
            msgAlert = 'Producto publicado exitosamente';
        }else if (e.nativeEvent.submitter.dataset.action === 'unpublish'){
            product.published = false; 
            setPublishingProduct(true);
            msgAlert = 'Producto archivado exitosamente';
        }else{
            setSavingProduct(true);
            msgAlert = 'Producto guardado exitosamente';
        }
        // Send data to the server
        const data = new FormData();
        data.append('name', product.name);
        data.append('description', product.description);
        data.append('price', product.price);
        data.append('stock', product.stock);
        data.append('color', product.color);
        data.append('instructions', product.instructions);
        data.append('fact_sheet', product.fact_sheet);
        data.append('safety_sheet', product.safety_sheet);
        data.append('image', product.image);
        data.append('image2', product.image2);
        data.append('main', product.main);
        data.append('website_id', auth.websites[0].id);
        if(product.published !== undefined && product.published !== null){
            data.append('published', product.published);
        }
        data.append('categories', JSON.stringify(categories));
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            let response;
            //si no tiene id es porque es un nuevo producto entonces se hace un post
            if (!initalProduct && !initalProduct?.id) {
                response = await clientAxios.post('/api/elements', data, config);
            } else {
                response = await clientAxios.put(`/api/elements/${initalProduct.id}`, data, config);
            }
            if (response.status === 200) {
                handleAlert(msgAlert, false);
                navigate('/dashboard/products');
            }
        } catch (error) {
            console.log(error);
            if(error.response.data.msg === 'Invalid Format'){
                handleAlert('Formato de imagen no valido', true);
            }else{
                handleAlert('Hubo un error al mandar el formulario', true);
            }
        } finally {
            setSavingProduct(false);
            setPublishingProduct(false);
        }
    }


    return (
        <>
            {/* {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />} */}
            <form
                className={styles.body}
                onSubmit={handleSubmit}
            >
                <div className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="name" className={styles.required}>Nombre</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder={`Nombre del producto`}
                            onChange={handleChange}
                            value={product.name}
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="description" className={styles.required}>Descripción</label>
                        <textarea
                            id="description"
                            rows="10"
                            name="description"
                            placeholder={`Descripción del producto`}
                            onChange={handleChange}
                            value={product.description}
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="price" className={styles.required}>Precio</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder={`Precio del producto`}
                            onChange={handleChange}
                            value={product.price}
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="stock" className={styles.required}>Cantidad</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            placeholder={`Cantidad en existencia`}
                            onChange={handleChange}
                            value={product.stock}
                        />
                    </div>
                    {configElement.color && (
                        <div className={styles.field}>
                            <label htmlFor="color">Color</label>
                            <div className={styles["input-color"]}>
                                <input
                                    type="color"
                                    id="color"
                                    name="color"
                                    onChange={handleChange}
                                    value={product.color || '#000000'}
                                />
                                <div style={{ backgroundColor: product.color || 'transparent' }}></div>
                            </div>
                        </div>
                    )}
                    <div className={`${configElement.image_hover ? styles["field-two-columns"] : styles.field}`}>
                        <div id="image-field" className={`${styles["field-images"]} ${product.image ? styles["field-images-done"] : ''}`}>
                            <p className={styles.required}>{product.image ? 'Imagen Subida' : 'Sube Primera Imagen'}</p>
                            <div>
                                <label htmlFor="image">
                                    <div>
                                        <svg viewBox="0 0 640 512" height="1em">
                                            <path
                                                d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                                            ></path>
                                        </svg>
                                        <p>{product.image ? 'Subida correcamente' : 'Arrastra la imagen'}</p>
                                        <p>o</p>
                                        <span>{product.image ? 'Cambiar archivo' : 'Sube un archivo'}</span>
                                    </div>
                                    <input type="file" accept='image/*' id="image" name="image" onChange={handleChangeFile} />
                                </label>
                            </div>
                        </div>
                        {configElement.image_hover && (
                            <div className={`${styles["field-images"]} ${product.image2 ? styles["field-images-done"] : ''}`}>
                                <p>{product.image2 ? 'Imagen Subida' : 'Sube segunda Imagen'}</p>
                                <div>
                                    <label htmlFor="image2">
                                        <div>
                                            <svg viewBox="0 0 640 512" height="1em">
                                                <path
                                                    d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                                                ></path>
                                            </svg>
                                            <p>{product.image2 ? 'Subida correcamente' : 'Arrastra la imagen'}</p>
                                            <p>o</p>
                                            <span>{product.image2 ? 'Cambiar archivo' : 'Sube un archivo'}</span>
                                        </div>
                                        <input type="file" accept='image/*' id="image2" name="image2" onChange={handleChangeFile} />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                    {configElement.main && (
                        <div className={`${styles.field} ${styles.main}`}>
                            <input
                                type="checkbox"
                                id="main"
                                name="main"
                                onChange={handleChange}
                                checked={product.main}
                            />
                            <label htmlFor="main">Indica si el producto es principal</label>
                        </div>
                    )}
                    {configElement.instructions && (
                        <RichText 
                            label="Instrucciones"
                            value={product.instructions}
                            setValue={(element) => setProduct({ ...product, instructions: element })}
                            placeholder={`Instrucciones de uso del producto`}
                            limit={3000}
                        />
                    )}
                    <div className={styles.field}>
                        <InputCategories 
                            categories={categories}
                            setCategories={setCategories}
                        />
                    </div>
                    {configElement.fact_sheet && (
                        <div className={styles.field}>
                            <label htmlFor="fact_sheet">Ficha Técnica</label>
                            <input
                                type="text"
                                id="fact_sheet"
                                name="fact_sheet"
                                placeholder={`Enlace de la ficha técnica`}
                                onChange={handleChange}
                                value={product.fact_sheet}
                            />
                        </div>
                    )}
                    {configElement.safety_sheet && (
                        <div className={styles.field}>
                            <label htmlFor="safety_sheet">Hoja de Seguridad</label>
                            <input
                                type="text"
                                id="safety_sheet"
                                name="safety_sheet"
                                placeholder={`Enlace de la hoja de seguridad`}
                                onChange={handleChange}
                                value={product.safety_sheet}
                            />
                        </div>
                    )}
                </div>
                <div className={styles.right}>
                    <div className={styles.preview}>
                        <div className={styles["content-preview"]}>
                            <p>Vista Previa</p>
                            <DynamicElement
                                element={product}
                                userSiteType={auth.websites[0].name}
                            />
                        </div>
                        <p>Estado del producto: <span className={`${product.published ? styles["status-published"] : styles["status-unpublished"] }`}>{product.published ? 'Publicado' : 'Archivado'}</span> </p>
                    </div>
                    <button
                        className={`${styles.button} ${savingProduct ? styles["btn-saving"] : ''} ${initalProduct && !initalProduct?.name ? styles["btn-disabled"] : ''}`}
                        type='submit'
                        data-action='save'
                        disabled={savingProduct || (initalProduct && !initalProduct?.name)}
                    >
                        <i className="fa-solid fa-save"></i>
                        {savingProduct ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                    <div className={styles["delete-publish"]}>
                        <button
                            className={`${styles.button} ${styles["btn-publish"]} ${initalProduct?.published ? styles["btn-unpublish"] : '' } ${publishingProduct ? styles["btn-saving"] : ''} ${initalProduct && !initalProduct?.name ? styles["btn-disabled"] : ''}`}
                            data-action={initalProduct && initalProduct?.published ? 'unpublish' : 'publish'}
                            type='submit'
                            style={{
                                width: !initalProduct ? '100%' : '50%'
                            }}
                            disabled={initalProduct && !initalProduct?.name}
                        >
                            {initalProduct?.published ? (<i className="fa-solid fa-box-archive"></i>) : (<i className="fa-solid fa-upload"></i>)}
                            {initalProduct?.published ? !publishingProduct ? 'Archivar Producto' : 'Archivando...' : !publishingProduct ? 'Publicar Producto' : 'Publicando...'}
                        </button>
                        {initalProduct && (
                            <button
                                className={`${styles.button} ${styles["btn-delete"]} ${!initalProduct.name ? styles["btn-disabled"] : ''}`}
                                type='button'
                                onClick={() => setModalDelete(true)}
                                disabled={!initalProduct.name}
                            >
                                <i className="fa-solid fa-trash"></i>
                                Borrar Producto
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </>
    )
}

export default FormProduct
