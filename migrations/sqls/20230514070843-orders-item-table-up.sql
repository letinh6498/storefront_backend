CREATE TABLE order_items (  
    id SERIAL PRIMARY KEY,   
    order_id INT NOT NULL,    
    product_id INT NOT NULL,  
    quantity INT NOT NULL,   
    price DECIMAL(10, 2) NOT NULL,  
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE, 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE 
);