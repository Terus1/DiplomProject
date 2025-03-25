import './Complaint.css'
import {useEffect, useState} from "react";

function Complaint({user, cars, complaints, groups, failureNodes, recoveryMethods, serviceCompanies, fetchData, error}) {
    const [userComplaints, setUserComplaints] = useState([]);
    const [modalType, setModalType] = useState(""); // Тип модального окна
    const [selectedModel, setSelectedModel] = useState(""); // Выбранная модель
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenForModel, setIsModalOpenForModel] = useState(false);
    const [isModalOpenForChangeComplaint, setIsModalOpenForChangeComplaint] = useState(false);    // Состояние для показа модуля редактирования ТОО
    const [editComplaint, setEditComplaint] = useState(null) // Данные редактируемого ТО
    const [updatedData, setUpdatedData] = useState({
        failure_node: {},
        recovery_method: {},
        complaint_car: {},
        service_company: {},
    }); // Измененные данные
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
        setIsModalOpenForChangeComplaint(false);
    }

    // Функция для открытия формы редактирования
    const openEditModal = (tm) => {
        setEditComplaint(tm);  // Заполняем данные текущего ТО
        setUpdatedData(tm); // Заполняем форму текущими данными
        setIsModalOpenForChangeComplaint(true);
    }

    // Функция для открытия модального окна для моделей запчастей машины
    const openWindowForModel = (type, model, description) => {
        setModalType(type);
        setSelectedModel(model);
        setDescriptionSelectedModel(description);
        setIsModalOpenForModel(true);
    }

    // Функция для изменения данных рекламации
    const handleChange = (e) => {
        const { name, value } = e.target;

        setUpdatedData((prevData) => {
            // Для полей, связанных с моделями ТО
            if (["failure_node", "recovery_method", "complaint_car", "service_company"].includes(name)) {
                // Находим объект выбранной модели по ID
                const selectedModel = (name === "failure_node" ? failureNodes :
                    name === "recovery_method" ? recoveryMethods :
                        name === "complaint_car" ? cars :
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

    // // Функция для сохранения изменений рекламации
    // const updateComplaint = async () => {
    //     try {
    //         const token = localStorage.getItem('access_token');
    //
    //         // Создаем копию данных, заменяя объекты моделей на их ID
    //         const dataToSend = {
    //             ...updatedData,
    //             failure_node: updatedData.failure_node || null,
    //             recovery_method: updatedData.recovery_method || null,
    //             complaint_car: updatedData.complaint_car || null,
    //             service_company: updatedData.service_company || null,
    //         };
    //
    //         console.log("Отправляемые данные: (dataToSend)", dataToSend);
    //
    //         const response = await fetch(`http://127.0.0.1:8000/api/complaints/${editComplaint.id}/`, {
    //             method: 'PATCH',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`,
    //                 'Accept': 'application/json',  // 👈 Добавил
    //             },
    //             body: JSON.stringify(dataToSend) // Отправляем только ID моделей
    //         });
    //
    //         console.log('Редактируемая рекламация ID', editComplaint?.id);
    //
    //         if (response.ok) {
    //             const responseData = await response.json();
    //             console.log("Данные успешно обновились. Ответ сервера:", responseData);
    //
    //             await fetchData();
    //             closeModal();
    //             // window.location.reload();
    //         } else {
    //             alert('Ошибка при изменении данных');
    //         }
    //     } catch (error) {
    //         console.error('Ошибка при обновлении рекламации', error);
    //     }
    // };

    // Функция для обновления конкретного поля в рекламации
    const updateComplaintField = async (field, value, endpoint) => {
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
                console.error(`Ошибка при обновлении данных рекламации: ${endpoint}`);
            }
        } catch (error) {
            console.error(`Ошибка запроса рекламации: ${endpoint}, ошибка = ${error}`);
        }
    };

    // Функция для обновления поля модели
    const updateField = async (field, value, endpoint) => {
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
                console.error(`Ошибка при обновлении данных ${endpoint}`);
            }
        } catch (error) {
            console.error(`Ошибка запроса ${endpoint}, ошибка = ${error}`);
        }
    };

    // Функция сохранения измененных данных ТО
    const updateComplaint = async () => {
        try {
            const token = localStorage.getItem('access_token');
            // console.log("Проверяем данные перед отправкой:");
            // console.log("failure_node:", updatedData.failure_node);
            // console.log("recovery_method:", updatedData.recovery_method);
            // console.log("complaint_car:", updatedData.complaint_car);
            // console.log("service_company:", updatedData.service_company);
            // Создаем копию данных, заменяя объекты моделей на их ID
            const dataToSend = {
                ...updatedData,
                failure_node: updatedData.failure_node?.id || null,
                recovery_method: updatedData.recovery_method?.id || null,
                complaint_car: updatedData.complaint_car?.id || null,
                service_company: updatedData.service_company?.id || null,
            };
            // console.log("Финальные данные перед отправкой:", JSON.stringify(dataToSend, null, 2));


            const response = await fetch(`http://127.0.0.1:8000/api/complaints/${editComplaint.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',  // 👈 Добавил
                },
                body: JSON.stringify(dataToSend) // Отправляем только ID моделей
            });
            console.log('Редактируемая рекламация', editComplaint?.id)
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
                const errorText = await response.text();
                console.error("Ошибка при изменении данных:", errorText);
            }
        } catch (error) {
            console.error('Ошибка при обновлении рекламации', error);
        }
    };

    useEffect(() => {
        if (!user || !cars || !complaints) return;

        const userCarIds = cars
            .filter(car => car.client === user.id)
            .map(car => car.id)

        const filteredComplaints = complaints
            .filter(complaint => userCarIds.includes(complaint.complaint_car))

        setUserComplaints(filteredComplaints)
        console.log('Рекламации пользователя', filteredComplaints)
        // console.log('Способы восстановления:', recoveryMethods, 'Машины:', cars, 'Сервисная компания', serviceCompanies)
    }, [complaints, user, cars, recoveryMethods, serviceCompanies]);


    return (
        <>
            <div className="results-container">
                {error && <p className="error-message">{error}</p>}

                <table className="table-results">
                    <thead>
                    <tr>
                        <th>№ Рекламации</th>
                        <th>Дата отказа</th>
                        <th>Наработка, м/час</th>
                        <th>Узел отказа</th>
                        <th>Описание отказа</th>
                        <th>Способ восстановления</th>
                        <th>Используемые запасные части</th>
                        <th>Время простоя техники</th>
                        <th>Дата восстановления</th>
                        <th>Машина (Зав. №)</th>
                        <th>Сервисная компания</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userComplaints.map(complaint => (

                        <tr key={complaint.id}>
                            <td>{complaint.id}
                                <button className={'change-info-about-complaint'}
                                        onClick={() => openEditModal(complaint)}>Изменить
                                </button>
                            </td>
                            <td>{complaint.date_of_refusal}
                                {(groups[0]['name'] === 'manager') ?
                                    (<button className="change-info-about-car"
                                             onClick={() => openEditModal(complaint)}>Изменить
                                    </button>) : <></>}</td>
                            <td>{complaint.complaint_operating_time}</td>
                            <td>{complaint.failure_node_name}</td>
                            <td>{complaint.description_of_failure}</td>
                            <td>{complaint.recovery_method_name}</td>
                            <td>{complaint.used_spare_parts}</td>
                            <td>{complaint.equipment_downtime}</td>
                            <td>{complaint.date_of_restoration}</td>
                            <td>{complaint.complaint_car_name}</td>
                            <td>{complaint.service_company_name}</td>
                        </tr>
                    ))}
                    </tbody>


                </table>
            </div>

            {isModalOpenForChangeComplaint && editComplaint && (<div className={'modal-overlay'}>
                <div className="modal">
                    <h2>Редактирование Рекламации</h2>

                    {/* Дата проведения ТО */}
                    <label>Дата отказа:</label>
                    <input type="date" name="date_of_refusal"
                           value={updatedData.date_of_refusal || ""} onChange={handleChange}/>


                    {/* Наработка, м/час */}
                    <label>Наработка, м/час:</label>
                    <input type="text" name="complaint_operating_time"
                           value={updatedData.complaint_operating_time || ""} onChange={handleChange}/>


                    <label>Узел отказа:</label>
                    <select
                        name="failure_node"
                        value={updatedData.failure_node?.id || ""}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value, 10);
                            const selectedModel = failureNodes.find(node => node.id === selectedId) || null;

                            console.log("Выбрали failure_node ID:", selectedId);
                            console.log("Найденный объект:", selectedModel);

                            setUpdatedData(prevState => ({
                                ...prevState,
                                failure_node: selectedModel  // Сохраняем объект с ID и именем
                            }));

                            if (selectedModel) {
                                console.log('Отправляем failure_node с ID', selectedModel.id);
                                updateField('failure_node', selectedModel.id, `http://127.0.0.1:8000/api/failure_nodes/${selectedModel.id}/`)
                        }}}

                    >
                        <option value="">
                            Текущий узел отказа
                            - {updatedData.failure_node_name || "Не выбрано"}
                        </option>
                        {failureNodes.map(node => (
                            <option key={node.id} value={node.id}>{node.name}</option>
                        ))}
                    </select>

                    {/* Описание отказа */}
                    <label>Описание отказа:</label>
                    <input type="text" name="description_of_failure"
                           value={updatedData.description_of_failure || ""} onChange={handleChange}/>


                    <label>Способ восстановления:</label>
                    <select
                        name="recovery_method"
                        value={updatedData.recovery_method?.id || ""}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value, 10);
                            const selectedModel = recoveryMethods.find(method => method.id === selectedId) || null;

                            console.log("Выбрали recovery_method ID:", selectedId);
                            console.log("Найденный объект:", selectedModel);

                            setUpdatedData(prevState => ({
                                ...prevState,
                                recovery_method: selectedModel  // Сохраняем объект с ID и именем
                            }));

                            if (selectedModel) {
                                console.log('Отправляем recovery_method с ID:', selectedModel.id);
                                updateField('recovery_method', selectedModel.id,  `http://127.0.0.1:8000/api/recovery_methods/${selectedModel.id}/`)
                            }
                        }}
                    >
                        <option value="">
                            Текущий способ восстановления
                            - {updatedData.recovery_method_name || "Не выбрано"}
                        </option>
                        {recoveryMethods.map(method => (
                            <option key={method.id} value={method.id}>{method.name}</option>
                        ))}
                    </select>


                    {/* Используемые запасные части */}
                    <label>Используемые запасные части:</label>
                    <input type="text" name="used_spare_parts"
                           value={updatedData.used_spare_parts || ""} onChange={handleChange}/>


                    {/* Дата восстановления */}
                    <label>Дата восстановления:</label>
                    <input type="date" name="date_of_restoration"
                           value={updatedData.date_of_restoration || ""} onChange={handleChange}/>


                    {/* Время простоя техники */}
                    <label>Время простоя техники:</label>
                    <input type="date" name="equipment_downtime"
                           value={updatedData.equipment_downtime || ""} onChange={handleChange}/>


                    <label>Машина (Зав. №):</label>
                    <select
                        name="complaint_car"
                        value={updatedData.complaint_car?.id || ""}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value, 10);
                            const selectedModel = cars.find(car => car.id === selectedId) || null;

                            console.log("Выбрали complaint_car ID:", selectedId);
                            console.log("Найденный объект:", selectedModel);

                            setUpdatedData(prevState => ({
                                ...prevState,
                                complaint_car: selectedModel  // Сохраняем объект с ID и именем
                            }));

                            if (selectedModel) {
                                console.log('Отправляем complaint_car с ID:', selectedModel.id);
                                updateField('complaint_car', selectedModel.id,  `http://127.0.0.1:8000/api/cars/${selectedModel.id}/`)
                            }

                        }}
                    >
                        <option value="">
                            Текущая машина
                            - {updatedData.complaint_car_name || "Не выбрано"}
                        </option>
                        {cars.map(car => (
                            <option key={car.id} value={car.id}>{car.machines_factory_number}</option>
                        ))}
                    </select>


                    <label>Сервисная компания:</label>
                    <select
                        name="service_company"
                        value={updatedData.service_company?.id || ""}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value, 10);
                            const selectedModel = serviceCompanies.find(company => company.id === selectedId) || null;

                            console.log("Выбрали service_company ID:", selectedId);
                            console.log("Найденный объект:", selectedModel);

                            setUpdatedData(prevState => ({
                                ...prevState,
                                service_company: selectedModel
                            }));

                            if (selectedModel) {
                                console.log('Отправляем service_company с ID:', selectedModel.id);
                                updateField('service_company', selectedModel.id, `http://127.0.0.1:8000/api/service-companies/${selectedModel.id}/`)
                            }
                            
                        }}
                    >
                        <option value="">Текущая сервисная компания
                            - {updatedData.service_company_name}</option>
                        {serviceCompanies.map(company => (
                            <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                    </select>

                    <button onClick={updateComplaint}>Сохранить</button>
                    <button className={'close-btn'} onClick={closeModal}>Отмена</button>

                </div>

            </div>)}
        </>
    )
}


export default Complaint;
