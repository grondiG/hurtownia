import React from 'react';
import { Link } from "react-router-dom"

const Main = () => {
    return (
        <>
            <div>
                <Link to="/login"><input type="button" value="Logowanie" /></Link>
                <Link to="/register"><input type="button" value="Rejestracja" /></Link>
            </div>
        </>
    )
}

export default Main;