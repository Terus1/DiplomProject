import './GeneralInformation.css'
import {useEffect, useState} from "react";
import {options} from "axios";


function GeneralInformation({cars, setCars, error, user, techniques, engines, transmissions, drivingBridges, controlledBridges,
                                clients, serviceCompanies, fetchData}) {
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
    }); // Измененные данные
    const [isModalOpenForChangeCar, setIsModalOpenForChangeCar] = useState(false);





    useEffect(() => {
        if (cars && cars.length > 0) {
            const firstCar = cars[0];

            setUpdatedData(prevState => {
                const newData = {
                    ...firstCar,
                    model_of_technique: firstCar.model_of_technique_details?.id || {},
                    engine_model: firstCar.engine_model_details?.id || {},
                    transmission_model: firstCar.transmission_model_details?.id || {},
                    driving_bridge_model: firstCar.driving_bridge_model_details?.id || {},
                    controlled_bridge_model: firstCar.controlled_bridge_model_details?.id || {},
                    service_company: firstCar.service_company_details?.id || {},
                };

                console.log("Обновленные данные updatedData:", newData);
                return newData;
            });
        }
        console.log('cars', cars)
        console.log('techniques', techniques)
        console.log('engines', engines)
    }, [cars, techniques, engines]);


    useEffect(() => {
        if (updatedData.id) {
            console.log('Обновленные updatedData:', updatedData);
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
                model_of_technique: updatedData.model_of_technique ? Number(updatedData.model_of_technique.id) : null,
                engine_model: updatedData.engine_model?.id || null,
                transmission_model: updatedData.transmission_model?.id || null,
                driving_bridge_model: updatedData.driving_bridge_model?.id || null,
                controlled_bridge_model: updatedData.controlled_bridge_model?.id || null,
                service_company: updatedData.service_company?.id || null,
            };
            console.log("Отправляемые данные: (dataToSend)", dataToSend);
            console.log('updatedData', updatedData)
            console.log("model_of_technique перед отправкой:", updatedData.model_of_technique);


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
            const token = localStorage.getItem('access_token');

            const dataToSend = { [field]: value};
            console.log('Отправляем PATCH запрос на эндпоинт', endpoint);

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Ответ сервера эндпоинта', endpoint, '=', responseData);
                return responseData;
            } else {
                console.error(`Ошибка при обновлении данных эндпоинта ${endpoint}`);
            }

        } catch (error) {
            console.error(`Ошибка при выполнении запроса эндпоинта ${endpoint}, ошибка = ${error}`)
        }
    }

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
                    {cars.length > 0 ? (
                        cars.map((car, index) => (
                            (car.client_details === user.nickname ? (<tr key={car.id}>
                                <td>Машина № {index + 1} <br/>
                                    <button className="change-info-about-car"
                                            onClick={() => openEditModal(car)}>Изменить
                                    </button>
                                </td>

                                {/* Модель техники */}
                                <td>
                                    <button className="button-info"
                                            onClick={() => openWindowForModel('Техника', car.model_of_technique_details?.name || 'Не указано', car.model_of_technique_details?.description || 'Описание отсутствует')}>
                                        <span
                                            className={'object-of-car'}>{car.model_of_technique_details?.name || 'Не указано'}</span>
                                    </button>
                                </td>


                                {/* Зав. № машины */}
                                <td>{car.machines_factory_number || "—"}</td>

                                {/* Модель двигателя */}
                                <td>{car.engine_model_details?.name || "—"}</td>

                                {/* Зав. № двигателя */}
                                <td>{car.engine_serial_number || "—"}</td>

                                {/* Трансмиссия */}
                                <td>{car.transmission_model_details?.name || "—"}</td>

                                {/* Зав. № трансмиссии */}
                                <td>{car.factory_number_of_transmission || "—"}</td>

                                {/* Ведущий мост */}
                                <td>{car.driving_bridge_model_details?.name || "—"}</td>

                                {/* Зав. № ведущего моста */}
                                <td>{car.factory_number_of_drive_axle || "—"}</td>

                                {/* Управляемый мост */}
                                <td>{car.controlled_bridge_model_details?.name || "—"}</td>

                                {/* Зав. № управляемого моста */}
                                <td>{car.factory_number_of_controlled_bridge || "—"}</td>

                                {/* Дата отгрузки */}
                                <td>{car.date_of_shipment_from_the_factory || "—"}</td>

                                {/* Покупатель */}
                                <td>{car.client_details || "—"}</td>

                                {/* Грузополучатель */}
                                <td>{car.recipient || "—"}</td>

                                {/* Адрес поставки */}
                                <td>{car.delivery_address || "—"}</td>

                                {/* Комплектация */}
                                <td>{car.equipment || "—"}</td>

                                {/* Сервисная компания */}
                                <td>{car.service_company_details || "—"}</td>
                            </tr>) : (<></>))

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
                                        model_of_technique: selectedModel, // Теперь сохраняем весь объект
                                    }));

                                    // Проверяем, найден ли объект, и обновляем данные с сервером
                                    if (selectedModel) {
                                        updateField("model_of_technique", selectedModel, `http://127.0.0.1:8000/api/techniques/${selectedModel.id}/`);
                                    }
                                }}
                            >
                                <option value="">{updatedData.model_of_technique?.name || "Выберите модель"}</option>
                                {techniques.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>


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
                                        engine_model: selectedModel
                                    }));

                                    if (selectedModel) {
                                        updateField('engine_model', selectedModel, `http://127.0.0.1:8000/api/engines/${selectedModel.id}/`)
                                    }
                                }}
                            >
                                {/*<option value="">{updatedData.engine_model?.name || "Выберите модель"}</option>*/}
                                {engines.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>

                            <label>Зав. № двигателя:</label>
                            <input type="text" name="engine_serial_number"
                                   value={updatedData.engine_serial_number || ""} onChange={handleChange}/>

                            <label>Модель трансмиссии:</label>
                            <input type="text" name="transmission_model"
                                   value={updatedData.transmission_model?.name || ""} onChange={handleChange}/>


                            <label>Зав. № трансмиссии:</label>
                            <input type="text" name="factory_number_of_transmission"
                                   value={updatedData.factory_number_of_transmission || ""} onChange={handleChange}/>

                            <label>Модель ведущего моста:</label>
                            <input type="text" name="driving_bridge_model"
                                   value={updatedData.driving_bridge_model?.name || ""} onChange={handleChange}/>

                            <label>Зав. № ведущего моста:</label>
                            <input type="text" name="factory_number_of_drive_axle"
                                   value={updatedData.factory_number_of_drive_axle || ""} onChange={handleChange}/>

                            <label>Модель управляемого моста:</label>
                            <input type="text" name="controlled_bridge_model"
                                   value={updatedData.controlled_bridge_model?.name || ""} onChange={handleChange}/>

                            <label>Зав. № управляемого моста:</label>
                            <input type="text" name="factory_number_of_controlled_bridge"
                                   value={updatedData.factory_number_of_controlled_bridge || ""}
                                   onChange={handleChange}/>

                            <label>Дата отгрузки с завода:</label>
                            <input type="date" name="date_of_shipment_from_the_factory"
                                   value={updatedData.date_of_shipment_from_the_factory || ""} onChange={handleChange}/>

                            <label>Покупатель:</label>
                            <input type="text" name="client" value={updatedData.client || ""} onChange={handleChange}/>

                            <label>Грузополучатель:</label>
                            <input type="text" name="recipient" value={updatedData.recipient || ""}
                                   onChange={handleChange}/>

                            <label>Адрес поставки:</label>
                            <input type="text" name="delivery_address" value={updatedData.delivery_address || ""}
                                   onChange={handleChange}/>

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
                                <option value="">{updatedData.service_company?.name || "Выберите компанию"}</option>
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
