## Searcher Dashboard

Es un componenete con el buscador y sección de filtros para las tablas del dashboard

### ¿Cómo se utiliza?

Como _props_ se le deben pasar:

- `setSearch`: Es una función que guardar en una variable lo que se está escribiendo en el buscador
- `filterList`: Esta es una función que debe ser declarada donde se está usando la tabla que sirve para filtrar los elementos de la lista cada vez que se active una forma de filtrado.
- `visible`: Esta variable guarda la preferencia de la vista de la tabla que prefiera el usuario según su selección
- `setOrder`:. Es un setter para definir el orden (ascendente o descentente) con el que se van a ordenar los elemenos de la lista.
- `order`: Es la varibale que guarda las preferencias del ordenamiento.
- `setOrderType`: Es un setter para el tipo de ordenamiento (por ID, nombre, etc) con el que se van a ordenar los elementos.
- `orderType`: Es la variable que guarda la preferencia del tipo de ordenamiento del usuario.
- `sortedList`: Es una función que sirve para reordenar los productos según las preferencias seleccionadas
- `setFilteredList`: Esta función sirve para resetear los elementos de la tabla según los filtros seleccionados.
- `setSelectAll`: Esta función activa o desactiva si todos los elementos están seleccionados o no.
- `options`: Esta es una lista de las opciones por las que se podrá ordenar los elementos de la lista. 
    ````jsx 
    const options = [
        {name: 'ID', type: 'id'},
        {name: 'Nombre', type: 'name'},
        {name: 'Precio', type: 'price'}
    ]
    ````
- `listName`: Es variable dice qué tipo de proudcutos son los que se están listando en la tabla.

### Ejemplo:

````jsx
<SearcherDashboard
    setSearch={}
    filterList={}
    visible={}
    setOrder={}
    order={}
    setOrderType={}
    orderType={}
    sortedList={}
    setFilteredList={}
    setSelectAll={}
    options={}
    listName={}
>
    <tr>
        <td></td>
    </tr>
</SearcherDashboard>
````
