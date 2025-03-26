import './TechnicalMaintenance.css'
import {useEffect, useState} from "react";

function TechnicalMaintenance({user, cars, technicalMaintenances, error, typeOfMaintenances, serviceCompanies, fetchData, groups}) {
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
    const [newMaintenance, setNewMaintenance] = useState({
        type_of_maintenance: "",
        date_of_maintenance: "",
        to_operating_time: "",
        order_number: "",
        order_date: "",
        organization_carried_out_maintenance: "",
        to_car: "",
        service_company: "",
    })
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

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

    // Функция для изменения данных при создании ТО
    const handleChangeForCreateTM = (e) => {
        const { name, value } = e.target;

        setNewMaintenance((prevData) => {
            // Если поле является ForeignKey, сохраняем объект с ID
            if (["type_of_maintenance", "organization_carried_out_maintenance", "to_car", "service_company"].includes(name)) {
                const selectedModel = (
                    name === "type_of_maintenance" ? typeOfMaintenances :
                        name === "organization_carried_out_maintenance" ? serviceCompanies :
                            name === "to_car" ? cars :
                                name === "service_company" ? serviceCompanies : []
                ).find((model) => model.id === Number(value));

                return {
                    ...prevData,
                    [name]: selectedModel ? selectedModel.id : null, // Отправляем только ID
                };
            }

            // Для полей даты конвертируем значение в формат YYYY-MM-DD
            if (["date_of_maintenance", "order_date"].includes(name)) {
                return {
                    ...prevData,
                    [name]: value ? new Date(value).toISOString().split("T")[0] : "", // Приводим к строке формата YYYY-MM-DD
                };
            }

            // Для числовых полей
            if (["to_operating_time", "order_number"].includes(name)) {
                return {
                    ...prevData,
                    [name]: value ? Number(value) : "", // Преобразуем в число
                };
            }

            // Для остальных полей (текстовые)
            return {
                ...prevData,
                [name]: value,
            };
        });
    };

    // Функция для принятия создания ТО
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://127.0.0.1:8000/api/technical-maintenances/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newMaintenance),
            });

            if (response.ok) {
                alert("ТО успешно добавлено!");
                setIsModalOpen(false);
                fetchData(); // Обновляем список ТО
            } else {
                alert("Ошибка при добавлении ТО");
            }
        } catch (error) {
            console.error("Ошибка при добавлении ТО:", error);
        }
    };

    // Функция для удаления ТО
    const handleDelete = async (id) => {
        if (!window.confirm("Вы уверены, что хотите удалить это ТО?")) return;

        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`http://127.0.0.1:8000/api/technical-maintenances/${id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("ТО успешно удалено!");
                fetchData(); // Обновляем список ТО
            } else {
                alert("Ошибка при удалении ТО");
            }
        } catch (error) {
            console.error("Ошибка при удалении ТО:", error);
        }
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


    const isClientOrServiceOrManger = groups.some(group =>
        group.name === 'client' || group.name === 'manager' || group.name === 'service organization'
    );

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
            <button onClick={() => setIsModalCreateOpen(true)}>Создать</button>
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
                                {isClientOrServiceOrManger ? (<div className={'buttons'}>
                                    <button className={'change-info-about-tm'}
                                            onClick={() => openEditModal(tm)}>Изменить
                                    </button>
                                    <button className="delete-info-about-tm"
                                            onClick={() => handleDelete(tm.id)}>Удалить
                                    </button>
                                </div>) : <></>}

                            </td>

                            <td>
                                <button className="button-info"
                                onClick={() => openWindowForModel(
                                    'Вид ТО',
                                    tm.type_of_maintenance_name || 'Не указано',
                                    tm.type_of_maintenance_description || 'Описание отсутствует'
                                )}>

                                    <span className="object-of-tm">
                                        {tm.type_of_maintenance_name || 'Не указано'}
                                    </span>
                                </button>
                            </td>

                            <td>
                                <button className="button-info"
                                onClick={() => openModal(
                                    'Дата проведения ТО',
                                    tm.date_of_maintenance || 'Не указано'
                                )}>
                                    <span className="object-of-tm">
                                        {tm.date_of_maintenance || 'Не указано'}
                                    </span>
                                </button>
                            </td>


                            <td>
                                <button className="button-info"
                                onClick={() => openModal(
                                    'Наработка, м/час',
                                    tm.to_operating_time || 'Не указано'
                                )}>
                                    <span className="object-of-tm">
                                        {tm.to_operating_time || 'Не указано'}
                                    </span>
                                </button>
                            </td>

                            <td>
                                <button className="button-info"
                                onClick={() => openModal(
                                    '№ заказ-наряда',
                                    tm.order_number || 'Не указано'
                                )}>
                                    <span className="object-of-tm">
                                        {tm.order_number || 'Не указано'}
                                    </span>
                                </button>
                            </td>

                            <td>
                                <button className="button-info"
                                onClick={() => openModal(
                                    'Дата заказ-наряда',
                                    tm.order_date || 'Не указано'
                                )}>
                                    <span className="object-of-tm">
                                        {tm.order_date || 'Не указано'}
                                    </span>
                                </button>
                            </td>

                            <td>
                                <button className="button-info"
                                onClick={() => openWindowForModel(
                                    'Организация, проводившая ТО',
                                    tm.organization_carried_out_maintenance_name || 'Не указано',
                                    tm.organization_carried_out_maintenance_description || 'Описание отсутствует'
                                )}>
                                    <span className="object-of-tm">
                                        {tm.organization_carried_out_maintenance_name || 'Не указано'}
                                    </span>
                                </button>
                            </td>

                            <td>
                                <button className="button-info"
                                onClick={() => openModal(
                                    'Машина (Зав. №)',
                                    tm.to_car_name || 'Не указано'
                                )}>
                                    <span className="object-of-tm">
                                        {tm.to_car_name || 'Не указано'}
                                    </span>
                                </button>
                            </td>

                            <td>
                                <button className="button-info"
                                onClick={() => openWindowForModel(
                                    'Сервисная компания',
                                    tm.service_company_name || 'Не указано',
                                    tm.service_company_description || 'Описание отсутствует'
                                )}>
                                    <span className="object-of-tm">
                                        {tm.service_company_name || 'Не указано'}
                                    </span>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>


                </table>
            </div>

            {isModalOpen && (
                    <div className={'modal-overlay'}>
                        <div className="modal">
                            <p className={'model'}>{modalType}: <br/><span
                                className={'name-of-model'}>{selectedModel}</span></p>
                            {/*<p>Описание: {descriptionSelectedModel}</p>*/}
                            <button className={'close-btn'} onClick={closeModal}>Закрыть</button>
                        </div>
                    </div>
                )
                || isModalOpenForModel && (
                    <div className={'modal-overlay'}>
                        <div className="modal">
                            <p className={'model'}>{modalType}: <br/><span
                                className={'name-of-model'}>{selectedModel}</span></p>
                            <p>Описание: {descriptionSelectedModel}</p>
                            <button className={'close-btn'} onClick={closeModal}>Закрыть</button>
                        </div>
                    </div>
                )
                || isModalOpenForChangeTM && editTM && (<div className={'modal-overlay'}>
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
                        {cars
                            .filter(car => car.client_details === user.nickname)
                            .map(company => (
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

            </div>)
                || isModalCreateOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <p>Добавить новое ТО</p>
                            <form onSubmit={handleSubmit} className={'form-for-create-tm'}>
                                {/* Вид ТО */}
                                <label>Вид ТО:</label>
                                <select
                                    name="type_of_maintenance"
                                    value={newMaintenance.type_of_maintenance || ""}
                                    onChange={handleChangeForCreateTM}
                                    required
                                >
                                    <option value="">Выберите вид ТО</option>
                                    {typeOfMaintenances.map(model => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Дата проведения ТО */}
                                <label>Дата проведения ТО:</label>
                                <input
                                    type="date"
                                    name="date_of_maintenance"
                                    value={newMaintenance.date_of_maintenance || ""}
                                    onChange={handleChangeForCreateTM}
                                    required
                                />

                                {/* Наработка, м/час */}
                                <label>Наработка, м/час:</label>
                                <input
                                    type="number"
                                    name="to_operating_time"
                                    value={newMaintenance.to_operating_time || ""}
                                    onChange={handleChangeForCreateTM}
                                    required
                                />

                                {/* № заказ-наряда */}
                                <label>№ заказ-наряда:</label>
                                <input
                                    type="text"
                                    name="order_number"
                                    value={newMaintenance.order_number || ""}
                                    onChange={handleChangeForCreateTM}
                                    required
                                />

                                {/* Дата заказ-наряда */}
                                <label>Дата заказ-наряда:</label>
                                <input
                                    type="date"
                                    name="order_date"
                                    value={newMaintenance.order_date || ""}
                                    onChange={handleChangeForCreateTM}
                                    required
                                />

                                {/* Организация, проводившая ТО */}
                                <label>Организация, проводившая ТО:</label>
                                <select
                                    name="organization_carried_out_maintenance"
                                    value={newMaintenance.organization_carried_out_maintenance || ""}
                                    onChange={handleChangeForCreateTM}
                                    required
                                >
                                    <option value="">Выберите организацию</option>
                                    {serviceCompanies.map(model => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Машина */}
                                <label>Машина:</label>
                                <select
                                    name="to_car"
                                    value={newMaintenance.to_car || ""}
                                    onChange={handleChangeForCreateTM}
                                    required
                                >
                                    <option value="">Выберите машину</option>
                                    {cars
                                        .filter(car => car.client_details === user.nickname)
                                        .map(car => (
                                        <option key={car.id} value={car.id}>
                                            {car.machines_factory_number}
                                        </option>
                                    ))}
                                </select>

                                {/* Сервисная компания */}
                                <label>Сервисная компания:</label>
                                <select
                                    name="service_company"
                                    value={newMaintenance.service_company || ""}
                                    onChange={handleChangeForCreateTM}
                                    required
                                >
                                    <option value="">Выберите сервисную компанию</option>
                                    {serviceCompanies.map(model => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Кнопка для отправки формы */}
                                <button type="submit">Создать</button>
                            </form>

                            {/* Кнопка закрытия модального окна */}
                            <button onClick={() => setIsModalCreateOpen(false)}>Отмена</button>
                        </div>
                    </div>
                )}
        </>
    )
}

export default TechnicalMaintenance;
