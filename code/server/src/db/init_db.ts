import db from "./db"


//creazione tabella products
let sql="CREATE TABLE products( \
        model text primary key,\
        sellingPrice float,\
        category text,\
        arrivalDate char(10),\
        details text,\
        quantity integer);";
db.run(sql, (err) => { if (err) throw err; });

//creazione tabella carts
//Utilizzo autoincrement per l'id
//si creera una tabella automatica extra sqllite sequence che serve per l'autoincrement
sql="CREATE TABLE carts( \
        idCart INTEGER PRIMARY KEY AUTOINCREMENT,\
        customer text,\
        paid boolean,\
        paymentDate char(10),\
        total float,\
        FOREIGN KEY (customer) REFERENCES users (username)\
        );";
db.run(sql, (err) => { if (err) throw err; });

//creazione tabella realzione prodotti-carrello
//aggiunto campo price mancante
sql="CREATE TABLE prod_in_cart( \
        idCart int,\
        model text,\
        quantity int,\
        category text,\
        price int,\
        PRIMARY KEY (idCart, model),\
        FOREIGN KEY (idCart) REFERENCES carts (idCart),\
        FOREIGN KEY (model) REFERENCES products (model)\
        );";
db.run(sql, (err) => { if (err) throw err; });

//creazione tabella reviews
sql="CREATE TABLE reviews( \
        user text,\
        model text,\
        score int,\
        date char(10),\
        comment text,\
        PRIMARY KEY (user, model),\
        FOREIGN KEY (user) REFERENCES users (username),\
        FOREIGN KEY (model) REFERENCES products (model)\
        );";
db.run(sql, (err) => { if (err) throw err; });

//popolare db: TO DO