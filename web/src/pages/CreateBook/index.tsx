// Node modules
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiArrowLeft } from 'react-icons/fi';

// Local modules
import './style.css';
import api from '../../services/api';

const CreateBook = () => {
    const history = useHistory();
    const user_id = localStorage.getItem('user_id');

    const [darkMode, setDarkMode] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isdonation: false
    });

    useEffect(() => {
        const isDark = localStorage.getItem('dark-mode') || 'false';
        setDarkMode(JSON.parse(isDark));

        if (!user_id) setTimeout(() => history.push('/'), 2000);
    }, [history, user_id]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value, checked } = e.target;

        const inputValue = e.target.type === 'checkbox' ? checked : value;
        setFormData({
            ...formData,
            [name]: inputValue
        });
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const { title, description, isdonation } = formData;

        const data = {
            title,
            description,
            isdonation
        };

        try {
            await api.post('/books', data, {
                headers: {
                    Authorization: user_id
                }
            });

            history.goBack();
        } catch(err) {
            alert('Erro na requisição. Tente novamente!')
        }
    }

    if (!user_id) {
        return <div></div>
    }

    return (
        <div className={ darkMode ? "create-book centered bg-dark" : "create-book centered bg-light" }>
            <main className="centered-content">
                <section
                    className={ darkMode ? 'form bg-contrast-dark' : 'form bg-contrast-light' }
                >
                    <h1 className={ darkMode ? 'text-dark' : 'text-secundary' }>
                        Registrar um livro
                    </h1>

                    <form onSubmit={ handleSubmit }>
                        <input
                            className={ 
                                darkMode 
                                ? 'bg-contrast-dark input light-border text-dark'
                                : 'bg-contrast-light input dark-border text-light'
                            }
                            name="title"
                            value={ formData.title }
                            onChange={ handleChange }
                            placeholder='Título'
                        />

                        <input
                            className={ 
                                darkMode 
                                ? 'bg-contrast-dark input light-border text-dark' 
                                : 'bg-contrast-light input dark-border text-light'
                            }
                            name="description"
                            value={ formData.description }
                            onChange={ handleChange }
                            placeholder='Descrição'
                        />

                        <label className={ 
                            darkMode 
                            ? 'text-dark' 
                            : 'text-primary' 
                        }>
                            Doação
                            <input
                                name="isdonation"
                                checked={ formData.isdonation }
                                onChange={ handleChange }
                                type='checkbox'
                            />
                        </label>

                        <hr/>

                        <button
                            className={ darkMode ? 'button bg-dark' : 'button bg-red' }
                            type="submit"
                        >
                            Registrar
                        </button>
                    </form>
                    <Link
                        className={ darkMode ? 'text-dark' : 'text-secundary' }
                        to='/profile'
                    >
                        <FiArrowLeft />
                        Voltar à Home
                    </Link>
                </section>
            </main>
        </div>
    );
}

export default CreateBook;