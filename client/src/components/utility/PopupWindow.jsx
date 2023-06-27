import React, { useState } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root');

function PopupWindow(props) {
  const [modalIsOpen, setModalIsOpen] = useState(!navigator.cookieEnabled);

  return (
    <div>
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)}
        style={
          {
            overlay: {
              backgroundColor: 'grey' 
            },
            content: {
              color: 'red'
            }
          }
        }
      >
        <h2>{props.title}</h2>
        <p>{props.message}</p>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default PopupWindow;
