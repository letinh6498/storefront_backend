

## Data Shapes

### Users

| Column       | Type                |
| ------------ | ------------------- |
| id           | SERIAL PRIMARY KEY  |
| username     | VARCHAR(255)        |
| first_name   | VARCHAR(255)        |
| last_name    | VARCHAR(255)        |
| email        | VARCHAR(255)        |
| password     | VARCHAR(255)        |

### Products

| Column       | Type                |
| ------------ | ------------------- |
| id           | SERIAL PRIMARY KEY  |
| name         | VARCHAR(255)        |
| description  | TEXT                |
| price        | INTEGER             |

### Orders

| Column           | Type                |
| ---------------- | ------------------- |
| id               | SERIAL PRIMARY KEY  |
| user_id          | INT                 |
| created_at       | TIMESTAMP           |
| current_status   | status ENUM         |

### Order_details

| Column        | Type                |
| ------------- | ------------------- |
| id            | SERIAL PRIMARY KEY  |
| order_id      | INT                 |
| product_id    | INT                 |
| quantity      | INT                 |
