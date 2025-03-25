import './GeneralInformation.css'
import {useEffect, useState} from "react";
import {options} from "axios";


function GeneralInformation({cars, setCars, error, user, techniques, engines, transmissions, drivingBridges, controlledBridges,
                                clients, recipients, serviceCompanies, fetchData, groups}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenForModel, setIsModalOpenForModel] = useState(false);
    const [modalType, setModalType] = useState(""); // Тип модального окна
    const [selectedModel, setSelectedModel] = useState(""); // Выбранная модель
    const [descriptionSelectedModel, setDescriptionSelectedModel] = useState(""); // Описание выбранной модели

    const [editCar, setEditCar] = useState(null); // Данные редактируемой машины
    const [updatedData, setUpdatedData] = useState({
        model_of_technique: {},
        engine_model: {},
        transmission_model: {},
        driving_bridge_model: {},
        controlled_bridge_model: {},
        service_company: {},
        client: {},
        recipient: {},
    }); // Измененные данные


    const [isModalOpenForChangeCar, setIsModalOpenForChangeCar] = useState(false);

    useEffect(() => {
        if (cars && cars.length > 0) {
            const updatedCarsData = cars.map(car => ({
                ...car,
                model_of_technique: car.model_of_technique || null,
                engine_model: car.engine_model || null,
                transmission_model: car.transmission_model || null,
                driving_bridge_model: car.driving_bridge_model || null,
                controlled_bridge_model: car.controlled_bridge_model || null,
                service_company: car.service_company || null,
                client: car.client || null,
                recipient: car.recipient || null
            }));

            setUpdatedData(updatedCarsData);
        }
        console.log('Данные машин из GeneralInformation', cars);
        // console.log('updatedData', updatedData)
    }, [cars]);



    useEffect(() => {
        if (updatedData && updatedData.length > 0) {
            console.log('updatedData', updatedData)
            console.log('Группа пользотвателя', groups[0]['name'])
        }
    }, [updatedData]);  // Логируем только когда updatedData изменилось


    // Функция для открытия формы редактирования
    const openEditModal = (car) => {
        setEditCar(car);
        setUpdatedData(car); // Заполняем форму текущими данными
        setIsModalOpenForChangeCar(true);
    }

    // Функция для обработки изменений в полях
    // const handleChange = (e) => {
    //     setUpdatedData({...updatedData, [e.target.name]: e.target.value})
    // }

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //
    //     setUpdatedData((prevData) => {
    //         if (name.includes("model")) {
    //             // Если поле относится к модели, обновляем объект
    //             return {
    //                 ...prevData,
    //                 [name]: {
    //                     ...prevData[name],
    //                     name: value, // Обновляем только name внутри объекта
    //                 },
    //             };
    //         }
    //
    //         return {
    //             ...prevData,
    //             [name]: value,
    //         };
    //     });
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUpdatedData((prevData) => {
            // Для полей, связанных с моделями техники
            if (["model_of_technique", "engine_model", "transmission_model", "driving_bridge_model", "controlled_bridge_model", "service_company"].includes(name)) {
                // Находим объект выбранной модели по ID
                const selectedModel = (name === "model_of_technique" ? techniques :
                                       name === "engine_model" ? engines :
                                       name === "transmission_model" ? transmissions :
                                       name === "driving_bridge_model" ? drivingBridges :
                                       name === "controlled_bridge_model" ? controlledBridges :
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


    // const updateCar = async () => {
    //     try {
    //         const token = localStorage.getItem('access_token')
    //
    //         const response = await fetch(`http://127.0.0.1:8000/api/cars/${editCar.id}/`, {
    //             method: 'PATCH',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             },
    //             body: JSON.stringify(updatedData)
    //         });
    //
    //         if (response.ok) {
    //             alert('Данные успешно обновлены');
    //             closeModal();
    //             window.location.reload();
    //         } else {
    //             alert('Ошибка при изменении данных')
    //         }
    //     } catch (error) {
    //         console.error('Ошибка при обновлении машины', error)
    //     }
    // }

    const updateCar = async () => {
        try {
            const token = localStorage.getItem('access_token');

            // Создаем копию данных, заменяя объекты моделей на их ID
            const dataToSend = {
                ...updatedData,
                model_of_technique: updatedData.model_of_technique || null,
                engine_model: updatedData.engine_model || null,
                transmission_model: updatedData.transmission_model || null,
                driving_bridge_model: updatedData.driving_bridge_model || null,
                controlled_bridge_model: updatedData.controlled_bridge_model || null,
                service_company: updatedData.service_company || null,
            };
            console.log("Отправляемые данные: (dataToSend)", dataToSend);

            const response = await fetch(`http://127.0.0.1:8000/api/cars/${editCar.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',  // 👈 Добавил
                },
                body: JSON.stringify(dataToSend) // Отправляем только ID моделей
            });
            console.log('Редактируемый автомобиль ID', editCar?.id)
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
            console.error('Ошибка при обновлении машины', error);
        }
    };


    // Функция для открытия модального окна для моделей запчастей машины
    const openWindowForModel = (type, model, description) => {
        setModalType(type);
        setSelectedModel(model);
        setDescriptionSelectedModel(description);
        setIsModalOpenForModel(true);
    }

    const openModal = (type, model) => {
        setModalType(type)
        setSelectedModel(model)
        setIsModalOpen(true);
    }

    // Функция для закрытия модального окна
    const closeModal = () => {
        setIsModalOpen(false);
        setIsModalOpenForModel(false)
        setIsModalOpenForChangeCar(false);
    }


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


    return (
        <>
            <div className="results-container">
                {error && <p className="error-message">{error}</p>}

                <table className="table-results">
                    <thead>
                    <tr>
                        <th>№ п/п</th>
                        <th>Модель техники</th>
                        <th>Зав. № машины</th>
                        <th>Модель двигателя</th>
                        <th>Зав. № двигателя</th>
                        <th>Модель трансмиссии (производитель, артикул)</th>
                        <th>Зав. № трансмиссии</th>
                        <th>Модель ведущего моста</th>
                        <th>Зав. № ведущего моста</th>
                        <th>Модель управляемого моста</th>
                        <th>Зав. № управляемого моста</th>
                        <th>Дата отгрузки с завода</th>
                        <th>Покупатель</th>
                        <th>Грузополучатель (конечный потребитель)</th>
                        <th>Адрес поставки (эксплуатации)</th>
                        <th>Комплектации (доп. опции)</th>
                        <th>Сервисная компания</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cars?.length > 0 ? (
                        cars
                            .filter(car => car.client_details.toLowerCase() === user.nickname.toLowerCase()) // Оставляем только нужные элементы
                            .map((car, index) => (
                                <tr key={car.id ? `car-${car.id}` : `car-index-${index}`}>
                                    <td>Машина № {index + 1} <br/>
                                        {(groups[0]['name'] === 'client') ?
                                            (<button className="change-info-about-car"
                                                     onClick={() => openEditModal(car)}>Изменить
                                            </button>) : <></>}

                                    </td>

                                    {/* Модель техники */}
                                    <td>
                                        <button className="button-info"
                                                onClick={() => openWindowForModel(
                                                    'Техника',
                                                    car.model_of_technique_details?.name || 'Не указано',
                                                    car.model_of_technique_details?.description || 'Описание отсутствует'
                                                )}>
                                            <span className={'object-of-car'}>
                                                {car.model_of_technique_details?.name || 'Не указано'}
                                            </span>
                                        </button>
                                    </td>

                                    {/* Зав. № машины */}
                                    <td>
                                        <button className="button-info"
                                                onClick={() => openModal(
                                                    'Техника',
                                                    car.machines_factory_number || 'Не указано',
                                                )}>
                                            <span className={'object-of-car'}>
                                                {car.machines_factory_number || 'Не указано'}
                                            </span>
                                        </button>
                                    </td>

                                    {/* Модель двигателя */}
                                    <td>
                                        <button className="button-info"
                                                onClick={() => openWindowForModel(
                                                    'Двигатель',
                                                    car.engine_model_details?.name || 'Не указано',
                                                    car.engine_model_details?.description || 'Описание отсутствует'
                                                )}>
                                            <span className={'object-of-car'}>
                                                {car.engine_model_details?.name || "—"}
                                            </span>
                                        </button>
                                    </td>

                                    {/* Зав. № двигателя */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openModal(
                                                'Зав. № двигателя',
                                                car.engine_serial_number || 'Не указано'
                                            )}>
                                            <span className={'object-of-car'}>{car.engine_serial_number || "—"}</span>
                                        </button>
                                    </td>

                                    {/* Трансмиссия */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openWindowForModel(
                                                'Трансмиссия',
                                                car.transmission_model_details?.name || 'Не указано',
                                                car.transmission_model_details?.description || 'Описание отсутствует'
                                            )}>
                                            <span className="object-of-car">
                                                {car.transmission_model_details?.name || "—"}
                                            </span>
                                        </button>
                                    </td>

                                    {/* Зав. № трансмиссии */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openModal(
                                                'Зав. № трансмиссии',
                                                car.factory_number_of_transmission || 'Не указано'
                                            )}>
                                            <span className="object-of-car">
                                                {car.factory_number_of_transmission || "—"}
                                            </span>
                                        </button>
                                    </td>

                                    {/* Ведущий мост */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openWindowForModel(
                                                'Ведущий мост',
                                                car.driving_bridge_model_details?.name || 'Не указано',
                                                car.driving_bridge_model_details?.description || 'Описание отсутствует'
                                            )}>
                                            <span className="object-of-car">
                                                {car.driving_bridge_model_details?.name || "—"}
                                            </span>
                                        </button>
                                    </td>

                                    {/* Зав. № ведущего моста */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openModal(
                                                'Зав. № ведущего моста',
                                                car.factory_number_of_drive_axle || 'Не указано'
                                            )}>
                                            <span className="object-of-car">
                                                {car.factory_number_of_drive_axle || "—"}
                                            </span>
                                        </button>
                                    </td>

                                    {/* Управляемый мост */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openWindowForModel(
                                                'Управляемый мост',
                                                car.controlled_bridge_model_details?.name || 'Не указано',
                                                car.controlled_bridge_model_details?.description || 'Описание отсутствует'
                                            )}>
                                            <span className="object-of-car">
                                                {car.controlled_bridge_model_details?.name || "—"}
                                            </span>
                                        </button>
                                    </td>

                                    {/* Зав. № управляемого моста */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openModal(
                                                'Зав. № управляемого моста',
                                                car.factory_number_of_controlled_bridge || 'Не указано'
                                            )}>
                                            <span className="object-of-car">
                                                {car.factory_number_of_controlled_bridge || "—"}
                                            </span>
                                        </button>
                                    </td>

                                    {/* Дата отгрузки */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openModal(
                                                'Дата отгрузки',
                                                car.date_of_shipment_from_the_factory || 'Не указано'
                                            )}>
                                            <span className="object-of-car">
                                                {car.date_of_shipment_from_the_factory || "—"}
                                            </span>
                                        </button>
                                    </td>

                                    {/* Покупатель */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openModal(
                                                'Покупатель',
                                                car.client_details || 'Не указано',
                                            )}>
                                            <span className="object-of-car">{car.client_details || "—"}</span>
                                        </button>
                                    </td>

                                    {/* Грузополучатель */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openModal(
                                                'Грузополучатель',
                                                car.recipient_details || 'Не указано'
                                            )}>
                                            <span className="object-of-car">{car.recipient_details || "—"}</span>
                                        </button>
                                    </td>

                                    {/* Адрес поставки */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openModal(
                                                'Адрес поставки',
                                                car.delivery_address || 'Не указано'
                                            )}>
                                            <span className="object-of-car">{car.delivery_address || "—"}</span>
                                        </button>
                                    </td>

                                    {/* Комплектация */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openModal(
                                                'Комплектация',
                                                car.equipment || 'Не указано'
                                            )}>
                                            <span className="object-of-car">{car.equipment || "—"}</span>
                                        </button>
                                    </td>

                                    {/* Сервисная компания */}
                                    <td>
                                        <button className="button-info"
                                            onClick={() => openModal(
                                                'Сервисная компания',
                                                car.service_company_details || 'Не указано'
                                            )}>
                                            <span className="object-of-car">{car.service_company_details || "—"}</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan="17">Данных нет</td>
                        </tr>
                    )}
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
                ) || isModalOpenForChangeCar && editCar && (
                    <div className={'modal-overlay'}>
                        <div className="modal">
                            <h2>Редактирование машины</h2>

                            {/* Модель техники */}
                            <label>Модель техники:</label>
                            <select
                                name="model_of_technique"
                                value={updatedData.model_of_technique?.id || ""}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value, 10);
                                    const selectedModel = techniques.find(model => model.id === selectedId);

                                    setUpdatedData(prevState => ({
                                        ...prevState,
                                        model_of_technique: selectedModel || {}
                                    }));

                                    if (selectedModel) {
                                        updateField("model_of_technique", selectedModel.id, `http://127.0.0.1:8000/api/techniques/${selectedModel.id}/`);
                                    }
                                }}
                            >
                                {/* Первая опция для выбора */}
                                <option value="">Текущая модель техники - {updatedData.model_of_technique_details?.name}</option>

                                {/* Фильтруем, чтобы текущая модель не отображалась и в списке */}
                                {techniques
                                    .filter(model => model.id !== updatedData.model_of_technique?.id) // Исключаем текущую модель
                                    .map(model => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                            </select>


                            {/*Зав. № машины*/}
                            <label>Зав. № машины:</label>
                            <input type="text" name="machines_factory_number"
                                   value={updatedData.machines_factory_number || ""} onChange={handleChange}/>

                            <label>Модель двигателя:</label>
                            <select
                                name="engine_model"
                                value={updatedData.engine_model?.id || ""}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value, 10);
                                    const selectedModel = engines.find(model => model.id === selectedId)
                                    setUpdatedData(prevState => ({
                                        ...prevState,
                                        engine_model: selectedModel || {}
                                    }));

                                    if (selectedModel) {
                                        updateField('engine_model', selectedModel.id, `http://127.0.0.1:8000/api/engines/${selectedModel.id}/`)
                                    }
                                }}
                            >
                                <option value="">Текущая модель двигателя - {updatedData.engine_model_details?.name}</option>
                                {engines.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>

                            {/*Зав. № двигателя*/}
                            <label>Зав. № двигателя:</label>
                            <input type="text" name="engine_serial_number"
                                   value={updatedData.engine_serial_number || ""} onChange={handleChange}/>

                            <label>Модель трансмиссии:</label>
                            <select
                                name="transmission_model"
                                value={updatedData.transmission_model?.id || ""}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value, 10);
                                    const selectedModel = transmissions.find(model => model.id === selectedId)
                                    setUpdatedData(prevState => ({
                                        ...prevState,
                                        transmission_model: selectedModel || {}
                                    }));

                                    if (selectedModel) {
                                        updateField('transmission_model', selectedModel.id, `http://127.0.0.1:8000/api/transmissions/${selectedModel.id}/`)
                                    }
                                }}
                            >
                                <option value="">Текущая модель трансмисии - {updatedData.transmission_model_details?.name}</option>
                                {transmissions.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>

                            {/*Зав. № трансмиссии*/}
                            <label>Зав. № трансмиссии:</label>
                            <input type="text" name="factory_number_of_transmission"
                                   value={updatedData.factory_number_of_transmission || ""} onChange={handleChange}/>

                            <label>Модель ведущего моста:</label>
                            <select
                                name="driving_bridge_model"
                                value={updatedData.driving_bridge_model?.id || ""}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value, 10);
                                    const selectedModel = drivingBridges.find(model => model.id === selectedId)
                                    setUpdatedData(prevState => ({
                                        ...prevState,
                                        driving_bridge_model: selectedModel || {}
                                    }));

                                    if (selectedModel) {
                                        updateField('driving_bridge_model', selectedModel.id, `http://127.0.0.1:8000/api/driving-bridges/${selectedModel.id}/`)
                                    }
                                }}
                            >
                                <option
                                    value="">Текущая модель ведущего моста - {updatedData.driving_bridge_model_details?.name}</option>
                                {drivingBridges.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>

                            {/*Зав. № ведущего моста*/}
                            <label>Зав. № ведущего моста:</label>
                            <input type="text" name="factory_number_of_drive_axle"
                                   value={updatedData.factory_number_of_drive_axle || ""} onChange={handleChange}/>

                            <label>Модель управляемого моста:</label>
                            <select
                                name="controlled_bridge_model"
                                value={updatedData.controlled_bridge_model?.id || ""}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value, 10);
                                    const selectedModel = controlledBridges.find(model => model.id === selectedId)
                                    setUpdatedData(prevState => ({
                                        ...prevState,
                                        controlled_bridge_model: selectedModel || {}
                                    }));

                                    if (selectedModel) {
                                        updateField('controlled_bridge_model', selectedModel.id, `http://127.0.0.1:8000/api/controlled-bridges/${selectedModel.id}/`)
                                    }
                                }}
                            >
                                <option
                                    value="">Текущая модель управлямемого моста - {updatedData.controlled_bridge_model_details?.name}</option>
                                {controlledBridges.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>

                            {/*Зав. № управляемого моста*/}
                            <label>Зав. № управляемого моста:</label>
                            <input type="text" name="factory_number_of_controlled_bridge"
                                   value={updatedData.factory_number_of_controlled_bridge || ""}
                                   onChange={handleChange}/>

                            {/*Дата отгрузки с завода*/}
                            <label>Дата отгрузки с завода:</label>
                            <input type="date" name="date_of_shipment_from_the_factory"
                                   value={updatedData.date_of_shipment_from_the_factory || ""} onChange={handleChange}/>

                            <label>Покупатель:</label>
                            <select
                                name="client"
                                value={updatedData.client?.id || ""}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value, 10);
                                    const selectedModel = clients.find(model => model.id === selectedId)
                                    setUpdatedData(prevState => ({
                                        ...prevState,
                                        client: selectedModel || {}
                                    }));

                                    if (selectedModel) {
                                        updateField('client', selectedModel.id, `http://127.0.0.1:8000/api/clients/${selectedModel.id}/`)
                                    }
                                }}
                            >
                                <option
                                    value="">Текущий покупатель - {updatedData.client_details?.name}</option>
                                {clients.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>

                            {/*Грузополучатель*/}
                            <label>Грузополучатель:</label>
                            <select
                                name="recipient"
                                value={updatedData.recipient?.id || ""}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value, 10);
                                    const selectedModel = recipients.find(model => model.id === selectedId)
                                    setUpdatedData(prevState => ({
                                        ...prevState,
                                        recipient: selectedModel || {}
                                    }));

                                    if (selectedModel) {
                                        updateField('recipient', selectedModel.id, `http://127.0.0.1:8000/api/recipients/${selectedModel.id}/`)
                                    }
                                }}
                            >
                                <option
                                    value="">Текущий грузополучатель - {updatedData.recipient_details?.name}</option>
                                {recipients.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>

                            {/*Адрес поставки*/}
                            <label>Адрес поставки:</label>
                            <input type="text" name="delivery_address" value={updatedData.delivery_address || ""}
                                   onChange={handleChange}/>

                            {/*Комплектации*/}
                            <label>Комплектации:</label>
                            <input type="text" name="equipment" value={updatedData.equipment || ""}
                                   onChange={handleChange}/>

                            <label>Сервисная компания:</label>
                            <select
                                name="service_company"
                                value={updatedData.service_company?.id || ""}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value, 10);
                                    setUpdatedData(prevState => ({
                                        ...prevState,
                                        service_company: selectedId || null
                                    }));
                                }}
                            >
                                <option value="">Текущая сервисная компания - {updatedData.service_company_detail?.name}</option>
                                {serviceCompanies.map(company => (
                                    <option key={company.id} value={company.id}>{company.name}</option>
                                ))}
                            </select>

                            <button onClick={updateCar}>Сохранить</button>
                            <button className={'close-btn'} onClick={closeModal}>Отмена</button>

                        </div>

                    </div>
                )}
        </>
    )
}


export default GeneralInformation;
