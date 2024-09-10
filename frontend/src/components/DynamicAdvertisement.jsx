// ********************* Components for Dynamic Advertisement *********************
import DefaultAdvertisementComponent from '../DynamicComponents/DefaultComponent/Advertisement';


const DynamicAdvertisement = ({ advertisement, userSiteType }) => {
    const componentMap = {
        // 'Shakalo stroes': ShakaloStoreComponent,
    }

    const AdvertismenteComponent = componentMap[userSiteType] || DefaultAdvertisementComponent;

    return (
        <div>
            <AdvertismenteComponent 
                advertisement={advertisement}
            />
        </div>
    )
}

export default DynamicAdvertisement
