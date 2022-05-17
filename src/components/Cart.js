import { AiOutlineShoppingCart, AiOutlineClose } from 'react-icons/ai'
import React, { useEffect, useRef, useState } from 'react';

let cartData = JSON.parse(sessionStorage.getItem("cartData")) || [];
let cartValue = sessionStorage.getItem("cartVal") || 0;


const Cart = () => {
    const cartVal = useRef();
    const [isShown, setIsShown] = useState(false);
    // const [cartData, setCartData] = useState();
    // const [cartValue, setCartValue] = useState(sessionStorage.getItem("cardVal") || 0);
    useEffect(() => {
        cartVal.current.setAttribute('data-value', cartValue);
        cartData = JSON.parse(sessionStorage.getItem("cartData")) || [];
        cartValue = sessionStorage.getItem("cartVal") || 0;
    })

    const handleDelete = (name) => {
        // cartData = cartData.filter((item) => item.name !== name);
        sessionStorage.setItem("cartData", JSON.stringify(cartData.filter((item) => item.name !== name)));
        sessionStorage.setItem("cartVal", cartData.length - 1);
    }

    return <>
        <div className='cart' ref={cartVal} onClick={() => setIsShown(!isShown)}>
            <AiOutlineShoppingCart />
        </div>
        <div className={isShown ? 'cart-menu active' : 'cart-menu'}>
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
        </div>
    </>
}
export default Cart;