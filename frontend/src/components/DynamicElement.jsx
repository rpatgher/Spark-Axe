// ********************* Components for Dynamic Element *********************
import DefaultProductComponent from '../DynamicElementComponents/DefaultProductComponent/Component';
import ShakaloStoreComponent from '../DynamicElementComponents/ShakaloStore/VapeCard';

const DynamicElement = ({element}) => {
    const componentMap = {
        'ShakaloStoreComponent': ShakaloStoreComponent,
    }
    
    const userSiteType = 'ShakaloStoreComponent';
    const ProductComponent = componentMap[userSiteType] || DefaultProductComponent;

    return (
        <div>
            <ProductComponent 
                vape={element}
            />
        </div>
    )
}

export default DynamicElement
