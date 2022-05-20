import React, { useState, useRef, useEffect } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi'
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDocs, getFirestore, collection } from "firebase/firestore";
import UserModal from './UserModal';
import app from './initFirebase';

const db = getFirestore(app);

const UserPanel = () => {
    const [showMenu, setShowMenu] = useState(false);

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState(1);
    const [price, setPrice] = useState(1);
    const [imgUrl, setImgUrl] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([]);

    const [data, setData] = useState([]);

    const info = useRef();

    const navigate = useNavigate();
    const location = useLocation();

    const fetchData = async () => {
        let tempArr = [];
        const docRef = await getDocs(collection(db, "transactions"));
        docRef.forEach((doc) => {
            tempArr.push(doc.data());
        })
        console.log(tempArr);
        setData(tempArr);
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handleLogOut = () => {
        navigate('/');
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name !== '' && desc !== '' && imgUrl !== '') {
            try {
                await setDoc(doc(db, "products", Date.now() + Math.random().toString()), {
                    amount: amount,
                    description: desc,
                    img_url: imgUrl,
                    name: name,
                    price: price,
                    date: new Date().toISOString().slice(0, 10)
                });
                info.current.innerHTML = "Pomyslnie dodano!";
                info.current.style.color = "green";
                setAmount(1);
                setDesc('');
                setImgUrl('');
                setName('');
                setPrice(1);
            }
            catch (e) {
                info.current.innerHTML = e.toString();
                info.current.style.color = "red";
            }
        }
        else {
            info.current.innerHTML = "Wypelnij wszystkie pola!";
            info.current.style.color = "red";
        }
    }

    const handleModal = (e, items) => {
        setModalData(items);
        setShowModal(true);

    }

    return <>
        <div className="header">
            <div className="logo">
                <h1>Hurtownia Spożywcza</h1>
            </div>
            <div className="nav-bar">
                <GiHamburgerMenu className="burger" onClick={() => setShowMenu(!showMenu)} />
            </div>
            <div className={'menu' + (showMenu ? ' active' : '')}>
                <div className="menu-list">
                    <h1>Menu</h1>
                    <ul>
                        <li onClick={() => { navigate('/general', { state: { login: location.state.login, permissions: location.state.permissions } }) }}>Sklep</li>
                        <li>Zgloś błąd</li>
                        <li onClick={() => { navigate('/user-panel', { state: { login: location.state.login, permissions: location.state.permissions } }) }}>Twoje konto ({location.state.login})</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className='user-body'>
            <div className="user-panel">
                <h1>Witaj {location.state.login} w menu twojego konta!</h1>
                <input type="button" value="Wyloguj się!" onClick={handleLogOut} />
            </div>
            {location.state.permissions > 0 && <div className="user-panel">
                <h1>Dodaj produkty do bazy danych!</h1>
                <form onSubmit={handleSubmit}>
                    <p>Nazwa produktu: </p>
                    <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} />
                    <p>Opis: </p>
                    <input type="text" value={desc} onChange={(e) => { setDesc(e.target.value) }} />
                    <p>Ilość w kg: </p>
                    <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value) }} min="1" />
                    <p>Cena za kg w zł: </p>
                    <input type="number" value={price} onChange={(e) => { setPrice(e.target.value) }} min="1" />
                    <p>Link do zdjęcia poglądowego: </p>
                    <input type="text" value={imgUrl} onChange={(e) => { setImgUrl(e.target.value) }} />
                    <p ref={info}></p>
                    <input type="submit" value="Dodaj" />
                </form>
            </div>}
            {
                location.state.permissions > 1 && <div className="user-panel">
                    <h1>Propozycje transakcji: </h1>
                    <div className="offers">
                        {data.map((item, key) => {
                            const { clientName, date, fullPrice, items, status } = item;
                            return <div className='offerBtn' onClick={() => handleModal(items)}>
                                <p>Nazwa klienta: {clientName}</p>
                                <p>Cena ogólna: {fullPrice}zł</p>
                                <p>Data: {date}</p>
                                <p>Stan: {status ? '✅' : '❌'}</p>
                            </div>
                        })}
                    </div>
                    <UserModal showModal={showModal} setShowModal={setShowModal} modalData={modalData} />
                </div>
            }
        </div>
    </>
}

export default UserPanel;