import { Link, useNavigate } from "react-router-dom"
import { AiOutlineArrowLeft, AiOutlineLoading } from 'react-icons/ai'
import React, { useState } from 'react';
import app from "./initFirebase";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from 'bcryptjs'

const db = getFirestore(app);

const handleLogin = async (e, login, pass, setIsLoading, setIsError, navigate) => {
    e.preventDefault();
    setIsLoading(true);
    const citiesRef = collection(db, "users");
    const q = query(citiesRef, where("login", "==", login));
    const querySnapshot = await getDocs(q);
    let found = false;
    querySnapshot.forEach((doc) => {
        console.log(bcrypt.compareSync(pass, doc.data().pass));
        console.log("asd");
        if (bcrypt.compareSync(pass, doc.data().pass)) {
            found = true;
            setIsError(false);
            navigate('/general', { state: { login: login }, replace: true });
        }
    })
    if (!found) {
        setIsError(true);
    }
    setIsLoading(false);
}

const Login = () => {
    const [login, setLogin] = useState('');
    const [pass, setPass] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    if (isLoading) {
        return <AiOutlineLoading className="loading" />;
    }
    return <>
        <Link to="/"><AiOutlineArrowLeft className='back-icon' /></Link>
        <div className='panel'>
            <h1>Logowanie</h1>
            <form onSubmit={(e) => handleLogin(e, login, pass, setIsLoading, setIsError, navigate)}>
                <p>Login </p>
                <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
                <p>Haslo </p>
                <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
                {isError && <p style={{ color: "red" }}>Nie poprawny login lub hasło!</p>}
                <input type="submit" value="Zaloguj sie" />
            </form>
        </div>
    </>
}

export default Login;