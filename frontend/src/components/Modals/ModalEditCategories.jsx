import { Fragment, useState } from 'react';

import clientAxios from '../../config/clientAxios';


// ****************** Styles ******************
import styles from './ModalEditCategories.module.css'


// ****************** Hooks ******************
import useApp from '../../hooks/useApp';

const ModalEditCategories = ({closeModal, categories, setCategories}) => {
    const { alert, handleAlert } = useApp();
    const [subcategories, setSubcategories] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null);

    const [editCategory, setEditCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSubcategory, setEditingSubcategory] = useState(null);


    const [loading, setLoading] = useState(false);


    const handleEditSubcategory = (e) => {
        setEditingSubcategory({
            ...editingSubcategory,
            name: e.target.value
        });
    }

    const editSubcategoryFunc = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        try {
            setLoading(true);
            document.body.style.cursor = "wait";
            const response = await clientAxios.put(`/api/categories/sub/${editingSubcategory.id}`, {name: editingSubcategory.name}, config);
            if(response.status === 200 || response.status === 201){
                handleAlert('Subcategoría editada correctamente', false);
                setSubcategories(subcategories.map(subcategory => {
                    if(subcategory.id === editingSubcategory.id){
                        return {
                            ...subcategory,
                            name: editingSubcategory.name
                        }
                    }
                    return subcategory;
                }));
                setCategories(categories.map(category => {
                    if(category.name === currentCategory){
                        return {
                            ...category,
                            subcategories: category.subcategories.map(subcategory => {
                                if(subcategory.id === editingSubcategory.id){
                                    return {
                                        ...subcategory,
                                        name: editingSubcategory.name
                                    }
                                }
                                return subcategory;
                            })
                        }
                    }
                    return category;
                }));
            }
        } catch (error) {
            console.log(error);
            handleAlert('Hubo un error al editar la subcategoría', true);
        } finally {
            setLoading(false);
            setEditingSubcategory(null);
            document.body.style.cursor = "default";
        }
    };

    const deleteSubcategory = async (id) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        try {
            setLoading(true);
            document.body.style.cursor = "wait";
            const response = await clientAxios.delete(`/api/categories/sub/${id}`, config);
            if(response.status === 200 || response.status === 201){
                handleAlert('Subcategoría eliminada correctamente', false);
                setSubcategories(subcategories.filter(subcategory => subcategory.id !== id));
                setCategories(categories.map(category => {
                    if(category.name === currentCategory){
                        return {
                            ...category,
                            subcategories: category.subcategories.filter(subcategory => subcategory.id !== id)
                        }
                    }
                    return category;
                }));
            }
        } catch (error) {
            console.log(error);
            if(error.response.data.msg === 'Subcategory cannot be deleted because it is being used'){
                handleAlert('La subcategoría no puede ser eliminada porque está siendo utilizada', true);
            } else {
                handleAlert('Hubo un error al eliminar la subcategoría', true);
            }
        } finally {
            setLoading(false);
            setEditingSubcategory(null);
            document.body.style.cursor = "default";
        }
    }


    const editCategoryFunc = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        try {
            setLoading(true);
            document.body.style.cursor = "wait";
            const response = await clientAxios.put(`/api/categories/${editingCategory.id}`, {name: editingCategory.name}, config);
            if(response.status === 200 || response.status === 201){
                handleAlert('Categoría editada correctamente', false);
                setCategories(categories.map(category => {
                    if(category.id === editingCategory.id){
                        return {
                            ...category,
                            name: editingCategory.name
                        }
                    }
                    return category;
                }));
            }
        } catch (error) {
            console.log(error);
            handleAlert('Hubo un error al editar la categoría', true);
        } finally {
            setLoading(false);
            setEditingCategory(null);
            document.body.style.cursor = "default";
        }
    }

    const deleteCategoryFunc = async (id) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        try {
            setLoading(true);
            document.body.style.cursor = "wait";
            const response = await clientAxios.delete(`/api/categories/${id}`, config);
            if(response.status === 200 || response.status === 201){
                handleAlert('Categoría eliminada correctamente', false);
                setCategories(categories.filter(category => category.id !== id));
            }
        } catch (error) {
            console.log(error);
            if(error.response.data.msg === 'Category cannot be deleted because it is being used'){
                handleAlert('La categoría no puede ser eliminada porque está siendo utilizada', true);
            } else {
                handleAlert('Hubo un error al eliminar la categoría', true);
            }
        } finally {
            setLoading(false);
            setEditingCategory(null);
            document.body.style.cursor = "default";
        }
    }




    return (
        <div className={styles["modal-wrapper"]}>
            <div className={styles["modal"]}>
                <button 
                    className={styles["close-modal"]}
                    onClick={closeModal}
                >
                    <i className="fa-solid fa-times"></i>
                </button>
                {subcategories !== null ? (
                    <Fragment>
                        <h2>
                            {" "}
                            <span
                                className={styles.backhead}
                                onClick={() => {
                                    setSubcategories(null);
                                    setCurrentCategory(null);
                                }}
                            >
                                Categorías
                            </span>{" "}
                            / {currentCategory}
                        </h2>
                        <hr></hr>
                        <div
                            className={styles.subcategories}
                        >
                            {subcategories.length === 0 ? (
                                <p className={styles.nocategories}>No hay subcategorías</p>
                            ) : subcategories.map(subcategory => (
                                <div 
                                    key={subcategory.id}
                                    className={styles.subcategory}
                                >
                                    {editingSubcategory !== null && editingSubcategory.id === subcategory.id ? (
                                        <input
                                            type="text"
                                            value={editingSubcategory.name}
                                            onChange={handleEditSubcategory}
                                        />
                                    ) : (
                                        <h3>{subcategory.name}</h3>
                                    )}
                                    <div className={styles.buttons}>
                                        {editingSubcategory !== null && editingSubcategory.id === subcategory.id ? (
                                            <>
                                                <button
                                                    onClick={editSubcategoryFunc}
                                                    style={{
                                                        opacity: loading ? 0.5 : 1,
                                                        cursor: loading ? "wait" : "pointer"
                                                    }}
                                                    disabled={loading}
                                                >
                                                    <i className="fa-solid fa-floppy-disk"></i>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingSubcategory(null);
                                                    }}
                                                    style={{
                                                        opacity: loading ? 0.5 : 1,
                                                        cursor: loading ? "wait" : "pointer"
                                                    }}
                                                    disabled={loading}
                                                >
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            </>
                                        ) : editingSubcategory === null ? (
                                                <button
                                                    onClick={() => {
                                                        setEditingSubcategory(subcategory);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-pencil"></i>
                                                </button>
                                            ) : null}
                                        {editingSubcategory !== null && editingSubcategory.id === subcategory.id ? (
                                            <button
                                                style={{
                                                    opacity: loading ? 0.5 : 1,
                                                    cursor: loading ? "wait" : "pointer"
                                                }}
                                                disabled={loading}
                                                onClick={() => {
                                                    deleteSubcategory(subcategory.id);
                                                }}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Fragment>
                ) : (
                    <Fragment>
                        <div className={styles.header}>
                            <h2>Categorías</h2>
                            <button
                                onClick={() => {
                                    setEditCategory(!editCategory);
                                }}
                            >
                                
                                {editCategory ? (
                                    <>
                                        <i className="fa-solid fa-times"></i> Cancelar
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-pencil"></i> Editar
                                    </>
                                )}
                            </button>
                        </div>
                        <hr></hr>
                        <div
                            className={styles.categories}
                        >
                            {categories.length === 0 ? (
                                <p className={styles.nocategories}>No hay categorías</p>
                            ) : categories.map(category => (
                                <div 
                                    key={category.id}
                                    className={`${styles.category} ${!editCategory ? styles["category-hover"] : ''}`}
                                    onClick={() => {
                                        if(!editCategory){
                                            setSubcategories(category.subcategories)
                                            setCurrentCategory(category.name)
                                        }
                                    }}
                                >
                                    <div className={styles.title}>
                                        {editingCategory !== null && editingCategory.id === category.id ? (
                                            <input
                                                type="text"
                                                name='name'
                                                value={editingCategory.name}
                                                onChange={(e) => {
                                                    setEditingCategory({
                                                        ...editingCategory,
                                                        name: e.target.value
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <h3>{category.name}</h3>
                                        )}
                                        {editCategory && editingCategory ===  null ? (
                                            <button
                                                className={styles.rename}
                                                onClick={() => {
                                                    setEditingCategory(category);
                                                }}
                                            >
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </button>
                                        ) : (
                                            null
                                        )}
                                        {editingCategory !== null && editingCategory.id === category.id ? (
                                            <div className={styles.actions}>
                                                <button
                                                    style={{
                                                        opacity: loading ? 0.5 : 1,
                                                        cursor: loading ? "wait" : "pointer"
                                                    }}
                                                    disabled={loading}
                                                    onClick={editCategoryFunc}
                                                    className={styles.save}
                                                >
                                                    <i className="fa-solid fa-floppy-disk"></i>
                                                </button>
                                                <button
                                                    style={{
                                                        opacity: loading ? 0.5 : 1,
                                                        cursor: loading ? "wait" : "pointer"
                                                    }}
                                                    disabled={loading}
                                                    onClick={() => {
                                                        setEditingCategory(null);
                                                    }}
                                                    className={styles.cancel}
                                                >
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    {editCategory ? (
                                        <button
                                            style={{
                                                opacity: loading ? 0.5 : 1,
                                                cursor: loading ? "wait" : "pointer"
                                            }}
                                            disabled={loading}
                                            onClick={() => {
                                                deleteCategoryFunc(category.id);   
                                            }}
                                            className={styles.deleteCat}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    ) : (
                                        <i className="fa-solid fa-chevron-right"></i>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default ModalEditCategories
