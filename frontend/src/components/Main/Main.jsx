import './Main.css'
import axios from "axios";
import {useEffect} from "react";

function Main({cars, setCars, error, setError, token}) {

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/cars/", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}, // Добавляем заголовок только если есть токен
                });
                // console.log("Данные машин", response.data);
                setCars(response.data);
                setError(null);
                console.log(cars)
            } catch (error) {
                console.error("Ошибка при получении машин", error);
                setError("Ошибка загрузки данных. Попробуйте позже.");
            }
        };

        fetchCars();
    }, [token]);

    return (
        <div className={'main'}>
            <p className={'main-text'}>Проверьте комплектацию и технические характеристики техники Силант</p>

            <div className="search-elements">

                <div className="factory-number-elements">
                    <p className={'factory-number-text'}>Заводской номер: </p>
                    <input type="text" className={'input-factory-number'} placeholder={'поле ввода'}/>
                </div>

                <button className={'search-button'}>Поиск</button>

            </div>

            <div className="search-result">
                <p className={'search-result-text'}>Информация о комплектации и технических характеристик Вашей
                    техники</p>


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
                            {/*<th>Дата отгрузки с завода</th>*/}
                            {/*<th>Покупатель</th>*/}
                            {/*<th>Грузополучатель (конечный потребитель)</th>*/}
                            {/*<th>Адрес поставки (эксплуатации)</th>*/}
                            {/*<th>Комплектации (доп. опции)</th>*/}
                            {/*<th>Сервисная компания</th>*/}
                        </tr>
                        </thead>
                        <tbody>
                        {cars.length > 0 ? (
                            cars.map((car, index) => (
                                <tr key={car.id}>
                                    <td>{index + 1}</td>
                                    <td>{car.model_of_technique_details.name || 'нет данных'}</td>
                                    {/* Модель техники */}
                                    <td>{car.machines_factory_number}</td>
                                    {/* Зав. № машины */}
                                    <td>{car.engine_model_details.name || 'нет данных'}</td>
                                    {/* Модель двигателя */}
                                    <td>{car.engine_serial_number}</td>
                                    {/* Зав. № двигателя */}
                                    <td>{car.transmission_model_details.name || 'нет данных'}</td>
                                    {/* Модель трансмиссии (производитель, артикул) */}
                                    <td>{car.factory_number_of_transmission}</td>
                                    {/* Зав. № трансмиссии */}
                                    <td>{car.driving_bridge_model_details.name || 'нет данных'}</td>
                                    {/* Модель ведущего моста */}
                                    <td>{car.factory_number_of_drive_axle}</td>
                                    {/* Зав. № ведущего моста */}
                                    <td>{car.controlled_bridge_model_details.name || 'нет данных'}</td>
                                    {/* Модель управляемого моста */}
                                    <td>{car.factory_number_of_controlled_bridge}</td>
                                    {/* Зав. № управляемого моста */}
                                    {/*<td>{car.date_of_shipment_from_the_factory}</td>*/}
                                    {/*/!* Дата отгрузки с завода *!/*/}
                                    {/*<td>{car.client}</td>*/}
                                    {/*/!* Покупатель *!/*/}
                                    {/*<td>{car.recipient}</td>*/}
                                    {/*/!* Грузополучатель  *!/*/}
                                    {/*<td>{car.delivery_address}</td>*/}
                                    {/*/!* Адрес поставки *!/*/}
                                    {/*<td>{car.equipment}</td>*/}
                                    {/*/!* Комплектации  *!/*/}
                                    {/*<td>{car.service_company}</td>*/}
                                    {/*/!* Сервисная компания *!/*/}
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

            </div>
        </div>
    )
}


export default Main;
