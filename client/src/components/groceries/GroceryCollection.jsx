import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axiosInstance from '../../axiosInstance';
import AuthProtector from '../../utility/AuthProtector';
import CreateNewGroceryList from '../utility/GroceryListPopUp';
import "../../App.css";

const GroceryCollection = () => {
    const [groceryLists, setGroceryLists] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [submitType, setSubmitType] = useState('');

    useEffect(() => {
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

    const groceryListInitiator = (type, id = null, name = null) => {
        // initiate adding or renaming grocery list
        switch (type) {
            case 'add':
                setModalIsOpen(true);
            case 'rename':
                setModalIsOpen(true);
            default:
                console.log('This is not supposed to happen.');
        }
    }

    const submitHandler = (type, id, name) => {
        // execute adding or renaming grocery list
        switch (type) {
            case 'add':
                addGroceryList(name);
            case 'rename':
                renameGroceryList(id, name);
            default:
                console.log('This is not supposed to happen.');
        }
    }

    const addGroceryList = async (name) => {
        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/groceryList/addGroceryList`, { name });
            if (response.status === 200) {
                setSuccessMessage(`Successfully added grocery list "${response.data.newGroceryList.name}".`);
                setGroceryLists([...groceryLists, response.data.newGroceryList]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setModalIsOpen(false);
        }
    };

    const renameGroceryList = async (id, name) => {
        try {
            const response = await axiosInstance.put(`${process.env.REACT_APP_API_URL}/groceryList/renameGroceryList/${id}`, { name });
            if (response.status === 200) {
                setSuccessMessage(`Successfully renamed grocery list "${newGroceryListName}".`);
                setGroceryLists(groceryLists.map((item) => item._id === id ? { ...item, name } : item));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setModalIsOpen(false);
        }
    };
    
    const removeGroceryList = async (id, name) => {
        try {
            const response = await axiosInstance.delete(`${process.env.REACT_APP_API_URL}/groceryList/deleteGroceryList/${id}`);
            if (response.status === 200) {
                setSuccessMessage(`Successfully removed grocery list "${name}".`);
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
            {modalIsOpen &&
                <CreateNewGroceryList 
                    id={selectedGroceryListId}
                    initialName={selectedGroceryListName}
                    modalIsOpen
                    onSubmit={submitHandler}
                    onBack={() => setModalIsOpen(false)}
                    submitType
                />
            }
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
                                            {item.name}
                                            <button>Rename</button>
                                            <button onClick={() => removeGroceryList(item._id, item.name)}>Remove</button>
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
                <button onClick={() => setModalIsOpen(true)}>Add Grocery List</button>
                {successMessage !== '' && 
                    <p style={{color:'green'}}>{successMessage}</p>
                }
            </div>
        </div>
    );
};

export default AuthProtector(GroceryCollection);