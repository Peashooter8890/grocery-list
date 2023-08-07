import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axiosInstance from '../../axiosInstance';
import AuthProtector from '../utility/AuthProtector';
import CreateNewGroceryList from '../utility/GroceryListPopUp';
import "../../App.css";

const GroceryCollection = () => {
    const navigate = useNavigate();
    const [groceryLists, setGroceryLists] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    
    // for renaming grocery list
    const [selected, setSelected] = useState({
        id: '',
        name: ''
    });

    useEffect(() => {
        const fetchGroceryCollection = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/groceryList/getAllGroceryLists`);
                setGroceryLists(response.data);
            } catch (err) {
                console.error(err);
                setErrorMessage(err.response.data.message);
            }
        };

        fetchGroceryCollection();
    }, []);

    useEffect(() => {
        if ((selected.id !== '') && (selected.name !== '')) {
            setModalIsOpen(true);
        }
    },[selected]);

    const submitHandler = (id, name) => {
        if (id==='') {
            addGroceryList(name);
        } else {
            renameGroceryList(id,name);
        }
    }

    const addGroceryList = async (name) => {
        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/groceryList/addGroceryList`, { name });
            if (response.status === 200) {
                setGroceryLists([...groceryLists, response.data.newGroceryList]);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response.data.message);
        } finally {
            setModalIsOpen(false);
        }
    };

    const renameGroceryList = async (id, name) => {
        try {
            const response = await axiosInstance.put(`${process.env.REACT_APP_API_URL}/groceryList/renameGroceryList/${id}`, { name });
            if (response.status === 200) {
                setGroceryLists(groceryLists.map((item) => item._id === id ? { ...item, name } : item));
            }
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response.data.message);
        } finally {
            setSelected({
                id: '',
                name: ''
            });
            setModalIsOpen(false);
        }
    };
    
    const removeGroceryList = async (id, name) => {
        try {
            const response = await axiosInstance.delete(`${process.env.REACT_APP_API_URL}/groceryList/deleteGroceryList/${id}`);
            if (response.status === 200) {
                setGroceryLists(groceryLists.filter((item) => item._id !== id));
            }
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response.data.message);
        }
    }; 

    const logout = async () => {
        try {
            const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/user/logout`);
            window.location.reload();
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response.data.message);
        }
    }

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
        <div className="h-full bg-lime-900">
            {modalIsOpen &&
                <CreateNewGroceryList
                    id={selected.id}
                    initialName={selected.name}
                    modalIsOpen
                    onSubmit={submitHandler}
                    onBack={() => setModalIsOpen(false)}
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
                                            <div className="hover-button" onClick={() => navigate(`/grocerylist/${item._id}`)}>
                                                {item.name}
                                            </div>
                                            <button onClick={() => setSelected({
                                                id: item._id,
                                                name: item.name
                                            })}>
                                                Rename
                                            </button>
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
            <div className="flex flex-col">
                <button onClick={() => setModalIsOpen(true)}>Add Grocery List</button>
                <button onClick={logout}>Logout</button>
                {errorMessage !== '' && 
                    <p style={{color:'red'}}>{errorMessage}</p>
                }
            </div>
        </div>
    );
};

export default AuthProtector(GroceryCollection);