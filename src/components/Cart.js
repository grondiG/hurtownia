import { AiOutlineShoppingCart, AiOutlineClose } from 'react-icons/ai'
import React, { useEffect, useRef, useState } from 'react';



const Cart = ({ setData }) => {
    const cartVal = useRef();
    const [isShown, setIsShown] = useState(false);
    const [update, setUpdate] = useState(0);
    const [cartData, setCartData] = useState(JSON.parse(sessionStorage.getItem("cartData")) || [])
    const [fullPrice, setFullPrice] = useState(0);
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
                <input type="submit" value="Zloz zamowienie" />
                <p className='fullPrice'>{fullPrice}zl</p>
            </div>
        </div>
    </>
}
export default Cart;