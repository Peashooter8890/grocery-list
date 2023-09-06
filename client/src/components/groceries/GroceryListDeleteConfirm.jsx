import React from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root');

// props is an object with title and message
function GroceryListDeleteConfirm({ id, name, modalIsOpen, onSubmit, onBack}) {
  return (
    <div>
      <Modal 
        isOpen={modalIsOpen}
      >
        <h2>Are you sure you want to delete {name}?</h2>
        <button className="border-8" onClick={() => onSubmit(id)}>Yes</button>
        <button className="border-8" onClick={onBack}>No</button>
      </Modal>
    </div>
  );
}

export default GroceryListDeleteConfirm;