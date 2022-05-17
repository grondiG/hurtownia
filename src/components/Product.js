import { useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { GiHamburgerMenu } from 'react-icons/gi'
import React, { useEffect, useState } from 'react';
import Cart from './Cart';

const db = getFirestore();

const General = () => {
    const [permissions, setPermissions] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [data, setData] = useState({});
    const [cartVal, setCartVal] = useState(0);
    const [cartData, setCartData] = useState([]);
    const [itemAmount, setItemAmount] = useState(1);
    const navigate = useNavigate();

    const getData = async () => {
        setData({
            name: location.state.name,
            price: location.state.price,
            description: location.state.description,
            img_url: location.state.img_url,
            amount: location.state.amount
        })
        const citiesRef = collection(db, "users");
        const q = query(citiesRef, where("login", "==", location.state.login));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setPermissions(doc.data().permissions)
        })
        setCartVal(location.state.cartVal || 0);
        setCartData(location.state.cartData || []);
    }
    useEffect(() => {
        getData();
    }, []);

    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();
        let tempArr = cartData;
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
        sessionStorage.setItem("cartData", cartData);
        sessionStorage.setItem("cartVal", cartVal);
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
                        <li onClick={() => { navigate('/general', { state: { login: location.state.login, permissions: permissions, cartData: cartData, cartVal: cartVal } }) }}>Sklep</li>
                        <li>Zgloś błąd</li>
                        <li onClick={() => { navigate('/user-panel', { state: { login: location.state.login, permissions: permissions } }) }}>Twoje konto ({location.state.login})</li>
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
                    </div>
                </div>
            </div>
        </div>
        <Cart />
    </>
}

export default General;