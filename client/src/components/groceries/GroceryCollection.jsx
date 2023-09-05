import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axiosInstance from '../../axiosInstance';
import AuthProtector from '../utility/AuthProtector';
import CreateNewGroceryList from '../utility/GroceryListPopUp';
import Trash from '../svg/trashSVG'
import EditIcon from '../svg/editSVG'
import UserIcon from '../svg/usersSVG'
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

    /*useEffect(() => {
        if ((selected.id !== '') && (selected.name !== '')) {
            setModalIsOpen(true);
        }
    },[selected]);*/

    const submitHandler = (id, name) => {
        if (id==='') {
            addGroceryList(name);
        } else {
            renameGroceryList(id, name);
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
        <div className="h-full flex flex-col">
            <h2 className="text-center m-4 md:m-8 text-[1.75rem] md:text-[3rem] font-semibold font-indieflower">Your Grocery Lists</h2>
            {modalIsOpen &&
                <CreateNewGroceryList
                    id={selected.id}
                    initialName={selected.name}
                    modalIsOpen
                    onSubmit={submitHandler}
                    onBack={() => setModalIsOpen(false)}
                />
            }
            <div>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="groceryList">
                        {(provided) => (
                            <div className="flex flex-col gap-[.125rem] md:gap-1" {...provided.droppableProps} ref={provided.innerRef}>
                                {groceryLists.map((item, index) => (
                                    <Draggable key={item._id} draggableId={item._id} index={index}>
                                        {(provided) => (
                                            <div
                                                className="flex mx-2 md:mx-8 gap-1 md:gap-2 border-2 font-indieflower border-listbordergreen bg-headergreen rounded-md md:rounded-lg justify-between items-center max-w-6xl"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {item._id===selected.id
                                                    ? 
                                                    <span className="cursor-default text-xl md:text-4xl" style={{color:"green"}}>Input Placeholder</span>
                                                    : 
                                                    <div className="hover-button text-xl md:text-4xl hover:font-bold hover:underline mx-2 md:mx-4 mb-1 md:mb-2 mt-2 md:mt-3 cursor-pointer" onClick={() => navigate(`/grocerylist/${item._id}`)}>
                                                    {item.name}
                                                </div>
                                                }
                                                <div className="flex gap-2 md:gap-4 mr-2 md:mr-4 items-center">
                                                    <button className="md:border-gray-500 md:border-[1px] md:bg-buttongreen md:hover:bg-loginbordergreen h-fit md:pt-2 md:pb-1 md:px-4 rounded-lg md:text-xl" onClick={() => setSelected({
                                                        id: item._id,
                                                        name: item.name
                                                    })}>
                                                        <span className="hidden md:flex">Rename</span>
                                                        <span className="flex md:hidden"><EditIcon /></span>
                                                    </button>
                                                    <button className="md:border-gray-500 md:border-[1px] md:bg-buttongreen md:hover:bg-loginbordergreen h-fit md:pt-2 md:pb-1 md:px-4 rounded-lg md:text-xl">
                                                        <span className="hidden md:flex">Users</span>
                                                        <span className="flex md:hidden"><UserIcon /></span>
                                                    </button>
                                                    <button className="md:box-border md:border-[1px] md:border-transparent md:hover:border-gray-500 rounded md:hover:bg-loginbordergreen" onClick={() => removeGroceryList(item._id, item.name)}><Trash /></button>
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
            <div className="flex">
                <button className="font-indieflower border-gray-500 border-[1px] rounded-lg bg-buttongreen hover:bg-loginbordergreen h-fit text-xl md:text-2xl ml-2 md:ml-8 mt-1 mb-2 md:mb-4 pt-[.37rem] md:pt-3 md:pb-1 px-4 md:px-8" onClick={() => setModalIsOpen(true)}>Add New List</button>
                {errorMessage !== '' && 
                    <p style={{color:'red'}}>{errorMessage}</p>
                }
            </div>
        </div>
    );
};

export default AuthProtector(GroceryCollection);