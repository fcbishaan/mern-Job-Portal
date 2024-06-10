// src/components/applications/MessageModal.jsx
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Ensure accessibility by setting the root element

const MessageModal = ({ isOpen, message, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      className="fixed inset-0 flex justify-center items-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-md shadow-md w-1/3">
        <h2 className="text-xl font-bold mb-4">Message from Employer</h2>
        <p className="mb-4">{message}</p>
        <button 
          onClick={onClose} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default MessageModal;
