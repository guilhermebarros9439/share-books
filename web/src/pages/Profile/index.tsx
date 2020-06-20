// Node modules
import React, { useState, useEffect } from 'react';
import { FiLogOut, FiEdit } from 'react-icons/fi';

import { Link, useHistory } from 'react-router-dom';

// Local modules
import './style.css';
import api from '../../services/api';

interface Book {
    id: number;
    image_url: string;
    title: string;
    description: string;
    isdonation: boolean;
}

const Profile = () => {
    const history = useHistory();
    const user_id = localStorage.getItem('user_id') || false;

    const [darkMode, setDarkMode] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        avatar_url: '',
        name: '',
        lastname: '',
        whatsapp: ''
    });
    
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const isDark = localStorage.getItem('dark-mode') || 'false';
        setDarkMode(JSON.parse(isDark));
    }, []);

    useEffect(() => {
        if (!user_id) {
            setTimeout(() => history.push('/'), 2000);
        }

        api.get(`users/${ user_id }`).then(response => {
            const { id, name, lastname, avatar_url, whatsapp, books } = response.data;

            setFormData({
                id,
                name,
                lastname,
                avatar_url,
                whatsapp
            });

            setBooks(books);
        });
    }, [history, user_id]);

    function handleLogOut() {
        localStorage.removeItem('user_id');
        history.push('/');
    }

    function handleBookClick(book: Book) {
        const { id, title, description, isdonation } = book;

        history.push('/books/edit', { 
            id,
            title,
            description,
            isdonation
        });
    }

    function handleProfileClick() {
        const { id, name, lastname, whatsapp } = formData;

        history.push('/profile/edit', {
            id,
            name,
            lastname,
            whatsapp
        });
    }

    if (!user_id || !formData.name) {
        return <div></div>;
    }

    return (
        <div className={ darkMode ? "profile bg-dark centered" : "profile bg-light centered" }>
            <header>
                <div className="container">
                    <div className="profile-info">
                        <button onClick={ handleProfileClick }>
                            <img
                                className={ darkMode ? 'bg-contrast-dark' : 'bg-contrast-light' }
                                src={ formData.avatar_url }
                                alt="Avatar"
                            />
                            <h3 className={ darkMode ? 'text-dark' : 'text-primary' }>Bem vindo, { formData.name }!</h3>
                            <p className='red-border text-secundary'>Editar Perfil</p>
                        </button>
                    </div>
                    
                    <button
                        onClick={ handleLogOut }
                        className='text-secundary'
                    >
                        Sair
                        <FiLogOut size={ 30 } />
                    </button>
                </div>
            </header>
            <main>
                <div className="library-title">
                    <h1 className='text-secundary'>Biblioteca</h1>
                    <p className={
                        darkMode ? 'text-dark' : 'text-primary'
                    }>Clique no botão para adicionar novos livros</p>
                </div>

                <ul className="library">{
                    books.map(book => (
                        <li
                            key={ book.id }
                            className={ 
                                darkMode 
                                ? "book bg-contrast-dark" 
                                : "book bg-contrast-light" 
                        }>
                            <img src={ book.image_url } alt="Livro"/>
                            <button 
                                className='edit-button text-secundary'
                                onClick={ () => handleBookClick(book) }
                            >
                                <FiEdit size={ 20 } />
                            </button>

                            <div className="book-info">{
                                    book.isdonation
                                    ? <p className='text-dark donation bg-red'>Doação</p>
                                    : <p className={ 
                                        darkMode 
                                        ? 'text-dark donation light-border'
                                        : 'text-primary donation dark-border' 
                                    }>
                                        Troca
                                    </p>
                                }<h2 className={ darkMode ? 'text-dark' : 'text-primary' }>{ book.title }</h2>
                                <p className={ 
                                    darkMode 
                                    ? 'text-dark description'
                                    : 'text-primary description'
                                }>{
                                    book.description ? book.description : '(Sem descrição)'
                                }</p>
                            </div>
                        </li>
                    ))
                }
                    <li>
                        <Link
                            to='/books/new'
                            className={ 
                                darkMode 
                                ? 'text-dark new-book bg-contrast-dark' 
                                : 'text-secundary new-book bg-contrast-light' }
                        >
                            +
                        </Link>
                    </li>
                </ul>
            </main>
        </div>
    );
}

export default Profile;