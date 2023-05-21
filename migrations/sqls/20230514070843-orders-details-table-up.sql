CREATE TABLE order_details (  
    id SERIAL PRIMARY KEY,   
    order_id INT NOT NULL,    
    product_id INT NOT NULL,  
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE, 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE 
);