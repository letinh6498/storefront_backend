 CREATE TYPE status AS ENUM ('active', 'complete');
 CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    current_status status NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
);
