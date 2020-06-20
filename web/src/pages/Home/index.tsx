// Node modules
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { FiLogIn } from 'react-icons/fi';

import { Link, useHistory } from 'react-router-dom';

// Local modules
import './style.css';
import logoImg from '../../assets/logo.svg';

import BgToggler from '../../components/BgToggler';
import api from '../../services/api';

const Home = () => {
    const history = useHistory();

    const [darkMode, setDarkMode] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        pass: ''
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

    function handleBgToggler() {
        setDarkMode(state => !state);
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const inputName = e.target.name;
        const inputValue = e.target.value;

        setFormData({
            ...formData,
            [inputName]: inputValue
        });
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const { email, pass } = formData;

        const data = {
            email,
            pass
        };

        try {
            const response = await api.post('sessions', data);
            const { id } = response.data;

            if (!id) {
                return alert('Email ou senha inválidas!');
            }

            localStorage.setItem('user_id', id);
            history.push('/profile');
        } catch(err) {
            alert('Erro na requisição. Tente novamente!');
        }
    }

    if (localStorage.getItem('user_id')) {
        return <div></div>
    }

    return (
        <div className={ darkMode ? 'home centered bg-dark' : 'home centered bg-light' }>
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
                        Login
                    </h1>
                    <form onSubmit={ handleSubmit }>
                        <input
                            className={ 
                                darkMode
                                ? 'input text-dark bg-contrast-dark light-border'
                                : 'input text-primary bg-contrast-light dark-border'
                            }
                            name='email'
                            value={ formData.email }
                            onChange={ handleChange }
                            placeholder='E-mail'
                            autoCorrect='false'
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
                        />
                        <hr />
                        <button 
                            className={ darkMode ? 'button bg-dark' : 'button bg-red' } 
                            type="submit"
                        >
                            Entrar
                        </button>
                    </form>
                    <Link
                        className={ darkMode ? 'text-dark' : 'text-secundary' }
                        to="/register"
                    >
                        Cadastrar-se
                        <FiLogIn />
                    </Link>
                </section>
                <section className="logo">
                    <img src={ logoImg } alt="Logo - Share Books"/>{
                        darkMode 
                        ? <h1 className='text-dark'>Share Books</h1>
                        : (
                            <h1>
                                <span className='text-secundary'>Share</span> Books
                            </h1>
                        )
                    }<p className={ darkMode ? 'text-dark' : 'text-primary' }>Compartilhe cultura</p>
                </section>
            </main>
        </div>
    );
}

export default Home;