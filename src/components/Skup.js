import { useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, addDoc, getDocs, where } from "firebase/firestore";
import { GiHamburgerMenu } from 'react-icons/gi'
import React, { useEffect, useRef, useState } from 'react';
import Cart from './Cart';
import app from './initFirebase';

const db = getFirestore(app);

const Skup = () => {

    const [permissions, setPermissions] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [data, setData] = useState({ name: '', price: 1, amount: 1, desc: '', img_url: '', date: new Date().toISOString().slice(0, 10) });
    const [cartVal, setCartVal] = useState(0);
    const [cartData, setCartData] = useState([]);
    const [itemAmount, setItemAmount] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const ref = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data.name !== "" && data.desc !== "" && data.img_url !== "") {
            ref.current.style.color = "green";
            ref.current.innerHTML = "Wyslano zapytanie o transakcje!";
            try {
                const q = query(collection(db, "users"), where("login", "==", location.state.login));
                const querySnapshot = await getDocs(q);
                let tempObj = {};
                querySnapshot.forEach((item) => {
                    tempObj = { adres: item.data().adres, number: item.data().phoneNr };
                })
                await addDoc(collection(db, "transactions"), {
                    clientName: location.state.login,
                    date: new Date().toISOString().slice(0, 10),
                    status: false,
                    items: [data],
                    fullPrice: data.price,
                    phoneNr: tempObj.number,
                    adres: tempObj.adres,
                    type: "sell"
                })
            }
            catch (e) {

            }
        }
        else {
            ref.current.style.color = "red";
            ref.current.innerHTML = "Wypelnij wszystkie pola!";
        }
    }

    return <>
        <div className="header">
            <div className="logo">
                <h1>Hurtownia Spożywcza</h1>
            </div>
            <div className="nav-bar">
                <GiHamburgerMenu class="burger" onClick={() => setShowMenu(!showMenu)} />
            </div>
            <div className={'menu' + (showMenu ? ' active' : '')}>
                <div className="menu-list">
                    <h1>Menu</h1>
                    <ul>
                        <li onClick={() => { navigate('/general', { state: { login: location.state.login, permissions: location.state.permissions, cartData: cartData, cartVal: cartVal } }) }}>Sklep</li>
                        <li onClick={() => { navigate('/skup', { state: { login: location.state.login, permissions: location.state.permissions } }) }}>Skup</li>
                        <li>Zgloś błąd</li>
                        <li onClick={() => { navigate('/user-panel', { state: { login: location.state.login, permissions: location.state.permissions } }) }}>Twoje konto ({location.state.login})</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="content">
            <div className='user-panel'>
                <h1>Skup Spożywczy</h1>
                <img src={data.img_url} alt="Tutaj pokaze sie twoje zdjecie pogladowe" />
                <form onSubmit={handleSubmit}>
                    <p>Nazwa produktu: </p>
                    <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                    <p>Cena produktu w zl: </p>
                    <input type="number" value={data.price} onChange={(e) => setData({ ...data, price: e.target.value })} />
                    <p>Ilosc w kg: </p>
                    <input type="number" min={1} value={data.amount} onChange={(e) => setData({ ...data, amount: e.target.value })} />
                    <p>Opis produktu: </p>
                    <input type="text" value={data.desc} onChange={(e) => setData({ ...data, desc: e.target.value })} />
                    <p>Link do zdjecia pogladowego: </p>
                    <input type="text" value={data.img_url} onChange={(e) => setData({ ...data, img_url: e.target.value })} />
                    <p ref={ref}></p>
                    <input type="submit" onClick={() => console.log(data)} value="Przeslij propozycje" />
                </form>
            </div>

        </div>
        <Cart setData={setCartData} data={cartData} clientName={location.state.login} />
    </>
}

export default Skup;