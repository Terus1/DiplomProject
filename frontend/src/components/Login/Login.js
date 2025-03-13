import './Login.css'

import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('https://127.0.0.1:8000/api/token/', {
        username,
        password,
      });

      console.log(response)
    }
    catch (error) {
      console.error('Произошла ошибка', error)
    }
  }

  return(
    <></>
  )
}


export default Login;
