// Node modules
import React, { useState, useEffect, FormEvent, ChangeEvent, MouseEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiArrowLeft, FiTrash } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';

import { LeafletMouseEvent } from 'leaflet';

// Local modules
import './style.css';
import BgToggler from '../../components/BgToggler';
import api from '../../services/api';

interface Params {
    id: number;
    name: string;
    lastname: string;
    whatsapp: string;
}

const Register = () => {
    const history = useHistory();
    const params = history.location.state as Params;

    const [darkMode, setDarkMode] = useState(false);

    const [defaultLocation, setDefaultLocation] = useState<[number, number]>([0, 0]);
    const [selectedLocation, setSelectedLocation] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({
       name: '' ,
       lastname: '',
       whatsapp: ''
    });

    useEffect(() => {
        const isDark = localStorage.getItem('dark-mode') || 'false';
        setDarkMode(JSON.parse(isDark));

        const user_id = localStorage.getItem('user_id');

        if (!user_id) setTimeout(() => history.push('/'), 2000);

        if (params) {
            const { name, lastname, whatsapp } = params;

            setFormData({
                name,
                lastname,
                whatsapp
            });
        }
    }, [params, history]);

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

    function handleDelete(e: MouseEvent<HTMLButtonElement>) {
        const target = e.currentTarget;

        if (target.classList.contains('text-secundary')) {
            target.classList.add('bg-red');
            target.classList.add('text-dark');
            target.classList.remove('text-secundary');

            setTimeout(() => {
                target.classList.remove('bg-red');
                target.classList.remove('text-dark');
                target.classList.add('text-secundary');
            }, 2000);
        } else {
            const id = params.id;

            api.delete(`users/${ id }`).then(() => {
                localStorage.removeItem('user_id');
                history.push('/');
            });
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const { name, lastname, whatsapp } = formData;
        const [latitude, longitude] = selectedLocation;

        const data = {
            name,
            lastname,
            whatsapp,
            latitude,
            longitude
        };

        try {
            const id = params.id;
            await api.put(`users/${ id }`, data);

            history.goBack();
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

    if (!localStorage.getItem('user_id')) {
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
                        Editar perfil
                    </h1>

                    <button
                        onClick={ handleDelete }
                        className='text-secundary delete-book dark-border'
                    >
                        <FiTrash size={ 20 } />
                    </button>

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

                        {/* <div className="input-group">
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
                        </div> */}

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
                            Salvar
                        </button>
                    </form>

                    <Link
                        className={ darkMode ? 'text-dark' : 'text-secundary' }
                        to="/profile"
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