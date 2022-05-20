import React, { useEffect, useRef } from "react";

const UserModal = ({ showModal, setShowModal, modalData }) => {
    const modal = useRef();
    useEffect(() => {
        console.log(modalData)
        modal.current.addEventListener('click', handleClick);
        return () => {
            modal.current.removeEventListener('click', handleClick);
        }
    }, [])


    const handleClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowModal(false);
        }
    }

    return <div className={showModal ? 'modal active' : 'modal'} ref={modal}>
        <div className='modal-data'>

        </div>
    </div>
}

export default UserModal;