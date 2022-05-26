import React, { useEffect, useRef } from "react";
import { doc, setDoc, getDocs, getFirestore, collection, query, where, updateDoc } from "firebase/firestore";
import app from "./initFirebase";

const db = getFirestore(app);

const UserModal = ({ showModal, setShowModal, modalData, clientData }) => {
    const modal = useRef(null);
    const info = useRef();
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "transactions", clientData.id), {
                status: true
            })
            info.current.style.color = "green";
            info.current.innerHTML = "Poprawnie sfinalizowano transakcje";
            if (clientData.type) {
                modalData.forEach(async (item) => {
                    const { name, img_url, price, amount } = item;
                    let q = query(collection(db, "products"), where("name", "==", name));
                    let querySnapshot = await getDocs(q);
                    querySnapshot.forEach(async (doc) => {
                        if (parseInt(doc.data().amount) - parseInt(amount) >= 0) {
                            await updateDoc(doc(db, "products", doc.id), {
                                amount: parseInt(doc.data().amount) - parseInt(amount)
                            })
                        }
                        else {
                            info.current.style.color = "red";
                            info.current.innerHTML = "Brak produktu na stanie!";
                        }
                    });
                })
            }
            else {
                modalData.forEach(async (item) => {
                    await setDoc(doc(db, "products", Date.now() + Math.random().toString()), {
                        amount: item.amount,
                        description: item.desc,
                        img_url: item.img_url,
                        name: item.name,
                        price: item.price,
                        description: item.desc,
                        date: new Date().toISOString().slice(0, 10)
                    });
                })
            }
        }
        catch (e) {
            info.current.style.color = "red";
            info.current.innerHTML = "Wystapil niespodziewany blad";
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
                        fullPrice += parseInt(price);
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
            {clientData.type ? <h2>Uzytkownik chce od ciebie kupic podane wyzej przedmioty</h2> : <h2>Uzytkownik chce ci sprzedac podane wyzej przedmioty</h2>}
            <p>Adres wysylki: {clientData.adres}</p>
            <p>Numer kontaktowy: {clientData.number}</p>
            <p ref={info}></p>
            <form onSubmit={handleSubmit}>
                <input type="submit" className="btn" style={{
                    borderColor: 'green',
                    color: 'green',
                }} value="Zatwierdz" />
            </form>
        </div>
    </div >
}

export default UserModal;