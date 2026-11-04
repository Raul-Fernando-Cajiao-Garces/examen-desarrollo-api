-- Esquema de base de datos para examen-desarrollo-api
-- PostgreSQL

DROP TABLE IF EXISTS books CASCADE;
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) NOT NULL,
    copies INTEGER NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS members CASCADE;
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    membership_type VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true
);
