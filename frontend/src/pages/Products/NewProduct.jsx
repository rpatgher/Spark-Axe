import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ************** Styles *************
import styles from './NewProduct.module.css';

// ************** hooks *************
import useAuth from '../../hooks/useAuth';


const NewProduct = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        color: '',
        image: '',
        image2: ''
    });

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    }

    const handleChangeFile = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.files[0]
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if([product.name, product.description, product.price, product.stock, product.image].includes('')){
            // TODO: Add alert
            console.log('Todos los campos son obligatorios');
            return;
        }
        // Send data to the server
        const data = new FormData();
        data.append('name', product.name);
        data.append('description', product.description);
        data.append('price', product.price);
        data.append('stock', product.stock);
        data.append('color', product.color);
        data.append('image', product.image);
        data.append('image2', product.image2);
        data.append('website_id', auth.websites[0].id);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const response = await clientAxios.post('/api/elements', data, config);
            if(response.status === 200){
                navigate('/dashboard/products');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <h2 className={styles.heading}>Nuevo Producto</h2>
            <div className={styles["go-back"]}>
                <Link to='/dashboard/products'>
                    <i className="fa-solid fa-arrow-left"></i> Regresar
                </Link>
            </div>
            <form 
                className={styles.body}
                onSubmit={handleSubmit}
            >
                <div className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="name">Nombre</label>
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
                        <label htmlFor="description">Descripción</label>
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
                        <label htmlFor="price">Precio</label>
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
                        <label htmlFor="stock">Cantidad</label>
                        <input 
                            type="number" 
                            id="stock" 
                            name="stock" 
                            placeholder={`Cantidad en existencia`}
                            onChange={handleChange}
                            value={product.stock}
                        />
                    </div>
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
                            <div style={{ backgroundColor: product.color || 'transparent'}}></div>
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="image">Imagen</label>
                        <input 
                            type="file" 
                            id="image" 
                            name="image"
                            onChange={handleChangeFile}
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="image2">Imagen 2</label>
                        <input 
                            type="file" 
                            id="image2" 
                            name="image2"
                            onChange={handleChangeFile}
                        />
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.preview}>
                        <p>Vista Previa</p>
                    </div>
                    <button
                        className={styles.button}
                        type='submit'
                    >
                        Crear Producto
                    </button>
                </div>
            </form>
        </>
    )
}

export default NewProduct
