// --- Module to find nearest users using turfjs --- //

// Node Modules
import knex from '../database/connection';
import { point, distance } from '@turf/turf';

// function params (users, id, maxdistance), returns void.
interface Params {
    (users: {
        latitude: number;
        longitude: number;
    }[], 
    id: number,
    maxdistance: number): void;
}

// Function that returns users between logged user and the max distance in km
const findNearestPoints: Params = async (users, id, maxdistance) => {
    const { latitude, longitude } = await knex('users')
        .where('id', id)
        .select('latitude', 'longitude')
        .first();

    const relativePoint = point([latitude, longitude]);

    users = users.filter(user => {
        const { latitude, longitude } = user;
        const pointUser = point([latitude, longitude]);

        if (distance(relativePoint, pointUser) < maxdistance === false) {
            return;
        }

        return user;
    });
}

export default findNearestPoints;