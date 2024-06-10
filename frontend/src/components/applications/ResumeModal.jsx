import React from "react";

const ResumeModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg w-8/12 max-w-2xl max-h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Resume</h2>
          <button
            className="text-gray-500 hover:text-red-600 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-4 flex-grow flex items-center justify-center">
          <img src={imageUrl} alt="resume" className="max-w-full max-h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
