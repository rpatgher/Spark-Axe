import { Fragment, useEffect, useState } from "react";

import clientAxios from "../../config/clientAxios";

// ******************** Styles ********************
import styles from "./Orders.module.css";

// ******************** Hooks ********************
import useAuth from "../../hooks/useAuth";
import useApp from "../../hooks/useApp";


// ******************** Images ********************
import Ordersimg from '../../assets/img/Illustrations/Pedidos.png';

// ******************** Helpers ********************
import formatToMoney from "../../helpers/formatMoney";
import formatDate from "../../helpers/formatDate";
import zeroFill from "../../helpers/zeroFill";

// **************** Images ****************
import SearcherDashboard from "../../components/SearcherDashboard/SearcherDashboard";
import TableDashboard from "../../components/TableDashboard/TableDashboard";
import PageHeaderDash from '../../components/PageHeaderDash/PageHeaderDash';

const Orders = () => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState("asc"); // For sorting the orders
    const [orderType, setOrderType] = useState("id");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [visible, setVisible] = useState("all");
    const [search, setSearch] = useState("");

    const [visibleCount, setVisibleCount] = useState(0);
    const [selectedCount, setSelectedCount] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        const count = filteredOrders.filter(
            (item) => item.selected && item.visible
        ).length;
        const countVisible = filteredOrders.filter(
            (item) => item.visible
        ).length;
        setSelectedCount(count);
        setVisibleCount(countVisible);
    }, [filteredOrders, limit]);

    const sortedOrders = orders.sort((a, b) => {
        if (order === "asc") {
            if (orderType === "id") {
                return a.index - b.index;
            }
            if (orderType === "date") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
            if (orderType === "due-date") {
                return new Date(a.delivery_date) - new Date(b.delivery_date);
            }
            if (orderType === "total") {
                return a.total - b.total;
            }
        }
        if (order === "desc") {
            if (orderType === "id") {
                return b.index - a.index;
            }
            if (orderType === "date") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            if (orderType === "due-date") {
                return new Date(b.delivery_date) - new Date(a.delivery_date);
            }
            if (orderType === "total") {
                return b.total - a.total;
            }
        }
    });

    useEffect(() => {
        // Get orders from the server
        const getOrders = async () => {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            try {
                const { data } = await clientAxios.get(
                    `/api/orders/${auth.websites[0].id}`,
                    config
                );
                setOrders(data);
                setFilteredOrders(data);
            } catch (error) {
                console.log(error);
                handleAlert("Error al obtener los pedidos", true);
            }
        };
        return () => getOrders();
    }, []);

    const [details, setDetails] = useState("");

    const toggleDetails = (orderId) => {
        setDetails(details === orderId ? "" : orderId);
    };

    const filterOrders = (search, visible) => {
        setFilteredOrders(
            filteredOrders.map((order) => (order.selected = false))
        );
        const visibleFiltered = orders.filter((order) => {
            if (visible === "all") {
                return order;
            }
            if (visible === "send") {
                return order.status === "S";
            }
            if (visible === "progress") {
                return order.status === "IP";
            }
            if (visible === "closed") {
                return order.status === "C";
            }
            if (visible === "canceled") {
                return order.status === "CA";
            }
        });
        if (search === "") {
            setFilteredOrders(visibleFiltered);
            return;
        }
        const filtered = visibleFiltered.filter((order) =>
            zeroFill(order.index, 10)
                .toLowerCase()
                .includes(search.toLowerCase())
        );
        setFilteredOrders(filtered);
    };

    const handleChangeStatus = async (e) => {
        const status = e.target.value;
        const token = localStorage.getItem("token");
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            document.body.style.cursor = "wait";
            const response = await clientAxios.put(
                `/api/orders/status/${auth.websites[0].id}/${e.target.dataset.id}`,
                { status },
                config
            );
            if (response.status === 200 || response.status === 202) {
                setFilteredOrders(
                    filteredOrders.map((order) => {
                        if (order.id === e.target.dataset.id) {
                            order.status = status;
                        }
                        return order;
                    })
                );
                setOrders(
                    orders.map((order) => {
                        if (order.id === e.target.dataset.id) {
                            order.status = response.data.status;
                            order.delivery_date = response.data.delivery_date;
                        }
                        return order;
                    })
                );
                filterOrders(search, visible);
                handleAlert("Estatus actualizado correntamente", false);
            } else {
                handleAlert("Hubo un error al actualizar el estatus", true);
            }
        } catch (error) {
            console.log(error);
            handleAlert("Hubo un error al actualizar el estatus", true);
        } finally {
            document.body.style.cursor = "default";
        }
    };

    const handleSelectAll = () => {
        const newData = filteredOrders.map((item) =>
            item.visible ? { ...item, selected: !selectAll } : item
        );
        setFilteredOrders(newData);
        setSelectAll(!selectAll);
    };

    const handleSelect = (index) => {
        const newData = [...filteredOrders];
        newData[index].selected = !newData[index].selected; // Update selected property
        setFilteredOrders(newData);
    };

    const formatStatus = (status) => {
        if (status === "IP") {
            return "En proceso";
        }
        if (status === "S") {
            return "Enviado";
        }
        if (status === "C") {
            return "Cerrado";
        }
        if (status === "CA") {
            return "Cancelado";
        }
    };

    return (
        <div className={styles["orders-wrapper"]}>
            {/* {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />} */}
            <PageHeaderDash 
                title={'Pedidos de Productos'}
                description={'Administra tus pedidos'}
                image={Ordersimg}
            />
            <div className={`${styles.filters} `}>
                <SearcherDashboard
                    setSearch={setSearch}
                    filterList={filterOrders}
                    visible={visible}
                    setOrder={setOrder}
                    order={order}
                    setOrderType={setOrderType}
                    orderType={orderType}
                    sortedList={sortedOrders}
                    setFilteredList={setFilteredOrders}
                    setSelectAll={setSelectAll}
                    listName="pedidos por ID"
                    options={[
                        { name: "Número", type: "id" },
                        { name: "Fecha de pedido", type: "date" },
                        { name: "Fecha de entrega", type: "due-date" },
                        { name: "Total", type: "total" },
                    ]}
                />
            </div>
            <TableDashboard
                columns={[
                    { prop: "checkbox", width: "5%" },
                    { prop: "Número", width: "10%" },
                    { prop: "Fecha de pedido", width: "15%" },
                    { prop: "Fecha de entrega", width: "15%" },
                    { prop: "Cliente", width: "10%" },
                    { prop: "Estado", width: "10%" },
                    { prop: "Nota", width: "15%" },
                    { prop: "Total", width: "10%" },
                    { prop: "Detalles", width: "10%" },
                ]}
                listLength={filteredOrders.length}
                filterList={filterOrders}
                search={search}
                visibleCount={visibleCount}
                selectedCount={selectedCount}
                handleSelectAll={handleSelectAll}
                setSelectAll={setSelectAll}
                selectAll={selectAll}
                limit={limit}
                setLimit={setLimit}
                visible={visible}
                setVisible={setVisible}
                visibleOptions={[
                    { type: "send", name: "Enviados" },
                    { type: "progress", name: "En progreso" },
                    { type: "closed", name: "Cerrados" },
                    { type: "canceled", name: "Cancelados" },
                ]}
                listName="pedidos por ID"
            >
                {filteredOrders.map((order, index) => {
                    if (index < limit) {
                        order.visible = true;
                        //Share to whatsapp pedidos
                        const share = () => {
                            const formatProductTable = (products) => {
                                let table = "\n";
                                table +=
                                    "Producto\tCantidad\tPrecio\tSubtotal\n";
                                products.forEach((product) => {
                                    table += `${product.name}\t${
                                        product.quantity
                                    }\t${product.price}\t${
                                        product.price * product.quantity
                                    }\n`;
                                });
                                return table;
                            };

                            const shareToWhatsApp = (message) => {
                                const url = `whatsapp://send?text=${encodeURIComponent(
                                    message
                                )}`;
                                window.open(url, "_blank");
                            };

                            const shareArrayToWhatsApp = (products) => {
                                const message = `
*ID de Pedido:* ${order.index}
*Fecha de Pedido:* ${formatDate(order.createdAt)}
*Cliente :* Issac Shakalo
*Nota de pedido:* ${order.notes}
*Destino:* ubicacion de entrega
${formatProductTable(products)}
*Total:* $${formatToMoney(parseFloat(order.total))}
                            `;
                                shareToWhatsApp(message);
                            };

                            // Example product array
                            const products = [
                                {
                                    name: "Producto 1",
                                    quantity: 2,
                                    price: 10,
                                },
                                {
                                    name: "Producto 2",
                                    quantity: 1,
                                    price: 20,
                                },
                            ];

                            shareArrayToWhatsApp(products);
                        };

                        return (
                            <Fragment key={`${order.id}-${order.website_id}`}>
                                <tr
                                    className={`${
                                        details === order.id
                                            ? styles["details-active"]
                                            : ""
                                    } ${
                                        order.selected ? styles.selectedRow : ""
                                    } ${styles["orders-row"]}`}
                                >
                                    <td className={styles["cell-select"]}>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleSelect(index)}
                                            checked={order.selected || false}
                                        />
                                    </td>
                                    <td>
                                        {String(order.index).padStart(10, "0")}
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        {order.delivery_date
                                            ? formatDate(order.delivery_date)
                                            : "----"}
                                    </td>
                                    <td className={styles["cell-name"]}>
                                        <p>
                                            {order.customer.name}{" "}
                                            {order.customer.lastname}
                                        </p>
                                    </td>
                                    <td>
                                        <select
                                            className={`${styles.select} ${
                                                styles[`select-${order.status}`]
                                            }`}
                                            value={order.status}
                                            data-id={order.id}
                                            onChange={handleChangeStatus}
                                        >
                                            <option value="IP">
                                                En proceso
                                            </option>
                                            <option value="S">Enviado</option>
                                            <option value="C">Cerrado</option>
                                            <option value="CA">
                                                Cancelado
                                            </option>
                                        </select>
                                    </td>
                                    <td>{order.notes}</td>
                                    <td>
                                        {formatToMoney(parseFloat(order.total))}{" "}
                                        MXN
                                    </td>
                                    <td
                                        className={styles.details}
                                        onClick={() => toggleDetails(order.id)}
                                    >
                                        Ver{" "}
                                        <i className="fa-regular fa-eye"></i>
                                    </td>
                                </tr>

                                {details === order.id && (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className={styles.products23}
                                        >
                                            <h2>
                                                Pedido:{" "}
                                                {String(order.index).padStart(
                                                    10,
                                                    "0"
                                                )}
                                            </h2>
                                            <div
                                                className={
                                                    styles.Descriptioncontfather
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.Descriptioncont
                                                    }
                                                >
                                                    <h3
                                                        className={
                                                            styles.infofloatl
                                                        }
                                                    >
                                                        Productos en el pedido:
                                                    </h3>
                                                    <table
                                                        className={
                                                            styles[
                                                                "products-table"
                                                            ]
                                                        }
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    Producto
                                                                </th>
                                                                <th>
                                                                    Cantidad
                                                                </th>
                                                                <th>Precio</th>
                                                                <th>
                                                                    Subtotal
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.elements.map(
                                                                (element) => (
                                                                    <tr
                                                                        key={`${element.name}-${order.id}`}
                                                                    >
                                                                        <td>
                                                                            {
                                                                                element.name
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                element
                                                                                    .order_element
                                                                                    .quantity
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {formatToMoney(
                                                                                element.price
                                                                            )}{" "}
                                                                            MXN
                                                                        </td>
                                                                        <td>
                                                                            {formatToMoney(
                                                                                element.price *
                                                                                    element
                                                                                        .order_element
                                                                                        .quantity
                                                                            )}{" "}
                                                                            MXN
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div
                                                    className={
                                                        styles.Descriptioncont
                                                    }
                                                >
                                                    <h3>
                                                        {" "}
                                                        Ubicacion de entrega:
                                                    </h3>
                                                    <p>{order.address}</p>
                                                    <h3>Nota de pedido</h3>
                                                    <p>{order.notes}</p>
                                                </div>
                                            </div>
                                            <div className={styles.pedidofinal}>
                                                <div>
                                                    <h3
                                                        className={
                                                            styles.infofloatr
                                                        }
                                                    >
                                                        Total de Pedido:{" "}
                                                        <span
                                                            className={
                                                                styles.infofloatrb
                                                            }
                                                        >
                                                            {formatToMoney(
                                                                parseFloat(
                                                                    order.total
                                                                )
                                                            )}{" "}
                                                            MXN
                                                        </span>
                                                    </h3>
                                                    <h3
                                                        className={
                                                            styles.infofloatr
                                                        }
                                                    >
                                                        Status:{" "}
                                                        <span
                                                            className={
                                                                styles.infofloatrb
                                                            }
                                                        >
                                                            {formatStatus(
                                                                order.status
                                                            )}
                                                        </span>
                                                    </h3>
                                                </div>
                                                <button
                                                    className={styles.STW}
                                                    onClick={share}
                                                >
                                                    Compartir pedido{" "}
                                                    <i className="fa-solid fa-share"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        );
                    } else {
                        order.visible = false;
                    }
                })}
            </TableDashboard>
        </div>
    );
};

export default Orders;
