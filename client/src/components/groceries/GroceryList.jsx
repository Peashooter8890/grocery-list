import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import axiosInstance from '../../axiosInstance';
import AuthProtector from '../utility/AuthProtector';
import { createDragEndHandler } from '../../utility/dragUtils';

const GroceryList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [editingItem, setEditingItem] = useState({
        id: null,
        name: null
    });
    const [newItemName, setNewItemName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/groceryList/getGroceryList/${id}`);
                if (response && response.data && (response.data.length > 0)) {
                    setItems(response.data);
                }
            } catch (err) {
                console.error(err);
                setErrorMessage(err.response.data.message);
            }
        };
        fetchItems();
    }, [id]);

    const updateItems = async (newItems) => {
        try {
            await axiosInstance.put(`${process.env.REACT_APP_API_URL}/groceryList/updateGroceryList/${id}`, { items: newItems });
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response.data.message);
        };
    };

    const renameItem = async (id, name) => {
        try {
            const modifiedItems = items.map((item) => item.id === id ? { ...item, name } : item);
            await updateItems(modifiedItems);
            setItems(modifiedItems);
            finishEditingItem();
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response.data.message);
        };
    };

    const finishEditingItem = () => {
        setEditingItem({
            id: null,
            name: null
        });
    };

    const addItem = (name) => {
        const newItems = [...items, { id: uuidv4(), name }];
        setItems(newItems);
        updateItems(newItems);
        setNewItemName('');
        cancel();
    };

    const removeItem = (id) => {
        console.log("before: ", items);
        const newItems = items.filter((item) => item.id !== id);
        setItems(newItems);
        updateItems(newItems);
    };

    const cancel = () => {
        setIsAddingItem(false);
        setNewItemName('');
    }

    const handleDragEnd = createDragEndHandler(items, setItems);

    const onBack = () => {
        navigate('/groceryCollection');
    }

    return (
        <div className="h-full bg-lime-900">
            <div className="h-[12.5%] border-2 block">
                {/* this space might or might not be needed to fit the design */}
            </div>
            <div className="h-[75%] border-2 block">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="list">
                        {(provided) => (
                            <div className="flex flex-col gap-2" {...provided.droppableProps} ref={provided.innerRef}>
                                {items && (items.length > 0) && items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <div 
                                                className="border-2 flex items-center gap-2"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {editingItem.id === item.id ? (
                                                    <input 
                                                        type="text" 
                                                        value={editingItem.name} 
                                                        onChange={(e) => setEditingItem({
                                                            ...editingItem,
                                                            name: e.target.value
                                                        })} 
                                                    />
                                                ) : (
                                                    item.name
                                                )}
                                                <input type="checkbox"/>
                                                {!(editingItem.id === item.id)
                                                    ?
                                                    <button onClick={() => setEditingItem({
                                                        id: item.id,
                                                        name: item.name
                                                    })}>
                                                        Rename
                                                    </button>
                                                    :
                                                    <button onClick={() => {renameItem(editingItem.id, editingItem.name)}}>Submit</button>
                                                }
                                                {!(editingItem.id === item.id)
                                                    ?
                                                    <button onClick={() => removeItem(item.id)}>Remove</button>
                                                    :
                                                    <button onClick={finishEditingItem}>
                                                        Cancel
                                                    </button>
                                                }     
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            <div className="border-2 h-[12.5%] flex flex-col">
                {!isAddingItem &&
                    <button onClick={() => setIsAddingItem(true)}>Add Item</button>
                }
                {isAddingItem && 
                    <div className="flex">
                        <input 
                            type="text" 
                            value={newItemName}
                            onChange={e => setNewItemName(e.target.value)}
                        />
                        <button onClick={() => addItem(newItemName)}>Add New</button>
                        <button onClick={cancel}>Cancel</button>
                    </div>
                }
                <button onClick={onBack}>Back</button>
                {errorMessage && 
                    <p>{errorMessage}</p>
                }
            </div>
        </div>
    );
};

export default AuthProtector(GroceryList);