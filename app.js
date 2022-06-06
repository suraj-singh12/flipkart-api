let express = require('express');
let app = express();

let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 8500;

let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let mongoUrl = process.env.MongoUrl;     // local url
// let mongoUrl = process.env.MongoLiveUrl;
let db;

//middleware 
let cors = require('cors');
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Express Server Default');
});

// list all the APIs: mouse, clothes, etc
// http://localhost:9200/list-apis
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
app.get('/api/:itemName', (req, res) => {
    let itemName = req.params.itemName;
    db.collection(itemName).find().toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
})

// ## mouses, bags

// NOTE: /item, /filters return first 12 items by default

// api for search bar (returns 12 items by default)
// http://localhost:9200/item/clothes
// http://localhost:9200/item/clothes/12
app.get('/item/:itemName', (req, res) => {
    let itemName = req.params.itemName;
    let itemId = req.query.itemId;
    let query = {};
    if(itemId) {
        query = {item_id: Number(itemId)};
    }
    console.log(query)
    db.collection(itemName).find(query).limit(12).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// api for details page, clicking on popularity will send item type to js/db 
// filter by popularity
// http://localhost:9200/filter/popularity/mouses
app.get('/filter/popularity/:item', (req, res) => {
    let itemName = req.params.item;
    let query = {hidden_stars:{$gt: 4}};

    db.collection(itemName).find(query).limit(12).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// filter by price
// http://localhost:9200/filter/price/bags
http://localhost:9200/filter/price/bags?sort=-1
app.get('/filter/price/:item', (req, res) => {
    let itemName = req.params.item;
    let sort_order = {new_price: 1};        // -1 to sort in desc order
    if(req.query.sort) {
        sort_order = {new_price: Number(req.query.sort)};
    }
    db.collection(itemName).find().sort(sort_order).limit(12).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

// filter by newest first
// http://localhost:9200/filter/new/bags
// http://localhost:9200/filter/new/keyboards
app.get('/filter/new/:item', (req, res) => {
    let itemName = req.params.item;
    let query = { $and:[{hidden_stars: {$lt:4.2 , $gt: 3.5}}] };       // my criteria defining 'what is new data'

    db.collection(itemName).find(query).limit(12).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// filter by discount
// http://localhost:9200/filter/discount/mouses/70
app.get('/filter/discount/:item/:dis', (req, res) => {
    let itemName = req.params.item;
    let discount = req.params.dis;

    let query = {discount:{$gt: Number(discount)}};
    db.collection(itemName).find(query).limit(12).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// filter by customer-rating
// http://localhost:9200/filter/rating/bags/4
app.get('/filter/rating/:item/:rating', (req, res) => {
    let itemName = req.params.item;
    let rating = req.params.rating;
    let query = {hidden_stars:{$gt: Number(rating)}};

    db.collection(itemName).find(query).limit(12).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// filter by special-price (offers)
// http://localhost:9200/filter/offers/mouses
app.get('/filter/offers/:item', (req, res) => {
    let itemName = req.params.item;
    let sort_order = {discount: -1}     // max discount first (i.e. less cost items) : offer!

    db.collection(itemName).find().sort(sort_order).limit(12).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// -----------------------------------------------------------------------------------------
// cart
// post, get_particular_user's, delete
/** structure (POST)
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
app.post('/cart/add', (req, res) => {
    let item_type = req.body.item_type;
    let itemId = Number(req.body.item_id);
    let name = req.body.name;
    let emailId = req.body.email;
    if(!item_type || !itemId || !name || !emailId) {
        res.send('Invalid input type');
    } else if(itemId > 80) {
        res.send('Invalid item id');
    } else {
        // check if item already exists in user's cart
        query = {email: emailId, item_id: itemId};
        db.collection('cart').find(query).toArray((err, result) => {
            if(result.length > 0) {
                res.send('item already present in cart');
            } 
            // if not exists then add
            else {
                db.collection('cart').insertOne(req.body, (err, result) => {
                    if(err) throw err;
                    res.send(result);
                })
            }
        })
    }
});

// fetch item from cart (all / based on email)
app.get('/cart/get', (req, res) => {
    let email = req.query.email;        // provide email in url
    let query = {};
    if(email) {
        query = {email: email};
    }
    db.collection('cart').find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// delete from cart
app.delete('/cart/:email', (req,res) => {
    let email = req.params.email;
    db.collection('cart').deleteOne({email:email}, (err, result) => {
        if(err) throw err;
        res.send('Order Deleted')
    })
});

// wishlist  (same as cart)
// post, get_particular_user's, delete
// orders (same as cart)
// post, get_particular_user's, get_all_items with count

// connect to database
MongoClient.connect(mongoUrl, (err, client) => {
    if (err) console.log("Error while connecting");

    db = client.db('myProject11');

    app.listen(port, (err) => {
        if (err) throw err;
        console.log('Express server listening on port' + port);
        console.log('http://localhost:' + port);
    });
});

