import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ******************** Styles **************************
import styles from './TableDashboard.module.css';


// **************** Images ****************
import lunaAxImage from '../../assets/img/luna_ax.png';

const TableDashboard = ({
    columns,
    listLength,
    children,
    filterList,
    search,
    visibleCount,
    selectedCount,
    handleSelectAll,
    setSelectAll,
    selectAll,
    limit,
    setLimit,
    visible,
    setVisible,
    visibleOptions,
    setModalDelete,
    listName,
    createNew,
    colspan
}) => {
    const [limitIncrement, setLimitIncrement] = useState(10);

    const setColumnHeading = (column) => {
        if (column.prop == 'checkbox') {
            return (
                <input 
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectAll}
                />
            )
        } else if(column.prop == 'actions') {
            return '';
        } else {
            return column.prop;
        }
    }

    const handleVisible = (e) => {
        setVisible(e.target.dataset.value);
        filterList(search, e.target.dataset.value);
    };

    return (
        <>
            <div className={styles["Filtertabs"]}>
                <div className={styles["radio-inputs"]}>
                    <p className={styles.visibles}>Visibles: </p>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "all" ? styles.active : ''}`} data-value="all">Todos</button>
                    {visibleOptions.map((option, index) => (
                        <button 
                            key={index}
                            onClick={handleVisible} 
                            className={`${styles.visibles2} ${visible === option.type ? styles.active : ''}`} 
                            data-value={option.type}
                        >
                            {option.name}
                        </button>    
                    ))}
                </div>
                {selectedCount !== null && selectedCount > 0 && 
                    <div className={styles.selected}>
                        <p className={styles.counter}><strong>Seleccionados:</strong> {selectedCount}</p>
                        {setModalDelete ? (
                            <button 
                                className={styles.delete}
                                type='button'
                                onClick={() => setModalDelete(true)}
                            ><i className="fa-solid fa-trash"></i> Eliminar</button>
                        ) : (
                            <button
                                className={styles["share-seleted"]}
                                type="button"
                            >
                                Compartir <i className="fa-solid fa-share"></i>
                            </button>
                        )}
                    </div>
                }
            </div>
            <div className={styles["table-wrapper"]}>
                <table className={styles["table-dash"]}>
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th 
                                    key={index}
                                    style={{
                                        width: column.width
                                    }}
                                >{setColumnHeading(column)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {listLength === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className={styles.noproducts}>
                                    <div>
                                        <img className={styles["imgAX"]} src={lunaAxImage} alt="Axolotl-Waiting" />
                                    </div>

                                    No hay {listName} aún. {createNew && <Link to={createNew}>Crea uno.</Link>}
                                </td>
                            </tr> 
                        ) : (
                            children
                        )}
                        {listLength > limitIncrement &&
                                <tr className={styles.megarow}>
                                    <td colSpan={colspan[0]}>
                                        <strong>Productos cargados: </strong>{visibleCount}
                                    </td>
                                    <td colSpan={colspan[1]}>
                                        {listLength > limit &&
                                            <button 
                                                className={styles.cargar}
                                                type='button'
                                                onClick={() => {
                                                    if(setSelectAll){
                                                        setSelectAll(false);
                                                    }
                                                    setLimit(limit + limitIncrement);
                                                }}
                                            >Cargar más</button>
                                        }
                                    </td>
                                    <td colSpan={colspan[2]}>
                                        {limit > limitIncrement &&
                                            <button 
                                                className={styles.cargar}
                                                type='button'
                                                onClick={() => setLimit(limit - limitIncrement)}
                                            >Cargar menos</button>
                                        }
                                    </td>
                                </tr>
                            }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default TableDashboard;