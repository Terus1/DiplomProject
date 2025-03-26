import "./AuthMain.css";
import axios from "axios";
import { useEffect, useState } from "react";
import GeneralInformation from "../GeneralInformation/GeneralInformation";
import TechnicalMaintenance from "../TechnicalMaintenance/TechnicalMaintenance";
import Complaint from "../Complaint/Complaint";

function AuthMain({ user, cars, setCars, error, setError, token, loading, setLoading, groups }) {
    const [activeTab, setActiveTab] = useState("general");
    const [isLoadingCars, setIsLoadingCars] = useState(true);

    const [techniques, setTechniques] = useState([]);
    const [engines, setEngines] = useState([]);
    const [transmissions, setTransmissions] = useState([]);
    const [drivingBridges, setDriveBridges] = useState([]);
    const [controlledBridges, setControlledBridges] = useState([]);
    const [clients, setClients] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [serviceCompanies, setServiceCompanies] = useState([]);
    const [technicalMaintenances, setTechnicalMaintenances] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [typeOfMaintenances, setTypeOfMaintenances] = useState([]);
    const [failureNodes, setFailureNodes] = useState([]);
    const [recoveryMethods, setRecoveryMethods] = useState([]);



    const fetchCars = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/cars/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            // console.log("Данные машин из AutMain", response.data);
            setCars(response.data);
            setError(null);

        } catch (error) {
            console.error("Ошибка при получении машин", error);
            setError("Ошибка загрузки данных. Попробуйте позже.");
        } finally {
            setIsLoadingCars(false);
        }
    };

    // Загружаем машины
    useEffect(() => {
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

            const responseTransmissions = await fetch('http://127.0.0.1:8000/api/transmissions/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            const responseDrivingBridges = await fetch('http://127.0.0.1:8000/api/driving-bridges/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            const responseControlledBridges = await fetch('http://127.0.0.1:8000/api/controlled-bridges/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

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

            const responseRecipients = await fetch('http://127.0.0.1:8000/api/recipients/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const responseTechnicalMaintenance = await fetch('http://127.0.0.1:8000/api/technical-maintenances/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            const responseComplaints = await fetch('http://127.0.0.1:8000/api/complaints/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const responseTypeOfMaintenances = await fetch('http://127.0.0.1:8000/api/type_of_maintenances/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            const responseFailureNodes = await fetch('http://127.0.0.1:8000/api/failure_nodes/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            const responseRecoveryMethods = await fetch('http://127.0.0.1:8000/api/recovery_methods/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            // Ожидание всех ответов
            const [dataTechniques, dataEngines, dataTransmissions, dataDrivingBridges, dataControlledBridges,
                dataClients, dataRecipients, dataServiceCompanies,
                dataTechnicalMaintenance, dataComplaints, dataTypeOfMaintenances, dataFailureNodes, dataRecoveryMethod] = await Promise.all([
                responseTechniques.json(),
                responseEngines.json(),
                responseTransmissions.json(),
                responseDrivingBridges.json(),
                responseControlledBridges.json(),
                responseClients.json(),
                responseRecipients.json(),
                responseServiceCompanies.json(),
                responseTechnicalMaintenance.json(),
                responseComplaints.json(),
                responseTypeOfMaintenances.json(),
                responseFailureNodes.json(),
                responseRecoveryMethods.json(),
            ]);
            // Сохраняем данные в состояние
            setTechniques(dataTechniques);
            setEngines(dataEngines);
            setTransmissions(dataTransmissions);
            setDriveBridges(dataDrivingBridges);
            setControlledBridges(dataControlledBridges);
            setClients(dataClients);
            setRecipients(dataRecipients);
            setServiceCompanies(dataServiceCompanies);
            setTechnicalMaintenances(dataTechnicalMaintenance);
            setComplaints(dataComplaints);
            setTypeOfMaintenances(dataTypeOfMaintenances);
            setFailureNodes(dataFailureNodes);
            setRecoveryMethods(dataRecoveryMethod);

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
                                                                    clients={clients} recipients={recipients} serviceCompanies={serviceCompanies}
                                                                    fetchData={fetchData} groups={groups} fetchCars={fetchCars}
                    />}
                    {activeTab === "technical" && <TechnicalMaintenance user={user} cars={cars}
                                                                        technicalMaintenances={technicalMaintenances}
                                                                        error={error} typeOfMaintenances={typeOfMaintenances}
                                                                        serviceCompanies={serviceCompanies}
                                                                        fetchData={fetchData} groups={groups}/>}

                    {activeTab === "complaints" && <Complaint user={user} cars={cars} complaints={complaints}
                                                              groups={groups} failureNodes={failureNodes}
                                                              recoveryMethods={recoveryMethods}
                                                              serviceCompanies={serviceCompanies} fetchData={fetchData} error={error}/>}
                </>
            )}
        </>
    );
}

export default AuthMain;
