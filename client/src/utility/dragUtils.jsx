export const createDragEndHandler = (list, setList) => {
    // used with the @hello-pangea/dnd library (drag & drop library for react)
    // this function returns items when user drags it outside the required zone
    return (result) => {
        if (!result.destination) return;
        const items = Array.from(list);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setList(items);
    }
};