import { useEffect, useState } from "react";

// Хук useAuth для обработки аутентификации и получения данных о текущем пользователе
const useAuth = () => {
  const [user, setUser] = useState(null); // Стейт для хранения данных пользователя
  const [loading, setLoading] = useState(true); // Стейт для отслеживания процесса загрузки данных

  // Функция для обновления refresh-токена
  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh_token"); // Получаем refresh-токен из localStorage

    if (!refresh) {
      console.warn("❌ Нет refresh-токена!");
      localStorage.removeItem("access_token"); // Удаляем старый access-токен
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
      });

      if (!response.ok) {
        console.error("❌ Ошибка обновления токена");
        localStorage.removeItem("access_token");
        return;
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      // console.log("✅ Токен обновлен!");
      return data.access;
    } catch (error) {
      console.error("❌ Ошибка сети при обновлении токена", error);
    }
  };

  useEffect(() => {
    // Попытка загрузить данные пользователя из localStorage, если они там есть
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Если данные пользователя есть, загружаем их в стейт
      setLoading(false); // Загружены данные, убираем "Загрузка..."
    } else {
      setLoading(false); // Если данных нет, просто меняем состояние загрузки
    }
  }, []); // Эта часть работает один раз при монтировании компонента

  useEffect(() => {
    // Если данные пользователя изменяются, сохраняем их в localStorage
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // Сохраняем данные в localStorage
    } else {
      localStorage.removeItem("user"); // Если пользователь вышел, удаляем данные из localStorage
    }
  }, [user]); // Эта часть срабатывает каждый раз, когда меняется state 'user'

  // Функция для получения данных пользователя
  const fetchUserData = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      let response = await fetch("http://127.0.0.1:8000/api/user/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok && (response.status === 401 || response.status === 403)) {
        console.warn("❌ Токен недействителен. Пробуем обновить...");
        const newToken = await refreshToken();
        if (newToken) {
          response = await fetch("http://127.0.0.1:8000/api/user/", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
          });
        }
      }

      if (!response.ok) {
        throw new Error("Ошибка при получении данных пользователя");
      }

      const data = await response.json();
      setUser(data); // Обновляем стейт с данными пользователя
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Если access_token есть в localStorage, пытаемся загрузить данные пользователя
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUserData();
    } else {
      setLoading(false); // Если токен нет, просто завершаем загрузку
    }
  }, [localStorage.getItem('access_token')]); // Эта часть запускается только один раз при монтировании компонента


  return { user, setUser, loading, setLoading };
};

export default useAuth;
