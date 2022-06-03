let express = require('express');
let app = express();

let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 8500;

let mongo = require('mongodb');
const res = require('express/lib/response');
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
app.get('/list-apis', (req, res) => {
    db.listCollections().toArray((err, collInfo) => {
        if (err) throw err;

        let arr = []
        for (c of collInfo)  // for of loop (used in arrays)
            arr.push(c.name);

        res.send(arr);
    });
});

// api for search bar
app.get('/item/:itemName', (req, res) => {
    let itemName = req.params.itemName;
    db.collection(itemName).find().toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// on the details page, clicking on popularity will send item type to js/db
//not working for those without stars (need to modify price, discount, and stars in data)
app.get('/popularity/:item', (req, res) => {
    let itemName = req.params.item;
    let query = { hidden_stars: { $gt: "4" } };

    let finalResult;
    db.collection(itemName).find(query).toArray((err, result) => {
        if (err) throw err;
        if (result) {
            finalResult = result;
            res.send(result);
        }
    });
});


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

