import React from 'react';
import Modal from 'react-modal';
import CloseIcon from '../svg/closeSVG';
Modal.setAppElement('#root');

// props is an object with title and message
function GroceryListDeleteConfirm({ id, name, modalIsOpen, onSubmit, onBack}) {
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
          <h2 className="font-indieflower text-lg md:text-2xl mt-2 md:mt-5 mb-4 md:mb-7 text-center">Are you sure you want to delete <br></br>{name}?</h2>
          <div className="flex gap-6 mb-4 md:mb-8">
            <button className="border-popupbordergreen border-[1px] py-[.125rem] px-5 rounded bg-white font-medium hover:bg-[#ffa2a5] text-xs md:text-base" onClick={() => onSubmit(id)}>Yes</button>
            <button className="border-popupbordergreen border-[1px] py-[.125rem] px-5 rounded bg-white font-medium hover:bg-logingreen text-xs md:text-base" onClick={onBack}>No</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default GroceryListDeleteConfirm;