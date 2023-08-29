import React, { useState } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root');

// props is an object with title and message
function GroceryListPopUp({ id, initialName, modalIsOpen, onSubmit, onBack}) {
  const [name, setName] = useState(initialName || '');

  return (
    <div>
      <Modal 
        isOpen={modalIsOpen}
        style={
          {
            content: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20rem',
              height: '20rem',
              color: 'red'
            }
          }
        }
      >
        <h2>Name of your grocery list:</h2>
        <input 
          type="text" 
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button onClick={() => onSubmit(id, name)}>Submit</button>
        <button onClick={onBack}>Go Back</button>
      </Modal>
    </div>
  );
}

export default GroceryListPopUp;