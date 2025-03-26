import { useEffect, useState } from "react";
import axios from "axios";
import "./Main.css";

function Main({ cars, setCars, error, setError, token }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCars, setFilteredCars] = useState([]);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/cars/", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setCars(response.data);
                setFilteredCars(response.data); // Заполняем изначальный список
                setError(null);
            } catch (error) {
                console.error("Ошибка при получении машин", error);
                setError("Ошибка загрузки данных. Попробуйте позже.");
            }
        };

        fetchCars();
    }, [token]);

    const handleSearch = () => {
        const filtered = cars.filter(car =>
            car.machines_factory_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCars(filtered);
    };

    return (
        <div className="main">
            <p className="main-text">Проверьте комплектацию и технические характеристики техники Силант</p>

            <div className="search-elements">
                <div className="factory-number-elements">
                    <p className="factory-number-text">Поиск по заводскому номеру машины: </p>
                    <input
                        type="text"
                        className="input-factory-number"
                        placeholder="Введите номер"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="search-button" onClick={handleSearch}>Поиск</button>
            </div>

            <div className="search-result">
                <p className="search-result-text">Информация о комплектации и технических характеристиках</p>

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
                            <th>Модель трансмиссии</th>
                            <th>Зав. № трансмиссии</th>
                            <th>Модель ведущего моста</th>
                            <th>Зав. № ведущего моста</th>
                            <th>Модель управляемого моста</th>
                            <th>Зав. № управляемого моста</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredCars.length > 0 ? (
                            filteredCars.map((car, index) => (
                                <tr key={car.id}>
                                    <td>{index + 1}</td>
                                    <td>{car.model_of_technique_details.name || "нет данных"}</td>
                                    <td>{car.machines_factory_number}</td>
                                    <td>{car.engine_model_details.name || "нет данных"}</td>
                                    <td>{car.engine_serial_number}</td>
                                    <td>{car.transmission_model_details.name || "нет данных"}</td>
                                    <td>{car.factory_number_of_transmission}</td>
                                    <td>{car.driving_bridge_model_details.name || "нет данных"}</td>
                                    <td>{car.factory_number_of_drive_axle}</td>
                                    <td>{car.controlled_bridge_model_details.name || "нет данных"}</td>
                                    <td>{car.factory_number_of_controlled_bridge}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11">Данных нет</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Main;
