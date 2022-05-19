import { useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineLoading } from 'react-icons/ai'
import Cart from './Cart';
import React, { useEffect, useState } from 'react';

const db = getFirestore();

let mainTab = [];

const General = () => {
    const [permissions, setPermissions] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [data, setData] = useState([]);
    const [value, setValue] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [cartVal, setCartVal] = useState(0);
    const [cartData, setCartData] = useState([]);
    const navigate = useNavigate();
    const getData = async () => {
        console.log(typeof location.state.login);
        const citiesRef = collection(db, "users");
        const q = query(citiesRef, where("login", "==", location.state.login));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setPermissions(doc.data().permissions)
        })
        let tempData = [];
        const productsRef = collection(db, "products");
        const q2 = query(productsRef, orderBy('date'));
        const queryProducts = await getDocs(q2);
        queryProducts.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            tempData.push(doc.data());

        });
        setData(tempData);
        mainTab = tempData;
        setIsLoaded(true);
    }
    const handleSearch = (searchData) => {
        console.log(searchData)
        if (searchData === '') {
            setData(mainTab);
        }
        else {
            setData(data.filter(product => product.name.toLowerCase().includes(searchData)));
        }
    }
    useEffect(() => {
        console.log(typeof location.state.login)

        getData();

    }, []);

    const location = useLocation();

    if (typeof location.state.login === 'null') {
        return <h1>naaah</h1>
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
                        <li onClick={() => { navigate('/general', { state: { login: location.state.login, permissions: permissions } }) }}>Sklep</li>
                        <li>Zgloś błąd</li>
                        <li onClick={() => { navigate('/user-panel', { state: { login: location.state.login, permissions: permissions } }) }}>Twoje konto ({location.state.login})</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="content">
            <div className="search-panel">
                <input type="text" className='search-bar' onChange={(e) => { handleSearch(e.target.value) }} placeholder='Wyszukaj' />
            </div>
            <div className="content-panel">
                {!isLoaded && <AiOutlineLoading className="loading general" />}
                {data.map((item, index) => {
                    const { img_url, amount, name, description, price, date } = item;
                    return <div className="product" onClick={() => navigate('/product', { state: { login: location.state.login, permissions: permissions, img_url: img_url, amount: amount, name: name, description: description, price: price, date: date, cartData: location.state.cartData || [], cartVal: location.state.cartVal || 0 } })}>
                        <img src={img_url} alt={name} />
                        <p>{name} {price}zł/kg</p>
                        <input type="button" value="Zobacz więcej" />
                    </div>
                })}
            </div>
        </div>
        <Cart setData={setCartData} data={cartData} />
    </>
}

export default General;