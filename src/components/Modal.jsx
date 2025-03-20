import React from "react";
import "./css/Modal.css";

const Modal = ({ onClose, onSubmit, reserver, setReserver }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Reserve This Book</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    value={reserver.firstName}
                    onChange={(e) => setReserver({ ...reserver, firstName: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={reserver.lastName}
                    onChange={(e) => setReserver({ ...reserver, lastName: e.target.value })}
                />
                <div className="modal-buttons">
                    <button onClick={onSubmit} className="submit-button">Submit</button>
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;