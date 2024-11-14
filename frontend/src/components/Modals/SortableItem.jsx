import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex',
        alignItems: 'center',
        touchAction: 'none', // Prevents default touch behavior on mobile devices
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            {props.handleActive && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'grab',
                        padding: '0.5rem',
                    }}
                    {...listeners}
                >
                    <i className="fa-solid fa-grip-lines"></i>
                </div>
            )}
            {props.children}
        </div>
    );
};

export default SortableItem;
