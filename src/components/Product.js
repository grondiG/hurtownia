import { useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import useNetwork from "./hooks/useOnlineStatus";
import { GiHamburgerMenu } from 'react-icons/gi'
import React, { useEffect, useState } from 'react';
import Cart from './Cart';

const db = getFirestore();

const Product = () => {
    const [permissions, setPermissions] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [data, setData] = useState({});
    const [cartVal, setCartVal] = useState(0);
    const [cartData, setCartData] = useState([]);
    const [itemAmount, setItemAmount] = useState(1);
    const navigate = useNavigate();
    const isOnline = useNetwork();

    const getData = async () => {
        setData({
            name: location.state.name,
            price: location.state.price,
            description: location.state.description,
            img_url: location.state.img_url,
            amount: location.state.amount,
            date: location.state.date
        })
        const citiesRef = collection(db, "users");
        const q = query(citiesRef, where("login", "==", location.state.login));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setPermissions(doc.data().permissions)
        })
        setCartVal(sessionStorage.getItem("cartVal") || 0);
        setCartData(JSON.parse(sessionStorage.getItem("cartData")) || []);
    }
    useEffect(() => {
        getData();
    }, []);

    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();
        let tempArr = cartData;
        console.log(tempArr);
        let isAdded = false;
        tempArr.forEach((item) => {
            if (item.name === location.state.name) {
                item.amount += parseInt(itemAmount);
                item.price = item.amount * location.state.price;
                isAdded = true;
                setCartData(tempArr)
            }
        })
        if (!isAdded) {
            let tempData = {
                name: location.state.name,
                price: location.state.price * itemAmount,
                img_url: location.state.img_url,
                amount: itemAmount
            }
            tempArr = [...cartData, tempData];
            setCartData([...cartData, tempData]);
        }
        sessionStorage.setItem("cartData", JSON.stringify(tempArr));
        sessionStorage.setItem("cartVal", tempArr.length);
        setCartVal(tempArr.length);

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
                        <li onClick={() => { navigate('/general', { state: { login: location.state.login, permissions: permissions, cartData: cartData, cartVal: cartVal, data: location.state.data } }) }}>Sklep</li>
                        {navigator.onLine && <li onClick={() => { navigate('/skup', { state: { login: location.state.login, permissions: permissions } }) }}>Skup</li>}
                        <li>Zgloś błąd</li>
                        {navigator.onLine && <li onClick={() => { navigate('/user-panel', { state: { login: location.state.login, permissions: permissions } }) }}>Twoje konto ({location.state.login})</li>}
                    </ul>
                </div>
            </div>
        </div>
        <div className="content">
            <div className="content-panel prod">
                <div className='single-product'>
                    <div className='img-info'>
                        <img src={data.img_url} alt={data.name} />
                    </div>
                    <div className='product-info'>
                        <h1>{data.name}</h1>
                        <p>{data.price}zł/kg</p>
                        <p>{data.description}</p>
                        <form onSubmit={(e) => handleSubmit(e)} style={{ "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            <input type="number" placeholder='Ilość w kg' style={{ width: "30%" }} min="1" value={itemAmount} onChange={(e) => setItemAmount(e.target.value)} />
                            <input type='submit' value='Dodaj do koszyka' />
                        </form>
                        <p style={{ color: "#827F7F", fontSize: '.9rem' }}>Data dodania: {data.date}</p>
                    </div>
                </div>
            </div>
        </div>
        {navigator.onLine && <Cart setData={setCartData} data={cartData} clientName={location.state.login} />}
    </>
}

export default Product;