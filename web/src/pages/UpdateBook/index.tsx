// Node modules
import React, { useState, useEffect, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiArrowLeft, FiTrash } from 'react-icons/fi';

// Local modules
import './style.css';
import api from '../../services/api';

interface Params {
    id: number;
    title: string;
    description: string;
    isdonation: boolean;
}

const UpdateBook = () => {
    const history = useHistory();
    const params = history.location.state as Params;

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

    useEffect(() => {
        setFormData(params);
    }, [params]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value, checked } = e.target;

        const inputValue = e.target.type === 'checkbox' ? checked : value;
        setFormData({
            ...formData,
            [name]: inputValue
        });
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
            const book_id = params.id;
            api.delete(`books/${ book_id }`, {
                headers: {
                    Authorization: user_id
                }
            }).then(() => history.goBack());
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const { title, description, isdonation } = formData;
        const id = params.id;

        const data = {
            title,
            description,
            isdonation
        };

        try {
            await api.put(`/books/${ id }`, data, {
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
                        Editar livro
                    </h1>

                    <button
                        onClick={ handleDelete }
                        className='text-secundary delete-book dark-border'
                    >
                        <FiTrash size={ 20 } />
                    </button>

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
                            Salvar
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

export default UpdateBook;