import "./AuthMain.css";
import axios from "axios";
import { useEffect, useState } from "react";
import GeneralInformation from "../GeneralInformation/GeneralInformation";
import TechnicalMaintenance from "../TechnicalMaintenance/TechnicalMaintenance";
import Complaint from "../Complaint/Complaint";

function AuthMain({ user, cars, setCars, error, setError, token, loading, setLoading }) {
    const [activeTab, setActiveTab] = useState("general");
    const [isLoadingCars, setIsLoadingCars] = useState(true);

    const [techniques, setTechniques] = useState([]);
    const [engines, setEngines] = useState([]);
    const [transmissions, setTransmissions] = useState([]);
    const [drivingBridges, setDriveBridges] = useState([]);
    const [controlledBridges, setControlledBridges] = useState([]);
    const [clients, setClients] = useState([]);
    const [serviceCompanies, setServiceCompanies] = useState([]);


    // Загружаем машины
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/cars/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Данные машин", response.data);
                setCars(response.data);
                setError(null);

            } catch (error) {
                console.error("Ошибка при получении машин", error);
                setError("Ошибка загрузки данных. Попробуйте позже.");
            } finally {
                setIsLoadingCars(false);
            }
        };

        if (token) {
            fetchCars();
        }
    }, [token]);

    // Загружаем данные о машине
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access_token');

            // Запросы на получение данных
            const responseTechniques = await fetch('http://127.0.0.1:8000/api/techniques/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const responseEngines = await fetch('http://127.0.0.1:8000/api/engines/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const responseClients = await fetch('http://127.0.0.1:8000/api/clients/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const responseServiceCompanies = await fetch('http://127.0.0.1:8000/api/service-companies/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Ожидание всех ответов
            const [dataTechniques, dataEngines, dataClients, dataServiceCompanies] = await Promise.all([
                responseTechniques.json(),
                responseEngines.json(),
                responseClients.json(),
                responseServiceCompanies.json(),
            ]);
            // Сохраняем данные в состояние
            setTechniques(dataTechniques);
            setEngines(dataEngines);
            setClients(dataClients);
            setServiceCompanies(dataServiceCompanies);



            // Завершаем процесс загрузки
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            setLoading(false);
        }
    };

    // Загружаем данные при монтировании компонента
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <p className="who-logged-in-from">
                {loading || !user?.id ? 'Загрузка' : `Текущий пользователь: ${user.nickname}`}
            </p>

            <p className="info-about-car">
                Информация о комплектанции и технических характеристиках Вашей техники
            </p>

            <div className="info-navigation-about-car">
                <button
                    className={`general-info ${activeTab === "general" ? "active" : ""}`}
                    onClick={() => setActiveTab("general")}
                >
                    Общая информация
                </button>
                <button
                    className={`technical-maintenance-info ${activeTab === "technical" ? "active" : ""}`}
                    onClick={() => setActiveTab("technical")}
                >
                    ТО
                </button>
                <button
                    className={`complaints-info ${activeTab === "complaints" ? "active" : ""}`}
                    onClick={() => setActiveTab("complaints")}
                >
                    Рекламации
                </button>
            </div>

            {isLoadingCars ? (
                <p>Загрузка данных о машинах...</p>
            ) : (
                <>
                    {activeTab === "general" && <GeneralInformation user={user} cars={cars} setCars={setCars} error={error} techniques={techniques}
                                                                    engines={engines} transmissions={transmissions}
                                                                    drivingBridges={drivingBridges} controlledBridges={controlledBridges}
                                                                    clients={clients} serviceCompanies={serviceCompanies}
                                                                    fetchData={fetchData}
                    />}
                    {activeTab === "technical" && <TechnicalMaintenance />}
                    {activeTab === "complaints" && <Complaint />}
                </>
            )}
        </>
    );
}

export default AuthMain;
