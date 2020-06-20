// Node modules
import express from 'express';

// Local modules
import UsersController from './controllers/UsersController';
import BooksController from './controllers/BooksController';
import SessionsController from './controllers/SessionsController';

const routes = express.Router();

// Controllers instances
const usersController = new UsersController();
const booksController = new BooksController();
const sessionsController = new SessionsController();

// User routes
routes.get('/users', usersController.index);
routes.get('/users/:id', usersController.show);
routes.post('/users', usersController.register);
routes.put('/users/:id', usersController.update);
routes.delete('/users/:id', usersController.delete);

// Book routes
routes.get('/books', booksController.index);
routes.post('/books', booksController.register);
routes.put('/books/:id', booksController.update);
routes.delete('/books/:id', booksController.delete);

// Session routes
routes.post('/sessions', sessionsController.register);

export default routes;