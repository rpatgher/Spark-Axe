// ********************* Components for Dynamic Element *********************
import DefaultElementComponent from '../DynamicComponents/DefaultComponent/Element';
import ShakaloStoreComponent from '../DynamicComponents/ShakaloStore/VapeCard';


const DynamicElement = ({element, userSiteType}) => {
    const componentMap = {
        'Shakalo stroes': ShakaloStoreComponent,
    }

    const ElementComponent = componentMap[userSiteType] || DefaultElementComponent;

    return (
        <div>
            <ElementComponent 
                element={element}
            />
        </div>
    )
}

export default DynamicElement;
