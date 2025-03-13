import './App.css';
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import {Route, Routes, useNavigate} from "react-router-dom";
import Authorization from "./components/Authorization/Authorization";
import useAuth from "./hooks/useAuth";
import AuthMain from "./components/AuthMain/AuthMain";
import axios from "axios";
import {useEffect, useState} from "react";


function App() {
  const {user, setUser, loading, setLoading} = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");


  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    delete axios.defaults.headers.common["Authorization"]
    setUser(null);
  }

  // console.log('user', user)

  if (loading) {
    return <p>Загрузка...</p>
  }


  return (
    <>
      <div className="app-container">
        <Header handleLogout={handleLogout} navigate={navigate} user={user} setUser={setUser} token={token}/>

        <div className="app-main-content">
        <Routes>

          <Route path={'/'} element={user ? <AuthMain user={user} cars={cars} setCars={setCars} error={error} setError={setError} token={token} loading={loading} setLoading={setLoading}/> :
            <Main cars={cars} setCars={setCars} error={error} setError={setError} token={token}/>}></Route>

          <Route path={'/authorization'} element={<Authorization
            // handleLogin={handleLogin}
          handleLogout={handleLogout}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          user={user}
          setUser={setUser}
          navigate={navigate}/>}></Route>

        </Routes>

        </div>

        <div className="app-footer">
          <Footer />
        </div>

      </div>
    </>
  );
}

export default App;
