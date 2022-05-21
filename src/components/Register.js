import { Link, useNavigate } from "react-router-dom"
import { AiOutlineArrowLeft, AiOutlineLoading } from 'react-icons/ai'
import { collection, query, where, getFirestore, getDocs, doc, setDoc } from "firebase/firestore";
import React, { useState } from 'react';
import app from './initFirebase.js';
import bcrypt from 'bcryptjs'

const db = getFirestore(app);



const validatePassword = (pass) => {
    const RegPass = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})");
    if (RegPass.test(pass)) {
        return true;
    }
    else {
        return false;
    }
}
const validateMail = (mail) => {
    const RegMail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    if (RegMail.test(mail)) {
        return true;
    }
    else {
        return false;
    }
}
const validateLogin = async (login) => {
    const citiesRef = collection(db, "users");
    const q = query(citiesRef, where("login", "==", login));
    const querySnapshot = await getDocs(q);
    let licznik = 0;
    querySnapshot.forEach((doc) => {
        licznik++;
    })
    if (licznik > 0) {
        return false;
    }
    else {
        return true;
    }
}

const Register = () => {
    const [login, setLogin] = useState('');
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState('');
    const [phoneNr, setPhoneNr] = useState('');
    const [adres, setAdres] = useState('');
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isErr, setIsErr] = useState(false);
    const navigate = useNavigate();

    const handleButton = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (validatePassword(pass) && validateMail(mail) && await validateLogin(login) && phoneNr !== '' && adres !== '') {
            setIsErr(false);
            const hashedPassword = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
            await setDoc(doc(db, "users", String(Date.now() + Math.random())), {
                login: login,
                mail: mail,
                pass: hashedPassword,
                phoneNr: phoneNr,
                adres: adres,
                permissions: 0
            })
            navigate('/general', { state: { login: login }, replace: true });

            // console.log(bcrypt.compareSync(pass, hashedPassword));
        }
        else {
            setIsErr(true);
        }
        setIsLoading(false);
    }

    if (isLoading) {
        return <AiOutlineLoading className="loading" />;
    }
    return <>
        <Link to="/"><AiOutlineArrowLeft className='back-icon' /></Link>
        <div className='panel'>
            <h1>Rejestracja</h1>
            <form onSubmit={handleButton}>
                <p>Login </p>
                <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
                <p>E-mail </p>
                <input type="text" value={mail} onChange={(e) => setMail(e.target.value)} className={"btn" + (validateMail(mail) ? "" : " active")} />
                <p>Adres zamieszkania</p>
                <input type="text" value={adres} onChange={(e) => setAdres(e.target.value)} className="btn" />
                <p>Numer telefonu</p>
                <input type="text" value={phoneNr} onChange={(e) => setPhoneNr(e.target.value)} className="btn" />
                <p>Haslo </p>
                <input type="password"
                    value={pass} onChange={(e) => setPass(e.target.value)} className={"btn" + (validatePassword(pass) ? "" : " active")} />
                <p onClick={() => setShow(!show)}>Co powinno zawierać hasło?</p>
                {show ? <p>Hasło powinno mieć 8 znaków, conajmniej 1 dużą oraz małą literę a także znak specjalny</p> : <p></p>}
                {isErr && <p style={{ color: "red" }}>Niepoprawne dane lub taki login już istnieje! (upewnij sie ze wszystkie pola sa wypelnione)</p>}
                <input type="submit" value="Stwórz konto" />
            </form>
        </div>
    </>
}

export default Register;