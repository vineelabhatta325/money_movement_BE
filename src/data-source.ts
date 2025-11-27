import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { Treasury } from './entities/Treasury';
import { Quote } from './entities/Quote';
import { Transaction } from './entities/Transaction';
import dotenv from 'dotenv';

dotenv.config();

let connection: Connection;

export const initializeDatabase = async (): Promise<Connection> => {
    if (!connection) {
        connection = await createConnection({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            synchronize: false,
            logging: false,
            entities: [Treasury, Quote, Transaction],
        });
    }
    return connection;
};

export const getConnection = (): Connection => {
    if (!connection) {
        throw new Error('Database not initialized. Call initializeDatabase first.');
    }
    return connection;
};
