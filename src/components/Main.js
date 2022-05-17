import React from 'react';
import { Link } from "react-router-dom"

const Main = () => {
    return (
        <>
            <img src="https://m.media-amazon.com/images/I/41vcHNN5TPL._AC_SY580_.jpg" alt='asd' />
            <div>
                <Link to="/login"><input type="button" value="Logowanie" /></Link>
                <Link to="/register"><input type="button" value="Rejestracja" /></Link>
            </div>
        </>
    )
}

export default Main;