import './TechnicalMaintenance.css'
import {useEffect, useState} from "react";

function TechnicalMaintenance({user, cars, technicalMaintenances, error, typeOfMaintenances, serviceCompanies, fetchData}) {
    const [userTechnicalMaintenances, setUserTechnicalMaintenances] = useState([]);
    const [editTM, setEditTM] = useState(null) // Данные редактируемого ТО
    const [updatedData, setUpdatedData] = useState({
        type_of_maintenance: {},
        organization_carried_out_maintenance: {},
        to_car: {},
        service_company: {},
    }); // Измененные данные
    const [isModalOpenForChangeTM, setIsModalOpenForChangeTM] = useState(false);    // Состояние для показа модуля редактирования ТОО
    const [modalType, setModalType] = useState(""); // Тип модального окна
    const [selectedModel, setSelectedModel] = useState(""); // Выбранная модель
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenForModel, setIsModalOpenForModel] = useState(false);
    const [editMaintenance, setEditMaintenance] = useState(null); // Данные редактируемой машины
    const [descriptionSelectedModel, setDescriptionSelectedModel] = useState("")


    // Функция для открытия модального окна
    const openModal = (type, model) => {
        setModalType(type)
        setSelectedModel(model)
        setIsModalOpen(true);
    }

    // Функция для закрытия модального окна
    const closeModal = () => {
        setIsModalOpen(false);
        setIsModalOpenForModel(false)
        setIsModalOpenForChangeTM(false);
    }

    // Функция для открытия формы редактирования
    const openEditModal = (tm) => {
        setEditTM(tm);  // Заполняем данные текущего ТО
        setUpdatedData(tm); // Заполняем форму текущими данными
        setIsModalOpenForChangeTM(true);
    }

    // Функция для открытия модального окна для моделей запчастей машины
    const openWindowForModel = (type, model, description) => {
        setModalType(type);
        setSelectedModel(model);
        setDescriptionSelectedModel(description);
        setIsModalOpenForModel(true);
    }

    // Функция для изменения данных ТО
    const handleChange = (e) => {
        const { name, value } = e.target;

        setUpdatedData((prevData) => {
            // Для полей, связанных с моделями ТО
            if (["type_of_maintenance", "organization_carried_out_maintenance", "to_car", "service_company"].includes(name)) {
                // Находим объект выбранной модели по ID
                const selectedModel = (name === "type_of_maintenance" ? typeOfMaintenances :
                                       name === "organization_carried_out_maintenance" ? serviceCompanies :
                                       name === "to_car" ? cars :
                                       name === "service_company" ? serviceCompanies : [])
                                       .find(model => model.id === Number(value));

                return {
                    ...prevData,
                    [name]: selectedModel ? { id: selectedModel.id, name: selectedModel.name } : null
                };
            }

            // Для обычных текстовых полей
            return {
                ...prevData,
                [name]: value,
            };
        });
    };

    // Функция для сохранения изменений ТО
    const updateTechnicalMaintenance = async () => {
        try {
            const token = localStorage.getItem('access_token');

            // Создаем копию данных, заменяя объекты моделей на их ID
            const dataToSend = {
                ...updatedData,
                type_of_maintenance: updatedData.type_of_maintenance || null,
                organization_carried_out_maintenance: updatedData.organization_carried_out_maintenance || null,
                to_car: updatedData.to_car || null,
                service_company: updatedData.service_company || null,
            };

            console.log("Отправляемые данные: (dataToSend)", dataToSend);

            const response = await fetch(`http://127.0.0.1:8000/api/technical_maintenances/${editMaintenance.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',  // 👈 Добавил
                },
                body: JSON.stringify(dataToSend) // Отправляем только ID моделей
            });

            console.log('Редактируемое ТО ID', editMaintenance?.id);

            if (response.ok) {
                const responseData = await response.json();
                console.log("Данные успешно обновились. Ответ сервера:", responseData);

                await fetchData();
                closeModal();
                // window.location.reload();
            } else {
                alert('Ошибка при изменении данных');
            }
        } catch (error) {
            console.error('Ошибка при обновлении ТО', error);
        }
    };

    // Функция для обновления конкретного поля в ТО
    const updateTechnicalMaintenanceField = async (field, value, endpoint) => {
        try {
            const token = localStorage.getItem("access_token");

            const dataToSend = { [field]: value };
            console.log("Отправляем PATCH запрос на эндпоинт", endpoint);

            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Ответ сервера:", responseData);

                // 🔥 Обновляем только одно поле в updatedData, а не весь объект!
                setUpdatedData((prevState) => ({
                    ...prevState,
                    [field]: value, // Обновляем только измененное поле
                }));

                return responseData;
            } else {
                console.error(`Ошибка при обновлении данных ТО: ${endpoint}`);
            }
        } catch (error) {
            console.error(`Ошибка запроса ТО: ${endpoint}, ошибка = ${error}`);
        }
    };

    // Функция для обновления поля модели
    const updateField = async (field, value, endpoint) => {
        try {
            console.log("⏩ updateField отправляет:", { field, value, endpoint });

            const token = localStorage.getItem("access_token");

            const dataToSend = { [field]: value };
            console.log("Отправляем PATCH запрос на эндпоинт", endpoint);

            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Ответ сервера:", responseData);

                // 🔥 Обновляем только одно поле в updatedData, а не весь объект!
                setUpdatedData((prevState) => ({
                    ...prevState,
                    [field]: value, // Обновляем только измененное поле
                }));

                return responseData;
            } else {
                console.error(`Ошибка при обновлении данных ${endpoint}`);
            }
        } catch (error) {
            console.error(`Ошибка запроса ${endpoint}, ошибка = ${error}`);
        }
    };

    // Функция сохранения измененных данных ТО
    const updateTO = async () => {
        try {
            const token = localStorage.getItem('access_token');

            // Создаем копию данных, заменяя объекты моделей на их ID
            const dataToSend = {
                ...updatedData,
                type_of_maintenance: updatedData.type_of_maintenance || null,
                organization_carried_out_maintenance: updatedData.organization_carried_out_maintenance || null,
                to_car: updatedData.to_car || null,
                service_company: updatedData.service_company || null,
            };
            console.log("Отправляемые данные: (dataToSend)", dataToSend);

            const response = await fetch(`http://127.0.0.1:8000/api/technical-maintenances/${editTM.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',  // 👈 Добавил
                },
                body: JSON.stringify(dataToSend) // Отправляем только ID моделей
            });
            console.log('Редактируемое ТО', editTM?.id)
            if (response.ok) {
                // alert('Данные успешно обновлены');
                const responseData = await response.json();
                console.log("Данные успешно обновились. Ответ сервера:", responseData);
                // const responseText = await response.text()
                // console.log("Ответ сервера (RAW)", responseText)
                await fetchData();

                closeModal();
                // window.location.reload();
            } else {
                alert('Ошибка при изменении данных');
            }
        } catch (error) {
            console.error('Ошибка при обновлении ТО', error);
        }
    };


    useEffect(() => {
        if (!user || !cars || !technicalMaintenances) return ;

        const userCarIds = cars
            .filter(car => car.client === user.id)
            .map(car => car.id)

        const filteredMaintenances = technicalMaintenances
            .filter(tm => userCarIds.includes(tm.to_car))

        setUserTechnicalMaintenances(filteredMaintenances);

        console.log('ТО пользователя:', filteredMaintenances)
    }, [technicalMaintenances, user, cars]);

    useEffect(() => {
        if (technicalMaintenances && technicalMaintenances.length > 0) {
            const updatedTMData = technicalMaintenances.map(tm => ({
                ...tm,
                type_of_maintenance: tm.type_of_maintenance || null,
                organization_carried_out_maintenance: tm.organization_carried_out_maintenance || null,
                to_car: tm.to_car || null,
                service_company: tm.service_company || null,

            }));

            setUpdatedData(updatedTMData);
        }
        console.log('Данные ТО из TechnicalMaintenance', technicalMaintenances);
        // console.log('updatedData', updatedData)
    }, [technicalMaintenances]);


    return (
        <>
            <div className="results-container">
                {error && <p className="error-message">{error}</p>}

                <table className="table-results">
                    <thead>
                    <tr>
                        <th>№ ТО</th>
                        <th>Вид ТО</th>
                        <th>Дата проведения ТО</th>
                        <th>Наработка, м/час</th>
                        <th>№ заказ-наряда</th>
                        <th>Дата заказ-наряда</th>
                        <th>Организация, проводившая ТО</th>
                        <th>Машина (Зав. №)</th>
                        <th>Сервисная компания</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userTechnicalMaintenances.map(tm => (
                        <tr key={tm.id}>
                            <td>{tm.id}
                                <button className={'change-info-about-tm'} onClick={() => openEditModal(tm)}>Изменить</button>
                            </td>
                            <td>{tm.type_of_maintenance_name}</td>
                            <td>{tm.date_of_maintenance}</td>
                            <td>{tm.to_operating_time}</td>
                            <td>{tm.order_number}</td>
                            <td>{tm.order_date}</td>
                            <td>{tm.organization_carried_out_maintenance_name}</td>
                            <td>{tm.to_car_name}</td>
                            <td>{tm.service_company_name}</td>
                        </tr>
                    ))}
                    </tbody>


                </table>
            </div>

            {isModalOpenForChangeTM && editTM && (<div className={'modal-overlay'}>
                <div className="modal">
                    <h2>Редактирование ТО</h2>

                    {/* Вид ТО */}
                    <label>Вид ТО:</label>
                    <select
                        name="type_of_maintenance"
                        value={updatedData.type_of_maintenance || ""}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value, 10);
                            const selectedModel = typeOfMaintenances.find(model => model.id === selectedId);

                            setUpdatedData(prevState => ({
                                ...prevState,
                                type_of_maintenance: selectedModel || {}
                            }));

                            if (selectedModel) {
                                updateField("type_of_maintenance", selectedModel.id, `http://127.0.0.1:8000/api/type_of_maintenances/${selectedModel.id}/`);
                            }
                        }}
                    >
                        {/* Первая опция для выбора */}
                        <option value="">Текущий вид ТО
                            - {updatedData.type_of_maintenance_name}</option>

                        {/* Фильтруем, чтобы текущая модель не отображалась и в списке */}
                        {typeOfMaintenances
                            .filter(model => model.id !== updatedData.type_of_maintenance?.id) // Исключаем текущую модель
                            .map(model => (
                                <option key={model.id} value={model.id}>
                                    {model.name}
                                </option>
                            ))}
                    </select>


                    {/* Дата проведения ТО */}
                    <label>Дата проведения ТО:</label>
                    <input type="date" name="date_of_maintenance"
                           value={updatedData.date_of_maintenance || ""} onChange={handleChange}/>


                    {/* Наработка, м/час */}
                    <label>Наработка, м/час:</label>
                    <input type="text" name="to_operating_time"
                           value={updatedData.to_operating_time || ""} onChange={handleChange}/>

                    {/* № заказ-наряда */}
                    <label>№ заказ-наряда:</label>
                    <input type="text" name="order_number"
                           value={updatedData.order_number || ""} onChange={handleChange}/>


                    <label>Организация, проводившая ТО:</label>
                    <select
                        name="organization_carried_out_maintenance"
                        value={updatedData.organization_carried_out_maintenance || ""}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value, 10);
                            const selectedCompany = serviceCompanies.find(company => company.id === selectedId) || null;

                            console.log("Выбрали ID:", selectedId);
                            console.log("Найденный объект:", selectedCompany);

                            setUpdatedData(prevState => ({
                                ...prevState,
                                organization_carried_out_maintenance: selectedCompany  // Сохраняем объект с ID и именем
                            }));

                            if (selectedCompany) {
                                console.log("Отправляем updateField с ID:", selectedCompany.id);
                                updateField("organization_carried_out_maintenance", selectedCompany.id, `http://127.0.0.1:8000/api/service-companies/${selectedCompany.id}/`);
                            }
                        }}
                    >
                        <option value="">
                            Текущая организация проводившая ТО
                            - {updatedData.organization_carried_out_maintenance_name || "Не выбрано"}
                        </option>
                        {serviceCompanies.map(company => (
                            <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                    </select>


                    <label>Машина (Зав. №):</label>
                    <select
                        name="to_car"
                        value={updatedData.to_car || ""}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value, 10);
                            const selectedModel = cars.find(car => car.id === selectedId) || null;

                            console.log("Выбрали ID:", selectedId);
                            console.log("Найденный объект:", selectedModel);

                            setUpdatedData(prevState => ({
                                ...prevState,
                                to_car: selectedId || null
                            }));

                            if (selectedModel) {
                                console.log("Отправляем updateField с ID:", selectedModel.id);
                                updateField("to_car", selectedModel.id, `http://127.0.0.1:8000/api/cars/${selectedModel.id}/`);
                            }
                        }}
                    >
                        <option value="">Текущая машина (Зав. №)
                            - {updatedData.to_car_name}</option>
                        {cars.map(company => (
                            <option key={company.id} value={company.id}>{company.machines_factory_number}</option>
                        ))}
                    </select>


                    <label>Сервисная компания:</label>
                    <select
                        name="service_company"
                        value={updatedData.service_company?.id || ""}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value, 10);
                            const selectedModel = serviceCompanies.find(company => company.id === selectedId) || null;

                            console.log("Выбрали ID:", selectedId);
                            console.log("Найденный объект:", selectedModel);

                            setUpdatedData(prevState => ({
                                ...prevState,
                                service_company: selectedId || null
                            }));

                            if (selectedModel) {
                                console.log("Отправляем updateField с ID:", selectedModel.id);
                                updateField("service_company", selectedModel.id, `http://127.0.0.1:8000/api/service-companies/${selectedModel.id}/`);
                            }
                        }}
                    >
                        <option value="">Текущая сервисная компания
                            - {updatedData.service_company_name}</option>
                        {serviceCompanies.map(company => (
                            <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                    </select>

                    <button onClick={updateTO}>Сохранить</button>
                    <button className={'close-btn'} onClick={closeModal}>Отмена</button>

                </div>

            </div>)}
        </>
    )
}

export default TechnicalMaintenance;
