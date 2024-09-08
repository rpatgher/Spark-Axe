import { Fragment, useEffect, useState } from 'react';

import clientAxios from '../../config/clientAxios';

import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';


// ****************** Styles ******************
import styles from './ModalEditCategories.module.css'

// ****************** Hooks ******************
import useApp from '../../hooks/useApp';
import useAuth from '../../hooks/useAuth';

// ****************** Components ******************
import SortableItem from './SortableItem';


const ModalEditCategories = ({closeModal, categories, setCategories}) => {
    const { alert, handleAlert } = useApp();
    const { auth } = useAuth();

    const [show, setShow] = useState(false);

    
    const [subcategories, setSubcategories] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null);

    const [editCategory, setEditCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSubcategory, setEditingSubcategory] = useState(null);

    const [deletingCategory, setDeletingCategory] = useState(null);


    const [loading, setLoading] = useState(false);

    const [newCategory, setNewCategory] = useState(null);
    const [newCategoryActive, setNewCategoryActive] = useState(false);

    const [newSubcategory, setNewSubcategory] = useState(null);
    const [newSubcategoryActive, setNewSubcategoryActive] = useState(false);

    useEffect(() => {
        const showModal = () => {
            setTimeout(() => {
                setShow(true);
            }, 300);
        }
        return () => showModal();
    }, []);

    const unshowModal = () => {
        setShow(false);
        setTimeout(() => {
            closeModal();
        }, 300);
    }


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
                    if(category.name === currentCategory.name){
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
                    if(category.name === currentCategory.name){
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
            setEditCategory(false);
            document.body.style.cursor = "default";
        }
    }


    const newCategoryFunc = async (e) => {
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
            const response = await clientAxios.post('/api/categories/one', {category: newCategory, website_id: auth.websites[0].id}, config);
            if(response.status === 200 || response.status === 201){
                handleAlert('Categoría creada correctamente', false);
                setCategories([
                    ...categories,
                    {
                        ...response.data[0],
                        subcategories: []
                    },
                ]);
            }
        } catch (error) {
            console.log(error);
            handleAlert('Hubo un error al crear la categoría', true);
        } finally {
            setLoading(false);
            setNewCategory(null);
            setNewCategoryActive(false);
            document.body.style.cursor = "default";
        }
    }

    const newSubcategoryFunc = async (e) => {
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
            const response = await clientAxios.post('/api/categories/sub/one', {subcategory: newSubcategory, category_id: currentCategory.id }, config);
            if(response.status === 200 || response.status === 201){
                handleAlert('Subcategoría creada correctamente', false);
                setSubcategories([
                    ...subcategories,
                    {
                        ...response.data[0],
                        category_id: currentCategory.id
                    }
                ]);
                setCategories(categories.map(category => {
                    if(category.name === currentCategory.name){
                        return {
                            ...category,
                            subcategories: [
                                ...category.subcategories,
                                response.data[0]
                            ]
                        }
                    }
                    return category;
                }));
            }
        } catch (error) {
            console.log(error);
            handleAlert('Hubo un error al crear la subcategoría', true);
        } finally {
            setLoading(false);
            setNewSubcategory(null);
            setNewSubcategoryActive(false);
            document.body.style.cursor = "default";
        }

    }

    const handleDragEndSubcategories = async ({active, over}) => {
        if (active?.id !== over?.id) {
            const activeIndex = subcategories.findIndex(subcategory => subcategory.id === active.id);
            const overIndex = subcategories.findIndex(subcategory => subcategory.id === over.id);

            // console.log(subcategories);
            const oldSubcategories = [...subcategories];

            const newSubcategories = [...subcategories];
            newSubcategories.splice(activeIndex, 1);
            newSubcategories.splice(overIndex, 0, subcategories[activeIndex]);

            newSubcategories.map((subcategory, index) => {
                subcategory.index = index + 1;
            });

            // console.log(newSubcategories);

            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                setSubcategories(newSubcategories);
                setCategories(categories.map(category => {
                    if(category.name === currentCategory.name){
                        return {
                            ...category,
                            subcategories: newSubcategories
                        }
                    }
                    return category;
                }));
                setLoading(true);
                document.body.style.cursor = "wait";
                const response = await clientAxios.put(`/api/categories/index/sub`, {subcategories: newSubcategories}, config);
                if(response.status === 200 || response.status === 201){
                    handleAlert('Subcategorías reordenadas correctamente', false);
                }
            } catch (error) {
                console.log(error);
                handleAlert('Hubo un error al reordenar las subcategorías', true);
                setSubcategories(oldSubcategories);
                setCategories(categories.map(category => {
                    if(category.name === currentCategory.name){
                        return {
                            ...category,
                            subcategories: oldSubcategories
                        }
                    }
                    return category;
                }));
            }
            finally {
                setLoading(false);
                document.body.style.cursor = "default";
            }
        }
    }

    const handleDragEndCategories = async ({active, over}) => {
        if (active?.id !== over?.id) {
            const activeIndex = categories.findIndex(category => category.id === active.id);
            const overIndex = categories.findIndex(category => category.id === over.id);

            const oldCategories = [...categories];

            const newCategories = [...categories];
            newCategories.splice(activeIndex, 1);
            newCategories.splice(overIndex, 0, categories[activeIndex]);

            newCategories.map((category, index) => {
                category.index = index + 1;
            });

            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                setCategories(newCategories);
                setLoading(true);
                document.body.style.cursor = "wait";
                const response = await clientAxios.put(`/api/categories/index`, {categories: newCategories}, config);
                if(response.status === 200 || response.status === 201){
                    handleAlert('Categorías reordenadas correctamente', false);
                }
            } catch (error) {
                console.log(error);
                handleAlert('Hubo un error al reordenar las categorías', true);
                setCategories(oldCategories);
            } finally {
                setLoading(false);
                document.body.style.cursor = "default";
            }
        }
    }


    return (
        <div className={`${styles["modal-wrapper"]}`}>
            <div className={`${styles["modal"]} ${show ? styles.show : ''}`}>
                <button 
                    className={styles["close-modal"]}
                    onClick={unshowModal}
                >
                    <i className="fa-solid fa-times"></i>
                </button>
                {subcategories !== null ? (
                    <Fragment>
                        <div className={styles.header}>
                            <h2>
                                {" "}
                                <span
                                    className={styles.backhead}
                                    onClick={() => {
                                        setSubcategories(null);
                                        setCurrentCategory(null);
                                        setEditingSubcategory(null);
                                        setEditCategory(false);
                                    }}
                                >
                                    Categorías
                                </span>{" "}
                                / {currentCategory.name}
                            </h2>
                            {newSubcategoryActive === false && (
                                <button
                                    className={styles.create}
                                    style={{
                                        opacity: loading ? 0.5 : 1,
                                        cursor: loading ? "wait" : "pointer"
                                    }}
                                    disabled={loading}
                                    onClick={() => {
                                        setNewSubcategoryActive(true);
                                    }}
                                >
                                    <i className="fa-solid fa-plus"></i> Crear
                                </button>
                            )}
                        </div>
                        <hr></hr>
                        <div
                            className={styles.subcategories}
                        >
                            {subcategories.length === 0 && !newSubcategoryActive ? (
                                <p className={styles.nocategories}>No hay subcategorías</p>
                            ) : (
                                <DndContext
                                    onDragEnd={handleDragEndSubcategories}
                                    modifiers={[restrictToVerticalAxis, restrictToWindowEdges, restrictToFirstScrollableAncestor]}
                                >
                                    <SortableContext 
                                        items={subcategories}
                                    >
                                        {subcategories.map(subcategory => (
                                            <SortableItem
                                                key={subcategory.id}
                                                id={subcategory.id}
                                                handleActive={true}
                                            >
                                                <div 
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
                                                                    className={styles.save}
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
                                                                    className={styles.cancel}
                                                                >
                                                                    <i className="fa-solid fa-times"></i>
                                                                </button>
                                                            </>
                                                        ) : editingSubcategory === null ? !newSubcategoryActive && (
                                                            <button
                                                                onClick={() => {
                                                                    setEditingSubcategory(subcategory);
                                                                }}
                                                                style={{
                                                                    opacity: loading ? 0.5 : 1,
                                                                    cursor: loading ? "wait" : "pointer"
                                                                }}
                                                                disabled={loading}
                                                                className={styles.editBtn}
                                                            >
                                                                <i className="fa-solid fa-pencil"></i> Editar
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
                                                                className={styles.deleteCat}
                                                            >
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </SortableItem>
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            )}
                            {newSubcategoryActive &&
                                <div className={styles.newSubcat}>
                                    <input
                                        type="text"
                                        value={newSubcategory || ''}
                                        onChange={(e) => {
                                            setNewSubcategory(e.target.value);
                                        }}
                                    />
                                    <div className={styles.buttonsNewSubcat}>
                                        <button
                                            onClick={newSubcategoryFunc}
                                            style={{
                                                opacity: loading ? 0.5 : 1,
                                                cursor: loading ? "wait" : "pointer"
                                            }}
                                            disabled={loading}
                                            className={styles.save}
                                        >
                                            <i className="fa-solid fa-floppy-disk"></i>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setNewSubcategory(null);
                                                setNewSubcategoryActive(false);
                                            }}
                                            style={{
                                                opacity: loading ? 0.5 : 1,
                                                cursor: loading ? "wait" : "pointer"
                                            }}
                                            disabled={loading}
                                            className={styles.cancel}
                                        >
                                            <i className="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                    </Fragment>
                ) : (
                    <Fragment>
                        <div className={styles.header}>
                            <h2>Categorías</h2>
                            {newCategoryActive === false && (
                                <div className={styles.buttonsCat}>
                                    {editCategory === false && (
                                        <button
                                            className={styles.create}
                                            onClick={() => {
                                                setNewCategoryActive(true);
                                            }}
                                        >
                                            <i className="fa-solid fa-plus"></i> Crear
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setEditCategory(!editCategory);
                                            setEditingCategory(null);
                                        }}
                                        style={{
                                            opacity: loading ? 0.5 : 1,
                                            cursor: loading ? "wait" : "pointer"
                                        }}
                                        disabled={loading}
                                        className={`${editCategory ? styles.cancel : styles.edit}`}
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
                            )}
                        </div>
                        <hr></hr>
                        <div
                            className={styles.categories}
                        >
                            {categories.length === 0 && !newCategoryActive ? (
                                <p className={styles.nocategories}>No hay categorías</p>
                            ) : (
                                <DndContext
                                    onDragEnd={handleDragEndCategories}
                                    modifiers={[restrictToVerticalAxis, restrictToWindowEdges, restrictToFirstScrollableAncestor]}
                                >
                                    <SortableContext 
                                        items={categories}
                                    >
                                        {categories.map(category => (
                                            <SortableItem
                                                key={category.id}
                                                id={category.id}
                                                handleActive={editCategory}
                                            >
                                                <div 
                                                    key={category.id}
                                                    className={`${styles.category} ${!editCategory ? styles["category-hover"] : ''} ${editingCategory !== null ? styles['editing-category'] : ''}
                                                    `}
                                                    onClick={() => {
                                                        if(!editCategory && newCategoryActive === false){
                                                            setSubcategories(category.subcategories)
                                                            setCurrentCategory(category)
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
                                                                setDeletingCategory(category);
                                                                deleteCategoryFunc(category.id);
                                                            }}
                                                            className={styles.deleteCat}
                                                        >
                                                            <i className="fa-solid fa-trash"></i> {editingCategory === null ? loading && deletingCategory?.id === category.id ? 'Eliminando...' : 'Eliminar' : ''}
                                                        </button>
                                                    ) : newCategoryActive === false && (
                                                        <i className="fa-solid fa-chevron-right"></i>
                                                    )}
                                                </div>
                                            </SortableItem>
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            )}
                            {newCategoryActive && 
                                <div className={styles.newCat}>
                                    <input
                                        type="text"
                                        value={newCategory || ''}
                                        onChange={(e) => {
                                            setNewCategory(e.target.value);
                                        }}
                                    />
                                    <div className={styles.buttonsNewCat}>
                                        <button
                                            onClick={newCategoryFunc}
                                            style={{
                                                opacity: loading ? 0.5 : 1,
                                                cursor: loading ? "wait" : "pointer"
                                            }}
                                            disabled={loading}
                                            className={styles.save}
                                        >
                                            <i className="fa-solid fa-floppy-disk"></i>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setNewCategory(null);
                                                setNewCategoryActive(false);
                                            }}
                                            style={{
                                                opacity: loading ? 0.5 : 1,
                                                cursor: loading ? "wait" : "pointer"
                                            }}
                                            disabled={loading}
                                            className={styles.cancel}
                                        >
                                            <i className="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default ModalEditCategories
