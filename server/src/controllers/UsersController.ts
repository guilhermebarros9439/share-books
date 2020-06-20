// Node modules
import { Request, Response } from 'express';

// Local modules
import knex from '../database/connection';
import findNearestPoints from '../utils/findNearestPoints';

// User behavours
class UsersController {
    // List all users or filtered by: location, book title or book donation
    async index(req: Request, res: Response) {
        const { isdonation, title, maxdistance } = req.query;
        const id = req.headers.authorization;

        // All users
	    let users = await knex('users').select('*');

        // All users except the logged one
        if (id) {
            users = await knex('users')
                .select('*')
                .where('id', '<>', Number(id));
        }

        // Filtered by donation
        if (isdonation) {
            users = await knex('users')
                .join('books', 'users.id', '=', 'books.user_id')
                .where('books.isdonation', Number(isdonation))
                .andWhere('users.id', '<>', Number(id))
                .distinct()
                .select('users.*');
        }
        
        // Filtered by book title
        if (title) {
            users = await knex('users')
                .join('books', 'users.id', '=', 'books.user_id')
                .where('books.title', 'LIKE', `%${ String(title) }%`)
                .andWhere('users.id', '<>', Number(id))
                .distinct()
                .select('users.*');
        }
        
        // Filtered by donation and title
        if (isdonation && title) {
            users = await knex('users')
                .join('books', 'users.id', '=', 'books.user_id')
                .where('books.title', 'LIKE', `%${ String(title) }%`)
                .andWhere('books.isdonation', Number(isdonation))
                .andWhere('users.id', '<>', Number(id))
                .distinct()
                .select('users.*');
        }
        
        // Filtered by location
        if (maxdistance) {
            findNearestPoints(users, Number(id), Number(maxdistance));
        }
        
        // Filtered by location and donation
        if (isdonation && maxdistance) {
            users = await knex('users')
                .join('books', 'users.id', '=', 'books.user_id')
                .where('books.isdonation', Number(isdonation))
                .andWhere('users.id', '<>', Number(id))
                .distinct()
                .select('users.*');

            findNearestPoints(users, Number(id), Number(maxdistance));
        }
        
        // Filtered by location and book title
        if (title && maxdistance) {
            users = await knex('users')
                .join('books', 'users.id', '=', 'books.user_id')
                .where('books.title', 'LIKE', `%${ String(title) }%`)
                .andWhere('users.id', '<>', Number(id))
                .distinct()
                .select('users.*');

            findNearestPoints(users, Number(id), Number(maxdistance));
        }
        
        // Filtered by location, book title and donation
        if (isdonation && title && maxdistance) {
            users = await knex('users')
                .join('books', 'users.id', '=', 'books.user_id')
                .where('books.isdonation', Number(isdonation))
                .andWhere('books.title', 'LIKE', `%${ String(title) }%`)
                .andWhere('users.id', '<>', Number(id))
                .distinct()
                .select('users.*');

            findNearestPoints(users, Number(id), Number(maxdistance));
        }

        const serializedUsers = users.map(user => ({
            ...user,
            avatar_url: `http://localhost:3333/uploads/${ user.avatar }`
        }));

        return res.json(serializedUsers);
    }

    // List current logged user
    async show(req: Request, res: Response) {
        const { id } = req.params;

        const [ user ] = await knex('users')
            .where('id', id);

        const books = await knex('books')
            .join('users', 'books.user_id', '=', 'users.id')
            .where('books.user_id', id)
            .select('books.*');

        const serializedBooks = books.map(book => ({
            ...book,
            image_url: `http://localhost:3333/uploads/${ book.image }`
        }));

        const serializedUser = {
            ...user,
            avatar_url: `http://localhost:3333/uploads/${ user.avatar }`,
            books: serializedBooks
        };

        return res.json(serializedUser);
    }

    // Create User
    async register(req: Request, res: Response) {
        const {
            name,
            lastname,
            email,
            pass,
            whatsapp,
            latitude,
            longitude
        } = req.body;
    
        const user = {
            avatar: 'avatar.png',
            name,
            lastname,
            email,
            pass,
            whatsapp,
            latitude,
            longitude
        };
    
        const [id] = await knex('users').insert(user);
    
        return res.json({
            id,
            ...user
        });
    }

    // Update user
    async update(req: Request, res: Response) {
        const { name, lastname, whatsapp, latitude, longitude } = req.body;
    
        const { id } = req.params;
    
        await knex('users')
            .where('id', Number(id))
            .update({
                name,
                lastname,
                whatsapp,
		latitude,
		longitude
            });
    
        return res.json({ message: 'success!' });
    }

    // Delete user and books
    async delete(req: Request, res: Response) {
        const { id } = req.params;

	const trx = await knex.transaction();
    
        await trx('books')
            .where('user_id', Number(id))
            .delete();

	await trx('users')
	    .where('id', Number(id))
	    .delete();

	trx.commit();
    
        return res.json({ message: 'success!' });
    }
}

export default UsersController;