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

const FormProduct = ({ initalProduct, setModalDelete, publishProduct }) => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: initalProduct?.name || '',
        description: initalProduct?.description || '',
        price: initalProduct?.price || '',
        stock: initalProduct?.stock || '',
        color: initalProduct?.color || '',
        image: '',
        image2: '',
        published: initalProduct?.published || false
    });
    const [categories, setCategories] = useState([]);

    const [initialCategoriesActive, setInitialCategoriesActive] = useState(false);
    const [backupInitialCategories, setBackupInitialCategories] = useState([]);
    const [initialCategories, setInitialCategories] = useState([]);
    const [filteredInitialCategories, setFilteredInitialCategories] = useState([]);
    const [initialSubCategoriesActive, setInitialSubCategoriesActive] = useState('');

    const [savingProduct, setSavingProduct] = useState(false);

    useEffect(() => {
        setProduct({
            name: initalProduct?.name || '',
            description: initalProduct?.description || '',
            price: initalProduct?.price || '',
            stock: initalProduct?.stock || '',
            color: initalProduct?.color || '',
            image: '',
            image2: '',
        });
        setCategories(initalProduct?.categories || []);
    }, [initalProduct]);

    useEffect(() => {
        const getCategories = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                }
            }
            try {
                const response = await clientAxios.get(`/api/categories/${auth.websites[0].id}`, config);
                const categories = response.data.map(category => {
                    return {
                        name: category.name,
                        subcategories: category.subcategories.map(subcategory => subcategory.name)
                    }
                });
                setBackupInitialCategories(categories);
                setInitialCategories(categories);
                setFilteredInitialCategories(categories);
            } catch (error) {
                console.log(error);
            }
        }
        getCategories();
    }, []);


    const handleChange = (e) => {
        if(Array.from(e.target.classList).includes(styles["empty-field"])){
            e.target.classList.remove(styles["empty-field"]);
        }
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
        if ([product.name, product.description, product.price, product.stock].includes('')) {
            handleAlert("Todos los campos son obligatorios", true);
            const objKeys = Object.keys(product).filter(key => key !== 'image2' && key !== 'color');
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
        
        if (product.image === '' && initalProduct && !initalProduct.id) {
            console.log('La imagen es obligatoria');
        }
        setSavingProduct(true);
        const token = localStorage.getItem('token');
        const configCat = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        let categories_id = [];
        try {
            const { data: dataCategories } = await clientAxios.post('/api/categories', { website_id: auth.websites[0].id, categories }, configCat);
            categories_id = dataCategories.subcategoriesIds;
        } catch (error) {
            console.log(error);
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
        data.append('categories_id', JSON.stringify(categories_id));
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
                handleAlert("Producto guardado exitosamente", false);
                navigate('/dashboard/products');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSavingProduct(false);
        }
    }

    const addCategory = (category) => {
        if (category !== '' && !categories.map(item => item.category).includes(category)) {
            setCategories([
                ...categories,
                {
                    category,
                    subcategories: []
                }
            ]);
            document.getElementById('category').value = '';
        }
        setFilteredInitialCategories(initialCategories.filter(item => item.name !== category).filter(item => !categories.map(item => item.category).includes(item.name)));
    }

    const deleteCategory = (category) => {
        const newCategories = categories.filter(item => item.category !== category);
        setCategories(newCategories);
        setFilteredInitialCategories([
            ...filteredInitialCategories,
            {
                name: category,
                subcategories: initialCategories.find(item => item.name === category).subcategories
            }
        ]);
    }

    const addSubcategory = (category, subcategory) => {
        const newCategories = categories.map(item => {
            if (item.category === category && !item.subcategories.includes(subcategory)) {
                return {
                    ...item,
                    subcategories: [
                        ...item.subcategories,
                        subcategory
                    ]
                }
            }
            return item;
        });
        setCategories(newCategories);
        document.getElementById(`${category}`).value = '';
        setFilteredInitialCategories(filteredInitialCategories.map(item => {
            const newSubcategories = item.subcategories.filter(sub => sub !== subcategory);
            if (item.name === category) {
                return {
                    name: category,
                    subcategories: newSubcategories
                }
            }
            return item;
        }));
        setInitialCategories(initialCategories.map(item => {
            if (item.name === category) {
                return {
                    ...item,
                    subcategories: backupInitialCategories.find(cat => cat.name === category).subcategories
                }
            }
            return item;
        }));
    }

    const deleteSubcategory = (e) => {
        const subcategory = e.target.textContent;
        const category = e.target.parentElement.parentElement.parentElement.children[0].textContent;
        const newCategories = categories.map(item => {
            if (item.category === category) {
                return {
                    ...item,
                    subcategories: item.subcategories.filter(sub => sub !== subcategory)
                }
            }
            return item;
        });
        setCategories(newCategories);
    }

    const searchInitialCategories = (e) => {
        const search = e.target.value;
        if (search !== '') {
            setFilteredInitialCategories(initialCategories.filter(category => category.name.toLowerCase().includes(search.toLowerCase())));
        } else {
            setFilteredInitialCategories(initialCategories.filter(category => !categories.map(item => item.category).includes(category.name)));
        }
    }

    const searchInitialSubCategories = (category, e) => {
        const search = e.target.value;
        if (search !== '') {
            setInitialCategories(initialCategories.map(item => {
                if (item.name === category) {
                    return {
                        ...item,
                        subcategories: item.subcategories.filter(subcategory => subcategory.toLowerCase().includes(search.toLowerCase()))
                    }
                }
                return item;
            }));
        } else {
            setInitialCategories(backupInitialCategories.map(item => {
                if (item.name === category) {
                    return {
                        ...item,
                        subcategories: item.subcategories.filter(subcategory => !categories.find(cat => cat.category === category).subcategories.includes(subcategory))
                    }
                }
                return item;
            }));
        }
    }
    return (
        <>
            {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />}
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
                    <div className={styles["field-two-columns"]}>
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
                                    <input type="file" id="image" name="image" onChange={handleChangeFile} />
                                </label>
                            </div>
                        </div>
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
                                    <input type="file" id="image2" name="image2" onChange={handleChangeFile} />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="category">Agrega una nueva categoría</label>
                        <div className={styles["input-category"]}>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                placeholder='Nueva categoría'
                                onChange={searchInitialCategories}
                                onFocus={() => setInitialCategoriesActive(true)}
                                onBlur={() => setTimeout(() => setInitialCategoriesActive(false), 150)}
                            />
                            {initialCategoriesActive && (
                                <div className={styles["initial-categories"]}>
                                    {
                                        filteredInitialCategories.length > 0 && filteredInitialCategories.map((category, index) => (
                                            <button
                                                key={index}
                                                type='button'
                                                onClick={() => addCategory(category.name)}
                                            >{category.name}</button>
                                        ))
                                    }
                                </div>
                            )}
                            <button
                                className={styles["btn-add-category"]}
                                type='button'
                                onClick={() => addCategory(document.getElementById('category').value)}
                            >
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <div className={styles.categories}>
                            {
                                categories.length > 0 && categories.map((category, index) => (
                                    <div key={index} className={styles.category}>
                                        <div className={styles["label-delete"]}>
                                            <label htmlFor={`${category.category}`}>{category.category}</label>
                                            <button
                                                className={styles["btn-delete-category"]}
                                                type='button'
                                                onClick={() => deleteCategory(category.category)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                        <div className={styles["input-subcategories"]}>
                                            <div className={styles["input-subcategories-btn"]}>
                                                <button
                                                    className={styles["btn-add-category"]}
                                                    type='button'
                                                    onClick={() => addSubcategory(category.category, document.getElementById(`${category.category}`).value)}
                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                </button>
                                                <input
                                                    type="text"
                                                    id={`${category.category}`}
                                                    name={`${category.category}`}
                                                    placeholder={`Subcategoría de ${category.category}`}
                                                    onFocus={() => setInitialSubCategoriesActive(category.category)}
                                                    onBlur={() => setTimeout(() => setInitialSubCategoriesActive(''), 200)}
                                                    onChange={(e) => searchInitialSubCategories(category.category, e)}
                                                />
                                                <div className={styles["initial-subcategories"]}>
                                                    {
                                                        initialSubCategoriesActive === category.category && initialCategories.find(item => item.name === category.category)?.subcategories.map((subcategory, index) => {
                                                            if (!category.subcategories.includes(subcategory)) {
                                                                return (
                                                                    <button
                                                                        key={index}
                                                                        type='button'
                                                                        onClick={() => addSubcategory(category.category, subcategory)}
                                                                    >{subcategory}</button>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className={styles.subcategories}>
                                                {
                                                    category.subcategories.map((subcategory, index) => (
                                                        <p key={index} onDoubleClick={deleteSubcategory}>{subcategory}</p>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.preview}>
                        <p>Vista Previa</p>
                    </div>
                    <button
                        className={`${styles.button} ${savingProduct ? styles["btn-saving"] : ''}`}
                        type='submit'
                        disabled={savingProduct}
                    >
                        {savingProduct ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                    {initalProduct && (
                        <div className={styles["delete-publish"]}>
                            <button
                                className={`${styles.button} ${styles["btn-publish"]} ${initalProduct.published ? styles["btn-unpublish"] : ''}`}
                                type='button'
                                onClick={publishProduct}
                            >
                                {initalProduct.published ? 'Archivar Producto' : 'Publicar Producto'}
                            </button>
                            <button
                                className={`${styles.button} ${styles["btn-delete"]}`}
                                type='button'
                                onClick={() => setModalDelete(true)}
                            >
                                Borrar Producto
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </>
    )
}

export default FormProduct
