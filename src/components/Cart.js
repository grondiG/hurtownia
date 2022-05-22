import { AiOutlineShoppingCart, AiOutlineClose } from 'react-icons/ai'
import { collection, addDoc, getFirestore, query, where, getDocs } from "firebase/firestore";
import app from './initFirebase';
import React, { useEffect, useRef, useState } from 'react';

const db = getFirestore(app);



const Cart = ({ setData, clientName }) => {
    const cartVal = useRef();
    const [isShown, setIsShown] = useState(false);
    const [update, setUpdate] = useState(0);
    const [cartData, setCartData] = useState(JSON.parse(sessionStorage.getItem("cartData")) || [])
    const [fullPrice, setFullPrice] = useState(0);

    const [showErr, setShowErr] = useState(false);

    const cartMenu = useRef();
    const cartIcon = useRef();
    // const [cartData, setCartData] = useState();
    const [cartValue, setCartValue] = useState(sessionStorage.getItem("cartVal") || 0);

    useEffect(() => {
        cartVal.current.setAttribute('data-value', sessionStorage.getItem("cartVal") || 0);
    });

    useEffect(() => {
        document.body.addEventListener('click', handleClick);
        return () => {
            document.body.removeEventListener('click', handleClick);
        }
    }, [])

    const handleClick = (e) => {
        console.log(cartMenu.current.contains(e.target))
        if (!cartMenu.current.contains(e.target) && e.target !== cartVal.current && e.target.parentNode !== cartVal.current) {
            setIsShown(false);
        }
    };

    const handleDelete = (name) => {
        // cartData = cartData.filter((item) => item.name !== name);
        cartData.forEach((item) => {
            if (item.name === name) {
                setFullPrice(fullPrice - parseInt(item.price))
                console.log(typeof (fullPrice - parseInt(item.price)));
            }
        })
        setUpdate(cartData.length - 1);
        setData(cartData.filter((item) => item.name !== name));
        setCartData(cartData.filter((item) => item.name !== name));
        setCartValue(cartData.length - 1)
        sessionStorage.setItem("cartData", JSON.stringify(cartData.filter((item) => item.name !== name)));
        sessionStorage.setItem("cartVal", cartData.length - 1);

    }
    const handleAdd = () => {
        let tempArr = JSON.parse(sessionStorage.getItem("cartData")) || [];
        setIsShown(!isShown);
        setCartData(tempArr);
        setCartValue(sessionStorage.getItem("cartVal") || 0)
        let count = 0;
        tempArr.forEach((item) => {
            count += item.price;
        })
        setFullPrice(count);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const q = query(collection(db, "users"), where("login", "==", clientName));
        const querySnapshot = await getDocs(q);
        let tempObj = {};
        querySnapshot.forEach((item) => {
            tempObj = { adres: item.data().adres, number: item.data().phoneNr };
        })
        console.log(tempObj)
        if (tempObj.adres !== "" && tempObj.number !== "") {
            await addDoc(collection(db, 'transactions'), {
                clientName: clientName,
                date: new Date().toISOString().slice(0, 10),
                status: false,
                items: cartData,
                fullPrice: fullPrice,
                phoneNr: tempObj.number,
                adres: tempObj.adres
            })
            setCartData([]);
            setCartValue(0);
            setFullPrice(0);
            sessionStorage.setItem("cartData", JSON.stringify([]));
            sessionStorage.setItem("cartVal", 0);
            setShowErr(false);
        }
        else {
            setShowErr(true);
        }
    }

    return <>
        <div className='cart' ref={cartVal} onClick={handleAdd}  >
            <AiOutlineShoppingCart ref={cartIcon} />
        </div>
        <div className={isShown ? 'cart-menu active' : 'cart-menu'} ref={cartMenu}>
            <div className='cart-info'>
                <h2>Ilość produktów w koszyku: {cartValue}</h2>
            </div>
            <div className='cart-products'>
                {cartData.map((item, index) => {
                    const { name, price, img_url, amount } = item;

                    return <div className="cart-product">
                        <div className="img-info">
                            <img src={img_url} alt="asd" />
                        </div>
                        <div className="product-info">
                            <p>{name}</p>
                            <p>{amount}kg</p>
                            <p>{price}zl</p>
                        </div>

                        <div className="close" onClick={() => { handleDelete(name); }}>
                            <AiOutlineClose />
                        </div>
                    </div>
                })}
            </div>
            <div className='cart-confirm'>
                {showErr && <p style={{ color: "red" }}>Najpierw wprowadz numer telefonu i adres w zakladce uzytkownika</p>}
                <form onSubmit={handleSubmit}>
                    <input type="submit" value="Zloz zamowienie" />
                    <p className='fullPrice'>{fullPrice}zl</p>
                </form>
            </div>
        </div>
    </>
}
export default Cart;