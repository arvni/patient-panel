import React, {useCallback} from "react";


const DNDList=({items,component:Component,onMove})=>{
    const handleMove=useCallback((dragIndex, hoverIndex) => {
        onMove(dragIndex,hoverIndex);
    }, [])
    const renderCard = useCallback(
        (item) => {
            return (
                <Component
                    key={item.id}
                    index={item.order}
                    moveCard={onMove}
                    {...item}
                />
            )
        },
        [],
    )
    return;
}
export default DNDList;
