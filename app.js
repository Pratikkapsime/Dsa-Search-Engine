const express = require("express");
const ejs = require("ejs");
const path = require("path");
const fs = require('fs');
var StopwordsFilter = require('node-stopwords-filter');
const { exit } = require('process');
const { bre } = require('stopword');
var f = new StopwordsFilter();
const { removeStopwords } = require('stopword');
var bodyParser = require('body-parser');

//Adding mongoDb
const mongoose = require('mongoose');
const URI = "mongodb+srv://Pratik:pkapsime@searchengine.ixlq5er.mongodb.net/?retryWrites=true&w=majority";
const all_problem = require('./models/problem_model');
const Db_keyword = require('./models/all_keywords_model');
const idf = require('./models/idf_values_model');
const tf_idf = require('./models/tf_idf_values_model');
const Db_mag = require('./models/mag_values_model');

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connected to database"))
    .catch((err) => console.log("problen in connecting ):" + err));
//Creating our server
const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.json())
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

//Assigning Port to our application
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
//Routes
//description: GET request to homepage i.e index.ejs
app.get("/", (req, res) => {
  res.render("index");
})

// Extracting data base from mongodb to local 
var all_keyword = [];
var mag_docs = [];
var idf_values = [];
var tf_idf_matrix = [];

Db_mag.find((err, doc) => {
    if (!err) {
        mag_docs = doc[0]['mag_values'].split(',');
    } else {
        console.log("error");
    }
})
idf.find((err, doc) => {
    if (!err) {
        idf_values = doc[0]['idf_values'].split(',');
    } else {
        console.log("error");
    }
})
Db_keyword.find((err, doc) => {
    if (!err) {
        all_keyword = doc[0]['keyword_values'].split(',');
    } else {
        console.log("error");
    }
})
tf_idf.find((err, doc) => {
    if (!err) {
        tf_idf_matrix = doc[0]['tf_idf_values'].split(',');
    } else {
        console.log("error");
    }
})
// where to post data
app.post('/index', (req, res)=>{
    // console.log(req.body.question);
    var query_string = req.body.question;
    var query_string = query_string.toLowerCase();

    var tot_doc = 1737;
    query_string = query_string.replace(/(\r\n|\n|\r)/gm, "");
    query_string = query_string.split(' ');
    var query_keyword = removeStopwords(query_string);
    query_keyword.sort();

    var mp_query = new Map();

    query_keyword.forEach(element => {
        if (mp_query.has(element)) {
            mp_query.set(element, mp_query.get(element) + 1);
        } else {
            mp_query.set(element, 1);
        }
    });

    var sz_query_keywords = query_keyword.length;
    var tf_query = [];
    
    all_keyword.forEach(element => {
        if (mp_query.has(element)) {
            tf_query.push(mp_query.get(element) / sz_query_keywords);
        } else {
            tf_query.push(0);
        }
    });
    var tf_idf_query = [];

    for (var i = 0; i < idf_values.length; i++) {
        tf_idf_query.push(tf_query[i] * idf_values[i]);
    }
    var tf_idf_doc = [];
    for (var i = 0; i < tot_doc; i++) {
        var values = [];
        for (var j = 0; j < all_keyword.length; j++) {
            if(tf_idf_matrix[all_keyword.length * i + j]=="NUN"){
                values.push(0);
            }
            else{
                values.push(tf_idf_matrix[all_keyword.length * i + j]);
            }
        }
        tf_idf_doc.push(values);
    }
    var mag_query = 0;
    for (var i = 0; i < idf_values.length; i++) {
        if (tf_idf_query[i] > 0) {
            mag_query += tf_idf_query[i] * tf_idf_query[i];
        }
    }
    mag_query = Math.sqrt(mag_query);

    var selectivity_values = new Map();
    for (var i = 0; i < tot_doc; i++) {
        var val = 0;
        for (var j = 0; j < all_keyword.length; j++) {
            if (!isNaN(tf_idf_query[j])) {
                val += tf_idf_doc[i][j] * tf_idf_query[j];
            }
        }
        val = val / mag_docs[i];
        val = val / mag_query;
        selectivity_values.set(val, i + 1); // Si,doc no.
    }

    var selectivity_order = new Map([...selectivity_values.entries()].sort().reverse());
    var doc_order = [];

    selectivity_order.forEach((key, value) => {
        doc_order.push(key);
        // console.log(value);
    })
    async function dbData() {
        try {
            var data = [];
            for (var i = 0; i < Math.min(5, doc_order.length); i++) {
                // console.log(doc_order[i]);
                let dbData = await all_problem.find({ problem_id: doc_order[i] });
                if (typeof dbData[0] !== 'undefined')
                {
                    data.push(dbData[0]);
                }
            }
            return data;
        }
        catch (err) {
            console.log(err)
        }
    }
    (async function () {
        const doc = await dbData()
        // console.log(doc);
        res.render('question', {body: doc});

    })();

})

app.get('/index', (req, res)=>{
    all_problem.find().limit(15).exec((err, doc) => {
        if(!err)
        {
            res.render('question', {body: doc});
        }else{
            console.log(err);
        }
    })
})
