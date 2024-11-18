import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = (props) => {
    const {
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex'
    };

    return (
        <div
            style={style}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {props?.handleActive && (
                    <i 
                        className="fa-solid fa-grip-lines"
                        style={{
                            cursor: 'grab',
                            padding: '0.5rem',
                        }}
                        
                        {...listeners}
                        ref={setNodeRef}
                    ></i>
                )}
            </div>
            {props?.children}
        </div>
    );
};

export default SortableItem;
