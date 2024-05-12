// ********************* Components for Dynamic Element *********************
import ShakaloStoreComponent from '../DynamicElementComponents/ShakaloStore/VapeCard';

const DynamicElement = ({element}) => {
    return (
        <div>
            {/* TODO: Make it dynamic showing the corresponding component depending on the website */}
            <ShakaloStoreComponent 
                vape={element}
            />
        </div>
    )
}

export default DynamicElement
