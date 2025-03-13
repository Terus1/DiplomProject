import './Header.css'
import LogoHeader from '../../media/logo.png'
import {Link} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {useEffect, useState} from "react";
import axios from "axios";

function Header({handleLogout, navigate, user, setUser, token}) {
    const [groups, setGroups] = useState([]); // Список групп пользователя

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user/groups/', {
                    headers: {Authorization: `Bearer ${token}`}
                })
                // console.log('response', response)
                // console.log('Группы пользователя', user.username, '=>', response.data.groups)
                setGroups(response.data.groups)
            } catch (error) {
                console.error('Ошибка при получении групп пользователя', error)
            }
        }
        if (token) {
            fetchGroups();
        }
    }, [user]);

    const logout = () => {
        handleLogout()
        setUser(null);
        navigate('/')
    }

    return (
        <div className={'header'}>
            <div className="header-elements">
                <img src={LogoHeader} alt="logo-header" className={'logo-header'}/>
                <div className="contacts">+7-8532-20-12-09, <a href="#">telegram</a></div>

                {user ? (<div className={'authorized-user'}><p>Пользователь, <strong>{user.username}</strong>
                И его группы {groups.length > 0 ? (
                    groups.map((group) => (
                        <div key={group.id}>
                            <p>{group.name} - {group.id}</p>
                        </div>


                    ))
                            ) : (<></>)}

                </p>
                            <button onClick={logout}>Выйти</button></div>
                    ) :
                    (<Link to={'/authorization/'}> <p className={'authorization'}> Авторизация </p></Link>
                )}

                {/*<a href="#" className="authorization">Авторизация</a>*/}
            </div>

            <div className="header-text">Электронная сервисная книжка "Мой Силант"</div>
        </div>
    )
}


export default Header;
