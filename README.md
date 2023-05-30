# Project Name

API Store front backend

## Requirements

- Nodejs

## Installation

To install the dependencies for the project, run the following command:

npm install


## Formatting the Source Code

To format the source code of the project using Prettier, run the following command:

npm run prettier


## Checking the Source Code

To check the source code of the project using ESLint, run the following command:

npm run lint


## Running Tests

To run the tests of the project using Jasmine, run the following command:

npm run test


## Running the Project

To run the project, run the following commands:

nodemon
## docker compose file
create file docker compose.yml file and copy content to file
version: '3.8'
services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_PASSWORD: password
    ports:
    - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:

## Running docker compose
To run the project, run the following commands:
docker-compose up


The project will start and you can access it at [http://localhost:3000].

## Requirements
Check the "REQUIREMENTS.md" file to see the details.


## Environment

create file .env file and copy content to file
POSTGRES_HOST = 127.0.0.1
POSTGRES_DB = fantasy_worlds
POSTGRES_DB_DEV = fantasy_worlds_dev
POSTGRES_USER = postgres
POSTGRES_PASS = password
ENV = test
PEPPER=haha
SALT_ROUNDS = 10
TOKEN_SECRET = 52938f609c937763d72a390f76627292e3c81191812a735d16644a5b2e3e3a2d
PORT = 3000

## database.json

create file database.json file and copy content to file
{
    "prod": {
      "driver": "pg",
      "host": "127.0.0.1",
      "database": "fantasy_worlds",
      "user": "postgres",
      "password": "password"
    },
    "dev": {
      "driver": "pg",
      "host": "127.0.0.1",
      "database": "fantasy_worlds_dev",
      "user": "postgres",
      "password": "password"
    }
  }
