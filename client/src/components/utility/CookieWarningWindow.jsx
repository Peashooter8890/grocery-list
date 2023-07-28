import React, { useState } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root');

// props is an object with title and message
function CookieWarningWindow() {
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
        <h2>FRESHLY BAKED NON-SHADY COOKIES. They are here. NOW.</h2>
        <p>
          Our server baked some hot FRESHLY BAKED NON-SHADY COOKIES. Please enable our FRESHLY BAKED NON-SHADY COOKIES in your browser so that your browser can taste our FRESHLY BAKED NON-SHADY COOKIES. 
            If you do not give your browser our FRESHLY BAKED NON-SHADY COOKIES, it will come back with a bloody vengeance by ceasing to store your login information. If you value convenience over false assumptions 
            (such as the assumption that we are using shady cookies to enforce menace onto you, which we clearly aren't, because we don't know any buyers right now who would buy your personal information), please enable 
            cookies so that we can spread our FRESHLY BAKED NON-SHADY COOKIES onto the world. Thank you.
        </p>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default CookieWarningWindow;