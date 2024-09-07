## Table Dashboard

Es un componenete con el diseño establecido para todas las tablas de las páginas del dashboard.

### ¿Cómo se utiliza?

Como _props_ se le deben pasar:

- `children`: Es todo lo que se va a mostrar en la tabla. Este se pone como "children", porque puede que el formato interno de cada celda cambie un poco depenediendo del contexto de la tabla.
- `columns`: es unarreglo de objetos que cada uno tiene los nombres de la columna, así como el ancho que ocupará en la tabla.
    ````jsx
    const columns = [
        {prop: 'Imagen', width: '5%' },
        {prop: 'Nombre', width: '10%' },
        {prop: 'Descripción', width: '10%' },
        {prop: 'Precio', width: '15%' }]
    ]
    ````
- `listLength`: es la longitud de la cantidad de elemetos que serán mostrados en la tabla
- `filterList`: Esta es una función que debe ser declarada donde se está usando la tabla que sirve para filtrar los elementos de la lista cada vez que se active una forma de filtrado.
- `search`: Esta variable es la que guarda lo que se escribe desde el buscador
- `visibleCount`: Esta cuenta todos los elementos visibles actualmente.
- `selectedCount`: Esta cuenta todos los que está seleccionados
- `handleSelectAll`: Esta es una función que selecciona todos los elementos de la tabla.
- `setSelectAll`: Esta función activa o desactiva si todos los elementos están seleccionados o no.
- `selectAll`: Es una variable que dice si están seleccionados todos o no.
- `limit`: Esta variable muestra la cantidad de límite de elementos que se están mostrando.
- `setLimit`: Esta es una función que ajusta el límite según vaya poniendo el usuario.
- `visible`: Esta variable guarda la preferencia de la vista de la tabla que prefiera el usuario según su selección
- `setVisible`: Esta función setea la vista mostrada de la tabla.
- `visibleOptions`: Es es una lista de objetos que pasa las opciones de filtrado para la diferentes vistas de la tabla.
    ````jsx
    const visibleOptions = [
        {type: 'published', name: 'Publicados'},
        {type: 'unpublished', name: 'Archivados'}
    ]
    ````
- `setModalDelete`: Es una setter para activar el modal de eliminar muchos elementos de la lista al mismo tiempo.
- `listName`: Es variable dice qué tipo de proudcutos son los que se están listando en la tabla.
- `createNew`: Es una variable que pasa el endpoint para crear un nuevo elemento que debería haber para cuando la tabla no contiene ningún elemento.

### Ejemplo:

````jsx
<TableDashboard
    columns={}
    listLength={}
    filterList={}
    search={}
    visibleCount={}
    selectedCount={}
    handleSelectAll={}
    setSelectAll={}
    selectAll={}
    limit={}
    setLimit={}
    visible={}
    setVisible={}
    visibleOptions={}
    setModalDelete={}
    listName={}
    createNew={}
>
    <tr>
        <td></td>
    </tr>
</TableDashboard>
````
