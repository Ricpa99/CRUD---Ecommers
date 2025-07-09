import React, { useEffect } from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";


// Komponen Notifikasi Toast
const Toast = ({ message, show, onHide, type = 'success' }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => onHide(), 4000);
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    const isSuccess = type === 'success';
    return (
        <div className={`fixed top-5 right-5 bg-white shadow-lg rounded-lg p-4 z-50 transition-all duration-300 ease-in-out max-w-sm w-full ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {isSuccess ? <FiCheckCircle className="h-6 w-6 text-green-500" /> : <FiInfo className="h-6 w-6 text-blue-500" />}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-bold text-gray-900">{isSuccess ? 'Success' : 'Information'}</p>
                    <p className="mt-1 text-sm text-gray-600">{message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button onClick={onHide} className="inline-flex text-gray-400 hover:text-gray-500"><FiX size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default Toast;