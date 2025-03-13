import './Authorization.css'
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

function Authorization({username, setUsername, password, setPassword, user, setUser, navigate}) {

    // const login = (e) => {
    //     handleLogin(e)
    //     setUser(username)
    //     navigate('/')
    // }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password,
            });

            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
            setUser(JSON.parse(response.config.data))
            navigate("/");
            // console.log('response api/token/', response)
            // console.log('пытаюсь найти имя пользователя', JSON.parse(response.config.data))
        }
        catch (error) {
            console.error('Произошла ошибка', error)
        }
    }

    return (
        <div className={'authorization-component'}>

            <div className={'authorization-container'}>
                <p className={'authorization-head'}>Авторизация</p>
                <div className="authorization-body">


                        <div className="login-container">
                            <p className={'authorization-login'}>Логин:</p>
                            <input type="text" className={'input-login'} value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>

                        <div className="password-container">
                            <p className={'authorization-password'}>Пароль:</p>
                            <input type="password" className={'input-password'} value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>

                        <div className="button-container">

                                <button onClick={handleLogin} className="enter">Войти</button>

                        </div>



                </div>
            </div>
        </div>
    )
}


export default Authorization;
