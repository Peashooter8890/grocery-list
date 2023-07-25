import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axiosInstance from '../../axiosInstance';
import AuthProtector from '../../utility/AuthProtector';
import "../../App.css";

const GroceryCollection = () => {
    const navigate = useNavigate();
    const [groceryLists, setGroceryLists] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    console.log(groceryLists);

    useEffect(() => {
        // fetch grocery list from database on page load
        const fetchGroceryCollection = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/groceryList/getAllGroceryLists`);
                setGroceryLists(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchGroceryCollection();
    }, []);

    const addGroceryList = async () => {
        const id = uuidv4();
        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/groceryList/addGroceryList`, id);
            if (response.status === 200) {
                setSuccessMessage('Changes were successfully saved.');
                setGroceryLists([...groceryLists, { _id: id }]);
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    const removeGroceryList = async (id) => {
        try {
            const response = await axiosInstance.delete(`${process.env.REACT_APP_API_URL}/groceryList/deleteGroceryList/${id}`);
            if (response.status === 200) {
                setSuccessMessage('Changes were successfully saved.');
                setGroceryLists(groceryLists.filter((item) => item._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };    

    const handleDragEnd = (result) => {
        // make item return to original position if it was dropped outside of list
        if (!result.destination) return; 
        // make shallow copy of groceryList. this is because directly updating states during calculation is bad practice (I think)
        const items = Array.from(groceryLists);
        // remove and extract the dragged item from the list
        const [reorderedItem] = items.splice(result.source.index, 1);
        // insert the dragged item into the newly dropped location (dnd library stores this in result.destination.index)
        items.splice(result.destination.index, 0, reorderedItem);
        // calculation is over, so we can setState now. 
        setGroceryLists(items);
    };

    return (
        <div className="grocery-list">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="groceryList">
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {groceryLists.map((item, index) => (
                                <Draggable key={item._id} draggableId={item._id} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            Grocery List {item._id}
                                            <button onClick={() => removeGroceryList(item._id)}>Remove</button>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
            <div>
                <button onClick={addGroceryList}>Add Grocery List</button>
                {successMessage !== '' && 
                    <p>{successMessage}</p>
                }
            </div>
        </div>
    );
};

export default AuthProtector(GroceryCollection);