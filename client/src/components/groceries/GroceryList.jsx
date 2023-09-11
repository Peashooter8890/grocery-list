import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import axiosInstance from '../../axiosInstance';
import AuthProtector from '../utility/AuthProtector';
import { createDragEndHandler } from '../../utility/dragUtils';
import CheckIcon from '../svg/checkmarkSVG';
import XmarkIcon from '../svg/xmarkSVG';
import Trash from '../svg/trashSVG';
import EditIcon from '../svg/editSVG';

const GroceryList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    //const [isAddingItem, setIsAddingItem] = useState(false);
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
        //setIsAddingItem(false);
        setNewItemName('');
    }

    const handleDragEnd = createDragEndHandler(items, setItems);

    const onBack = () => {
        navigate('/groceryCollection');
    }

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-center m-4 md:m-8 text-[1.75rem] md:text-[3rem] font-semibold font-indieflower">Grocery Items</h2>
            <div>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="list">
                        {(provided) => (
                            <div className="flex flex-col gap-[.125rem] md:gap-1" {...provided.droppableProps} ref={provided.innerRef}>
                                {items && (items.length > 0) && items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <div 
                                                className="flex mx-2 md:mx-8 gap-1 md:gap-2 border-2 font-indieflower border-listbordergreen bg-headergreen rounded-md md:rounded-lg justify-between items-center max-w-2xl max-h-16"
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
                                                    <div className="hover-button text-lg md:text-2xl hover:font-bold mx-2 md:mx-4 mb-1 md:mb-2 mt-2 md:mt-3 cursor-auto">
                                                        {item.name}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 mr-2">
                                                    <input className="w-4 md:w-6 h-4 md:h-6 mr-1 md:mr-2 hover:bg-blue-500" type="checkbox"/>
                                                    {!(editingItem.id === item.id)
                                                        ?
                                                        <button className="md:box-border md:border-[1px] md:border-transparent md:hover:border-gray-500 rounded md:hover:bg-loginbordergreen" 
                                                        onClick={() => setEditingItem({
                                                            id: item.id,
                                                            name: item.name
                                                        })}>
                                                            <span><EditIcon /></span>
                                                        </button>
                                                        :
                                                        <div className="flex gap-2">
                                                            <button className="md:box-border md:border-[1px] md:border-transparent md:hover:border-gray-500 rounded md:hover:bg-loginbordergreen" onClick={() => {renameItem(editingItem.id, editingItem.name)}}><CheckIcon /></button>
                                                            <button className="md:box-border md:border-[1px] md:border-transparent md:hover:border-gray-500 rounded md:hover:bg-loginbordergreen" onClick={finishEditingItem}><XmarkIcon /></button>
                                                        </div>
                                                    }                                                   
                                                    <button className="md:box-border md:border-[1px] md:border-transparent md:hover:border-gray-500 rounded md:hover:bg-loginbordergreen" onClick={() => removeItem(item.id)}><Trash /></button>                                                        
                                                </div>   
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
            <div className="flex flex-col mt-1 md:mt-2">                
                <div className="flex mx-2 md:mx-8 gap-2 items-center">
                    <input 
                        type="text"
                        className="rounded-md text-sm md:text-base w-56 md:w-72"
                        placeholder="Add New Item"
                        value={newItemName}
                        onChange={e => setNewItemName(e.target.value)}
                    />
                    <button className="border-gray-500 border-[1px] bg-buttongreen md:hover:bg-loginbordergreen h-fit pt-1 pb-1 px-2 md:px-4 rounded-lg md:text-xl" onClick={() => addItem(newItemName)}>Add</button>
                    <button className="border-gray-500 border-[1px] bg-buttongreen md:hover:bg-loginbordergreen h-fit pt-1 pb-1 px-2 md:px-4 rounded-lg md:text-xl" onClick={cancel}>Clear</button>
                </div>                
                <button onClick={onBack}>Back</button>
                {errorMessage && 
                    <p>{errorMessage}</p>
                }
            </div>
        </div>
    );
};

export default AuthProtector(GroceryList);