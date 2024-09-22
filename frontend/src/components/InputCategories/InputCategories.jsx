import { useState, useEffect } from 'react';

import clientAxios from '../../config/clientAxios';

// ************** hooks *************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// *************** Styles ***************
import styles from "./InputCategories.module.css";

const InputCategories = ({ 
    categories,
    setCategories
}) => {
    const { auth } = useAuth();
    const { handleAlert } = useApp();
    const [initialCategoriesActive, setInitialCategoriesActive] = useState(false);
    const [initialSubCategoriesActive, setInitialSubCategoriesActive] = useState('');

    const [backupInitialCategories, setBackupInitialCategories] = useState([]);
    const [initialCategories, setInitialCategories] = useState([]);
    const [filteredInitialCategories, setFilteredInitialCategories] = useState([]);

    const [btnAddCategory, setBtnAddCategory] = useState(false);
    const [btnAddSubcategory, setBtnAddSubcategory] = useState('');

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
                const categoriesRes = response.data.map(category => {
                    return {
                        name: category.name,
                        subcategories: category.subcategories.map(subcategory => subcategory.name)
                    }
                });
                setBackupInitialCategories(categoriesRes);
                setInitialCategories(categoriesRes);
            } catch (error) {
                console.log(error);
                handleAlert('Hubo un error al cargar las categorías', true);
            }
        }
        getCategories();
    }, []);

    useEffect(() => {
        setFilteredInitialCategories(initialCategories.filter(category => !categories.map(item => item.category).includes(category.name)));
    }, [initialCategories]);

    const addCategory = (category) => {
        setBtnAddCategory(false);
        if (category !== '' && !categories.map(item => item.category).includes(category)) {
            setCategories([
                ...categories,
                {
                    category: category[0].toUpperCase() + category.slice(1).toLowerCase(),
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
        setBtnAddSubcategory(false);
        const newCategories = categories.map(item => {
            if (item.category === category && !item.subcategories.includes(subcategory)) {
                return {
                    ...item,
                    subcategories: [
                        ...item.subcategories,
                        subcategory[0].toUpperCase() + subcategory.slice(1).toLowerCase()
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
            setBtnAddCategory(true);
            setFilteredInitialCategories(initialCategories.filter(category => category.name.toLowerCase().includes(search.toLowerCase())));
        } else {
            setBtnAddCategory(false);
            setFilteredInitialCategories(initialCategories.filter(category => !categories.map(item => item.category).includes(category.name)));
        }
    }

    const searchInitialSubCategories = (category, e) => {
        const search = e.target.value;
        if (search !== '') {
            setBtnAddSubcategory(category);
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
            setBtnAddSubcategory(false);
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
            <label htmlFor="category">Agrega una nueva categoría</label>
            <div className={styles["input-category"]}>
                <input
                    type="text"
                    id="category"
                    name="category"
                    placeholder="Nueva categoría"
                    onChange={searchInitialCategories}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addCategory(
                                document.getElementById("category").value
                            );
                        }
                    }}
                    onFocus={() => setInitialCategoriesActive(true)}
                    onBlur={() =>
                        setTimeout(() => setInitialCategoriesActive(false), 150)
                    }
                />
                {initialCategoriesActive && (
                    <div className={styles["initial-categories"]}>
                        {filteredInitialCategories.length > 0 &&
                            filteredInitialCategories.map((category, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => addCategory(category.name)}
                                >
                                    {category.name}
                                </button>
                            ))}
                    </div>
                )}
                {btnAddCategory && (
                    <button
                        className={styles["btn-add-category"]}
                        type="button"
                        onClick={() =>
                            addCategory(
                                document.getElementById("category").value
                            )
                        }
                    >
                        <i className="fa-solid fa-plus"></i>
                    </button>
                )}
            </div>
            <div className={styles.categories}>
                {categories.length > 0 &&
                    categories.map((category, index) => (
                        <div key={index} className={styles.category}>
                            <div className={styles["label-delete"]}>
                                <label htmlFor={`${category.category}`}>
                                    {category.category}
                                </label>
                                <button
                                    className={styles["btn-delete-category"]}
                                    type="button"
                                    onClick={() =>
                                        deleteCategory(category.category)
                                    }
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                            <div className={styles["input-subcategories"]}>
                                <div
                                    className={
                                        styles["input-subcategories-btn"]
                                    }
                                >
                                    {btnAddSubcategory ===
                                        category.category && (
                                        <button
                                            className={
                                                styles["btn-add-category"]
                                            }
                                            type="button"
                                            onClick={() =>
                                                addSubcategory(
                                                    category.category,
                                                    document.getElementById(
                                                        `${category.category}`
                                                    ).value
                                                )
                                            }
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </button>
                                    )}
                                    <input
                                        type="text"
                                        id={`${category.category}`}
                                        name={`${category.category}`}
                                        placeholder={`Subcategoría de ${category.category}`}
                                        onFocus={() =>
                                            setInitialSubCategoriesActive(
                                                category.category
                                            )
                                        }
                                        onBlur={() =>
                                            setTimeout(
                                                () =>
                                                    setInitialSubCategoriesActive(
                                                        ""
                                                    ),
                                                200
                                            )
                                        }
                                        onChange={(e) =>
                                            searchInitialSubCategories(
                                                category.category,
                                                e
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addSubcategory(
                                                    category.category,
                                                    document.getElementById(
                                                        `${category.category}`
                                                    ).value
                                                );
                                            }
                                        }}
                                    />
                                    <div
                                        className={
                                            styles["initial-subcategories"]
                                        }
                                        style={{
                                            width: btnAddSubcategory
                                                ? "90%"
                                                : "100%",
                                        }}
                                    >
                                        {initialSubCategoriesActive ===
                                            category.category &&
                                            initialCategories
                                                .find(
                                                    (item) =>
                                                        item.name ===
                                                        category.category
                                                )
                                                ?.subcategories.map(
                                                    (subcategory, index) => {
                                                        if (
                                                            !category.subcategories.includes(
                                                                subcategory
                                                            )
                                                        ) {
                                                            return (
                                                                <button
                                                                    key={index}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        addSubcategory(
                                                                            category.category,
                                                                            subcategory
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        subcategory
                                                                    }
                                                                </button>
                                                            );
                                                        }
                                                    }
                                                )}
                                    </div>
                                </div>
                                <div className={styles.subcategories}>
                                    {category.subcategories.map(
                                        (subcategory, index) => (
                                            <p
                                                key={index}
                                                onDoubleClick={
                                                    deleteSubcategory
                                                }
                                            >
                                                {subcategory}
                                            </p>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default InputCategories;
