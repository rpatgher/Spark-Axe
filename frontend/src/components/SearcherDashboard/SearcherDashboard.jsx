import { useState, useEffect } from 'react';

// ******************** Styles ********************
import styles from './SearcherDashboard.module.css';

const SearcherDashboard = ({
    setSearch,
    filterList,
    visible,
    setOrder,
    order,
    setOrderType,
    orderType,
    sortedList,
    setFilteredList,
    setSelectAll,
    options,
    listName
}) => {


    const handleSearch = (e) => {
        setSearch(e.target.value);
        filterList(e.target.value, visible);
    };

    const handleOrder = (e) => {
        if(setSelectAll){
            setSelectAll(false);
        }
        setOrder(e.target.value);
        setFilteredList(sortedList);
    };

    const handleOrderType = (e) => {
        if(setSelectAll){
            setSelectAll(false);
        }
        setOrderType(e.target.value);
        setFilteredList(sortedList);
    };

    const setIcon = (type) => {
        switch (type) {
            case 'id':
                return 'fa-solid fa-hashtag';
            case 'name':
                return 'fa-solid fa-a';
            case 'price':
                return 'fa-solid fa-money-check-dollar';
            case 'date':
                return 'fa-solid fa-calendar';
            case 'due-date':
                return 'fa-solid fa-calendar-check';
            case 'total':
                return 'fa-solid fa-dollar-sign';
            case 'stock':
                return 'fa-solid fa-box';
            case 'title':
                return 'fa-solid fa-heading';
            case 'section':
                return 'fa-solid fa-puzzle-piece';
            default:
                return 'fa-sort';
        }
    }



    return (
        <div className={styles.searcher}>
            <input 
                type="text" 
                placeholder={`Buscar ${listName}`} 
                onChange={handleSearch}
            />
            <i className={`fa-solid fa-search ${styles["search-icon"]}`}></i>
            <div className={styles.filterter}>
                <button className={`${styles["btn-filter"]}`}>
                    <strong className={`${styles["Textfilter"]}`}>Ordenar</strong>
                    <i className='fa-solid fa-sort'></i>
                </button>
                <div className={styles.dropdown}>
                    <div className={styles.dropdownContent}>
                        {options.map((option, index) => (
                            <button
                                key={index}
                                className={`${orderType === option.type ? styles.active : ''}`}
                                value={option.type}
                                onClick={handleOrderType}
                            >
                                <i className={setIcon(option.type)}></i>
                                {option.name}
                            </button>    
                        ))}
                        <hr className={styles.divider} />
                        <button
                            className={`${order === 'asc' ? styles.active : ''}`}
                            value={'asc'}
                            onClick={handleOrder}
                        >
                            Ascendente
                        </button>
                        <button
                            className={`${order === 'desc' ? styles.active : ''}`}
                            value={'desc'}
                            onClick={handleOrder}
                        >
                            Descendente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearcherDashboard;
