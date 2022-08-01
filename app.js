let express = require('express');
let app = express();

let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 8500;

let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
// let mongoUrl = process.env.MongoUrl;     // local url
let mongoUrl = process.env.MongoLiveUrl;
let db;

//middleware 
let cors = require('cors');
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    // res.send('Express Server Default');
    res.send('<h1>Fkart API default</h1>')
});

// list all the APIs: mouse, clothes, etc
// http://localhost:9200/list-apis
// https://app2fkartapi.herokuapp.com/list-apis
app.get('/list-apis', (req, res) => {
    db.listCollections().toArray((err, collInfo) => {
        if (err) throw err;

        let arr = []
        for (c of collInfo)  // for of loop (used in arrays)
            arr.push(c.name);

        res.send(arr);
    });
});

// api to get `all items` of any itemType 
// http://localhost:9200/api/shirts
// https://app2fkartapi.herokuapp.com/api/shirts
app.get('/api/:itemName', (req, res) => {
    let itemName = req.params.itemName;
    db.collection(itemName).find().toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
})

// NOTE: /item, /filters return first 12 items by default

// api for search bar (returns 12 items by default)
// http://localhost:9200/item/clothes
// http://localhost:9200/item/clothes?itemId=12
// https://app2fkartapi.herokuapp.com/item/clothes
// https://app2fkartapi.herokuapp.com/item/clothes?itemId=12
app.get('/item/:itemName', (req, res) => {
    let itemName = req.params.itemName;
    let itemId = req.query.itemId;
    let query = {};
    if(itemId) {
        query = {item_id: Number(itemId)};
    }
    db.collection(itemName).find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// api for details page, clicking on popularity will send item type to js/db 
// filter by popularity
// http://localhost:9200/filter/popularity/mouses
// http://localhost:9200/filter/popularity/refrigerators
// https://app2fkartapi.herokuapp.com/filter/popularity/mouses
// https://app2fkartapi.herokuapp.com/filter/popularity/refrigerators
app.get('/filter/popularity/:item', (req, res) => {
    let itemName = req.params.item;
    let query = {hidden_stars:{$gt: 4}};

    db.collection(itemName).find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// filter by price
// http://localhost:9200/filter/price/bags
// http://localhost:9200/filter/price/bags?sort=-1
// https://app2fkartapi.herokuapp.com/filter/price/bags
// https://app2fkartapi.herokuapp.com/filter/price/bags?sort=-1
app.get('/filter/price/:item', (req, res) => {
    let itemName = req.params.item;
    let sort_order = {new_price: 1};        // -1 to sort in desc order
    if(req.query.sort) {
        sort_order = {new_price: Number(req.query.sort)};
    }
    let query = {new_price:{$gt: 50}};
    db.collection(itemName).find(query).sort(sort_order).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

// cost filter
app.get('/filter/cost/:item', (req, res) => {
    let lcost = req.params.lcost;
    let hcost = req.params.hcost;
    let query = {new_price:{$gt: lcost, $lt: hcost}};
    db.collection(itemName).find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

// filter by newest first
// http://localhost:9200/filter/new/bags
// http://localhost:9200/filter/new/keyboards
// https://app2fkartapi.herokuapp.com/filter/new/bags
// https://app2fkartapi.herokuapp.com/filter/new/keyboards
app.get('/filter/new/:item', (req, res) => {
    let itemName = req.params.item;
    let query = { $and:[{hidden_stars: {$lt:4.2 , $gt: 3.5}}] };       // my criteria defining 'what is new data'

    db.collection(itemName).find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// filter by discount
// http://localhost:9200/filter/discount/mouses/70
// http://localhost:9200/filter/discount/powerbanks/50
// https://app2fkartapi.herokuapp.com/filter/discount/powerbanks/50
app.get('/filter/discount/:item/:dis', (req, res) => {
    let itemName = req.params.item;
    let discount = req.params.dis;

    let query = {discount:{$gt: Number(discount)}};
    db.collection(itemName).find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// filter by customer-rating
// http://localhost:9200/filter/rating/bags/4
// http://localhost:9200/filter/rating/pillows/3
// https://app2fkartapi.herokuapp.com/filter/rating/pillows/3
app.get('/filter/rating/:item/:rating', (req, res) => {
    let itemName = req.params.item;
    let rating = req.params.rating;
    let query = {hidden_stars:{$gt: Number(rating)}};

    db.collection(itemName).find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// filter by special-price (offers)
// http://localhost:9200/filter/offers/mouses
// https://app2fkartapi.herokuapp.com/filter/offers/mouses
app.get('/filter/offers/:item', (req, res) => {
    let itemName = req.params.item;
    let sort_order = {discount: -1}     // max discount first (i.e. less cost items) : offer!

    db.collection(itemName).find().sort(sort_order).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// -----------------------------------------------------------------------------------------
// cart
// post, get_particular_user's, delete
/** structure (POST)        [in   /cart/add  send data in below format in body of postman as raw json]
 * item_type: string    [collection name]
 * item_id: number      [will be authenticated if exists or not]
 * name: string
 * email: string
 */
/** structure (GET)
 * email: string
 */
/** structure (Delete)
 * item_no: number
 * email: string
*/

// add to cart
// {
//     "item_id": 58,
//     "item_type": "mouses",
//     "name": "alpha1",
//     "email": "alpha1@alpha.com"
// }
// http://localhost:9200/cart/add
// https://app2fkartapi.herokuapp.com/cart/add
app.post('/cart/add', (req, res) => {
    let itemType = req.body.item_type;
    let itemId = Number(req.body.item_id);
    let name = req.body.name;
    let emailId = req.body.email;
    if(!itemType || !itemId || !name || !emailId) {
        res.send('Invalid input type');
    } else if(itemId > 80) {
        res.send('Invalid item id');
    } else {
        // check if item already exists in user's cart
        query = {email: emailId, item_id: itemId, item_type: itemType};
        db.collection('cart').find(query).toArray((err, result) => {
            if(result.length > 0) {
                res.send('item already present in cart');
            } 
            // if not exists then add
            else {
                db.collection('cart').insertOne(req.body, (err, result) => {
                    if(err) throw err;
                    // res.send(result);
                    res.send(`Item added with Object id: ${result.insertedId}`)
                })
            }
        })
    }
});

// fetch item from cart (all / based on email)
// http://localhost:9200/cart/get
// http://localhost:9200/cart/get?email=alpha1@alpha.com
// https://app2fkartapi.herokuapp.com/cart/get
// https://app2fkartapi.herokuapp.com/cart/get?email=alpha1@alpha.com
app.get('/cart/get', (req, res) => {
    let emailId = req.query.email;        // provide email in url
    let query = {};
    if(emailId) {
        query = {email: emailId};
    }
    db.collection('cart').find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// delete from cart
// http://localhost:9200/cart/delete/alpha1@alpha.com/mouses/58
// http://localhost:9200/cart/delete/alpha14@alpha.com/clothes/18
// http://localhost:9200/cart/delete/alpha14@alpha.com/keyboard/18
// https://app2fkartapi.herokuapp.com/cart/delete/alpha14@alpha.com/keyboard/18
app.delete('/cart/delete/:email/:item_type/:item_id', (req,res) => {
    let emailId = req.params.email;
    let itemType = req.params.item_type;
    let itemId = Number(req.params.item_id);
    db.collection('cart').deleteOne({email:emailId, item_id: itemId, item_type: itemType}, (err, result) => {
        if(err) throw err;
        // res.send(result);
        if(Number(result.deletedCount) === 0) {
            res.status(500).send('No such item exists!');
        } else {
            res.status(200).send(`Item no: ${itemId}, type: ${itemType}, of user ${emailId} deleted !\n Delete Count: ${result.deletedCount}`)
        }
    })
});

// for developer purpose 
// http://localhost:9200/cart/deleteAll
// http://localhost:9200/cart/deleteAll?email=alpha1@alpha.com
// https://app2fkartapi.herokuapp.com/cart/deleteAll
// https://app2fkartapi.herokuapp.com/cart/deleteAll?email=alpha1@alpha.com
app.delete('/cart/deleteAll', (req, res) => {
    let emailId = req.query.email;
    let query = {};
    if(emailId) {
        query = {email: emailId};
    }
    db.collection('cart').deleteMany(query, (err, result) => {
        if(err) throw err;
        // res.send(result);
        if(Number(result.deletedCount) === 0) {
            res.status(500).send('No records exist!')
        } else {
            res.status(200).send(`Erased all ${result.deletedCount} records`)
        }
    })
})

// ---------------------------------------------------------------
// wishlist  (same as cart)
// post, get_particular_user's, delete

// add to wishlist
// {
//     "item_id": 58,
//     "item_type": "mouses",
//     "name": "alpha1",
//     "email": "alpha1@alpha.com"
// }
// http://localhost:9200/wishlist/add
// https://app2fkartapi.herokuapp.com/wishlist/add
app.post('/wishlist/add', (req, res) => {
    let itemId = Number(req.body.item_id);
    let itemType = req.body.item_type;
    let name = req.body.name;
    let emailId = req.body.email;
    if(!itemType || !itemId || !name || !emailId) {
        res.send('Invalid input type');
    } else if(itemId > 80) {        // max item id = 80
        res.send('Invalid item id');
    } else {
        // check if item already exists in user's wishlist
        query = {email: emailId, item_id: itemId, item_type: itemType};
        db.collection('wishlist').find(query).toArray((err, result) => {
            if(result.length > 0) {
                res.send('Item already present in wishlist');
            } 
            // if not exists then add
            else {
                db.collection('wishlist').insertOne(req.body, (err, result) => {
                    if(err) throw err;
                    // res.send(result);
                    res.send(`Item added with Object id: ${result.insertedId}`)
                })
            }
        })
    }
});

// fetch item from wishlist (all / based on email)
// http://localhost:9200/wishlist/get
// http://localhost:9200/wishlist/get?email=alpha1@alpha.com
// https://app2fkartapi.herokuapp.com/wishlist/get
// https://app2fkartapi.herokuapp.com/wishlist/get?email=alpha1@alpha.com
app.get('/wishlist/get', (req, res) => {
    let emailId = req.query.email;        // provide email in url
    let query = {};
    if(emailId) {
        query = {email: emailId};
    }
    db.collection('wishlist').find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// delete from wishlist
// http://localhost:9200/wishlist/delete/alpha1@alpha.com/mouses/58
// https://app2fkartapi.herokuapp.com/wishlist/delete/alpha1@alpha.com/mouses/58
app.delete('/wishlist/delete/:email/:item_type/:item_id', (req,res) => {
    let emailId = req.params.email;
    let itemType = req.params.item_type;
    let itemId = Number(req.params.item_id);
    db.collection('wishlist').deleteOne({email:emailId, item_type: itemType, item_id: itemId}, (err, result) => {
        if(err) throw err;
        // res.send(result);
        if(Number(result.deletedCount) === 0) {
            res.status(500).send('No such item exists!');
        } else {
            res.status(200).send(`Item no: ${itemId}, type: ${itemType}, of user ${emailId} deleted !\n Delete Count: ${result.deletedCount}`)
        }
    })
});


// for developer purpose 
// http://localhost:9200/wishlist/deleteAll
// http://localhost:9200/wishlist/deleteAll?email=alpha1@alpha.com
// https://app2fkartapi.herokuapp.com/wishlist/deleteAll
// https://app2fkartapi.herokuapp.com/wishlist/deleteAll?email=alpha1@alpha.com
app.delete('/wishlist/deleteAll', (req, res) => {
    let emailId = req.query.email;
    let query = {};
    if(emailId) {
        query = {email: emailId};
    }
    db.collection('wishlist').deleteMany(query, (err, result) => {
        if(err) throw err;
        // res.send(result);
        if(Number(result.deletedCount) === 0) {
            res.status(500).send('No records exist!')
        } else {
            res.status(200).send(`Erased all ${result.deletedCount} records`)
        }
    })
})

// ----------------------------------------------------------------
// orders
// post, get_particular_user's, get_all_items with count

// order made STRUCTURE
// {
//     "order_id": 51,    (send any number; it is auto generated later uniquely)
//     "item_id": 58,
//     "item_type": "mouses",
//     "name": "alpha1",
//     "email": "alpha1@alpha.com",
//     "amount": 345,
//     "bank_name": "SBI",
//     "transaction_state": "In Process"
// }
// example2 
// {
// "order_id": 51,
// "item_id": 43,
// "item_type": "keyboards",
// "name": "alpha1",
// "email": "alpha3451@alpha.com",
// "phone": 9589658210,
// "amount": 345,
// "bank_name": "SBI",
// "transaction_state": "Completed"     // need not to pass
// }
// http://localhost:9200/orders/add
// https://app2fkartapi.herokuapp.com/orders/add
app.post('/orders/add', (req, res) => {
    let orderId = Math.floor(Math.random() * 10000);
    req.body.order_id = orderId;
    let itemId = Number(req.body.item_id);
    let itemType = req.body.item_type;
    let name = req.body.name;
    let emailId = req.body.email;
    let phoneNo = req.body.phone;
    let amount = req.body.amount;
    let bankName = req.body.bank_name;
    let transactionState = req.body.transaction_state ? req.body.transaction_state : 'In Progress';
    req.body.transaction_state = transactionState;

    if(!orderId || !itemId || !itemType || !name || !emailId || !phoneNo || !amount || !bankName) {
        res.send('Invalid input type');
    } else if(itemId > 80) {
        res.send('Invalid item id');
    } else {
        db.collection('orders').insertOne(req.body, (err, result) => {
            if(err) throw err;
            // res.send(result);
            res.send(`Order made. Returned OrderId: ${orderId}`)
        })
    }
});

// fetch item from wishlist (all / based on email)
// http://localhost:9200/orders/get
// http://localhost:9200/orders/get?email=alpha1@alpha.com
// https://app2fkartapi.herokuapp.com/orders/get
// https://app2fkartapi.herokuapp.com/orders/get?email=alpha1@alpha.com
app.get('/orders/get', (req, res) => {
    let email = req.query.email;        // provide email in url
    let query = {};
    if(email) {
        query = {email: email};
    }
    db.collection('orders').find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    });
});


// update order status
// http://localhost:9200/orders/update/2575
// https://app2fkartapi.herokuapp.com/orders/update/2575
// {
// "transaction_state": "Completed",
// "date": "06-06-2022"
// }
app.put('/orders/update/:order_id', (req, res) => {
    let orderId = Number(req.params.order_id);
    db.collection('orders').updateOne(
        {order_id: orderId},
        {
            $set:{
                "transaction_state":req.body.transaction_state,
                "date":req.body.date
            }
        }, (err, result) => {
            if(err) throw err;
            // res.send(result);
            res.status(200).send(`Order ${orderId} Updated`);
        }
    )
})

// for developer purpose 
// http://localhost:9200/orders/deleteAll
// http://localhost:9200/orders/deleteAll?email=alpha1@alpha.com
// https://app2fkartapi.herokuapp.com/orders/deleteAll
// https://app2fkartapi.herokuapp.com/orders/deleteAll?email=alpha1@alpha.com
app.delete('/orders/deleteAll', (req, res) => {
    let emailId = req.query.email;
    let query = {};
    if(emailId) {
        query = {email: emailId};
    }
    db.collection('orders').deleteMany(query, (err, result) => {
        if(err) throw err;
        // res.send(result);
        if(Number(result.deletedCount) === 0) {
            res.status(500).send('No records exist!')
        } else {
            res.status(200).send(`Erased all ${result.deletedCount} records`)
        }
    })
})

// connect to database
MongoClient.connect(mongoUrl, (err, client) => {
    if (err) console.log("Error while connecting");

    db = client.db('project2-live');

    app.listen(port, (err) => {
        if (err) throw err;
        console.log('Express server listening on port' + port);
        console.log('http://localhost:' + port);
    });
});

