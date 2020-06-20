// Node modules
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';

import { LeafletMouseEvent } from 'leaflet';

// Local modules
import './style.css';
import BgToggler from '../../components/BgToggler';
import api from '../../services/api';

const Register = () => {
    const history = useHistory();

    const [darkMode, setDarkMode] = useState(false);
    const [defaultLocation, setDefaultLocation] = useState<[number, number]>([0, 0]);
    const [selectedLocation, setSelectedLocation] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({
       name: '' ,
       lastname: '',
       email: '',
       pass: '',
       whatsapp: ''
    });

    useEffect(() => {
        const isDark = localStorage.getItem('dark-mode') || 'false';
        setDarkMode(JSON.parse(isDark));

        const user_id = localStorage.getItem('user_id');
        if (user_id) setTimeout(() => history.push('/profile'), 2000);
    }, [history]);

    useEffect(() => {
        localStorage.setItem('dark-mode', JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;

                setDefaultLocation([latitude, longitude]);
                setSelectedLocation([latitude, longitude]);
            },
            () => alert('Erro ao obter localização...')
        );
    }, []);

    function handleBgToggler() {
        setDarkMode(state => !state);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const { name, lastname, email, pass, whatsapp } = formData;
        const [latitude, longitude] = selectedLocation;

        const data = {
            name,
            lastname,
            email,
            pass,
            whatsapp,
            latitude,
            longitude
        };

        try {
            const response = await api.post('users', data);
            const { id } = response.data;

            localStorage.setItem('user_id', String(id));
            history.push('/profile');
        } catch(err) {
            alert('Erro na requisição. Tente novamente.');
        }
    }

    function handleSelectLocation(e: LeafletMouseEvent) {
        const { lat, lng } = e.latlng;
        setSelectedLocation([lat, lng]);
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const inputName = e.target.name;
        const inputValue = e.target.value;

        setFormData({
            ...formData,
            [inputName]: inputValue
        });
    }

    if (localStorage.getItem('user_id')) {
        return <div></div>
    }

    return (
        <div className={ darkMode ? 'register centered bg-dark' : 'register centered bg-light' }>
            <header>
                <BgToggler checked={ darkMode } onChange={ handleBgToggler } />
            </header>

            <main className="centered-content">
                <section 
                    className={ darkMode ? 'form bg-contrast-dark' : 'form bg-contrast-light' }
                >
                    <h1 
                        className={ darkMode ? 'text-dark' : 'text-secundary' }
                    >
                        Criar uma conta
                    </h1>

                    <form onSubmit={ handleSubmit }>
                        <div className='input-group'>
                            <input
                                className={ 
                                    darkMode 
                                    ? 'input text-dark light-border bg-contrast-dark dark-border'
                                    : 'input text-primary bg-contrast-light dark-border' 
                                }
                                name='name'
                                value={ formData.name }
                                onChange={ handleChange }
                                placeholder='Nome'
                                autoCorrect='false'
                                autoComplete='false'
                            />
                            
                            <input
                                className={ 
                                    darkMode 
                                    ? 'input text-dark bg-contrast-dark light-border'
                                    : 'input text-primary bg-contrast-light dark-border' 
                                }
                                name='lastname'
                                value={ formData.lastname }
                                onChange={ handleChange }
                                placeholder='Sobrenome'
                                autoCorrect='false'
                                autoComplete='false'
                            />
                        </div>

                        <div className="input-group">
                            <input
                                className={ 
                                    darkMode 
                                    ? 'input text-dark light-border bg-contrast-dark dark-border'
                                    : 'input text-primary bg-contrast-light dark-border' 
                                }
                                name='email'
                                value={ formData.email }
                                onChange={ handleChange }
                                placeholder='E-mail'
                                autoCorrect='false'
                                autoComplete='false'
                            />
                            <input
                                className={ 
                                    darkMode 
                                    ? 'input text-dark bg-contrast-dark light-border'
                                    : 'input text-primary bg-contrast-light dark-border' 
                                }
                                name='pass'
                                value={ formData.pass }
                                onChange={ handleChange }
                                type='password'
                                placeholder='Senha'
                                autoCorrect='false'
                                autoComplete='false'
                            />
                        </div>

                        <Map 
                            center={ defaultLocation } 
                            zoom={ 17 }
                            className='map'
                            onClick={ handleSelectLocation }
                        >
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker position={ selectedLocation }></Marker>
                        </Map>

                        <input
                            className={ 
                                darkMode 
                                ? 'input text-dark bg-contrast-dark light-border'
                                : 'input text-primary bg-contrast-light dark-border' 
                            }
                            name='whatsapp'
                            value={ formData.whatsapp }
                            onChange={ handleChange }
                            placeholder='Whatsapp'
                            autoCorrect='false'
                            autoComplete='false'
                        />

                        <hr />

                        <button 
                            className={ darkMode ? 'button bg-dark' : 'button bg-red' } 
                            type="submit"
                        >
                            Registrar
                        </button>
                    </form>

                    <Link
                        className={ darkMode ? 'text-dark' : 'text-secundary' }
                        to="/"
                    >
                        <FiArrowLeft />
                        Voltar para Home
                    </Link>
                </section>
            </main>
        </div>
    );
}

export default Register;