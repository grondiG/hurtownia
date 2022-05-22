import React, { useEffect, useRef } from "react";

const UserModal = ({ showModal, setShowModal, modalData, clientData }) => {
    const modal = useRef(null);
    useEffect(() => {
        if (modal.current !== null) {
            document.body.addEventListener('click', handleClick);
            return () => {
                document.body.removeEventListener('click', handleClick);
            }
        }
    }, [])


    const handleClick = (e) => {
        if (e.target === modal.current) {
            setShowModal(false);
        }
    }
    let fullPrice = 0;

    return <div className={showModal ? 'modal active' : 'modal'} ref={modal}>
        <div className='modal-data'>
            <h1>Zamowienie</h1>
            <table>
                <tbody>
                    {modalData.map((item) => {
                        const { name, img_url, price, amount } = item;
                        fullPrice += price;
                        return <tr>
                            <td><img src={img_url} alt={name} /></td>
                            <td>{name}</td>
                            <td>{amount}kg</td>
                            <td>{price}zl</td>
                        </tr>
                    })}
                    <tr>
                        <td colSpan={3}>Laczny koszt: </td>
                        <td>{fullPrice}zl</td>
                    </tr>

                </tbody>
            </table>
            <p>Adres wysylki: {clientData.adres}</p>
            <p>Numer kontaktowy: {clientData.number}</p>
            <input type="button" className="btn" style={{
                borderColor: 'green',
                color: 'green',
            }} value="Zatwierdz" />
        </div>
    </div>
}

export default UserModal;