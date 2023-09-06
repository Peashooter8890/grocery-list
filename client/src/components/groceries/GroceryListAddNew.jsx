import React, { useState } from 'react';
import Modal from 'react-modal';
import CloseIcon from '../svg/closeSVG';
Modal.setAppElement('#root');

// props is an object with title and message
function GroceryListAddNew({ modalIsOpen, onSubmit, onBack}) {
  const [name, setName] = useState('');

  return (
    <div>
      <Modal 
        isOpen={modalIsOpen}
        className="bg-popupgreen border-2 border-black rounded-lg w-[21rem] md:w-[30rem] p-[.4rem] md:p-[.63rem]"
        style={
          {
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)"
            },
            content: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'black'
            }
          }
        }
      >
        <div className="flex flex-col items-center">
          <div className="flex justify-end w-full">
            <button className="md:box-border md:border-[1px] md:border-transparent md:hover:border-gray-500 rounded md:hover:bg-logingreen" onClick={onBack}><CloseIcon /></button>
          </div>
          <h2 className="font-indieflower text-2xl md:text-4xl mt-2 md:mt-5 mb-4 md:mb-7">Add New Shopping List</h2>
          <input 
            type="text"
            className="rounded w-10/12 font-medium h-7 md:h-10 text-sm md:text-xl"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <div className="flex gap-6 mt-5 mb-4 md:mb-8">
            <button className="border-popupbordergreen border-[1px] py-[.125rem] px-5 rounded bg-white font-medium hover:bg-logingreen text-xs md:text-base" onClick={() => onSubmit(name)}>Save</button>
            <button className="border-popupbordergreen border-[1px] py-[.125rem] px-5 rounded bg-white font-medium hover:bg-logingreen text-xs md:text-base" onClick={onBack}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default GroceryListAddNew;