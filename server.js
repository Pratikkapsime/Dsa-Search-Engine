const mongoose = require('mongoose');
const URI = "mongodb+srv://Pratik:pkapsime@searchengine.ixlq5er.mongodb.net/?retryWrites=true&w=majority";
const all_problem = require('./models/problem_model');
const Db_keyword = require('./models/all_keywords_model');
const idf = require('./models/idf_values_model');
const tf_idf = require('./models/tf_idf_values_model');
const Db_mag = require('./models/mag_values_model');

const fs = require('fs');

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("connected to db"))
.catch((err) => console.log("problem in connecting: "+err));

//Saving all keywords to server
var all_keywds = fs.readFileSync('all_keywords.txt').toString();
// const all_keywds = new Db_keyword({
//     keyword_values: temp
// });
// all_keywds.save().then(result => {
//         console.log('keywords saved')
//     }).catch((err) => {
//         console.log(err);
//     });
// console.log(all_keyws);

// storing idf values as a list of string to server
var idf_str = fs.readFileSync('idf_value.txt').toString();
// const idf_val = new idf({
//     idf_values: idf_str
// });
// idf_val.save().then(result => {
//         console.log('idf saved')
//     }).catch((err) => {
//         console.log(err);
//     });

// storing tf-idf as a list of string
var tf_idf_matrix = fs.readFileSync('tf_idf_Matrix.txt').toString();
// const tf_idf_val = new tf_idf({
//     tf_idf_values: tf_idf_matrix
// });
// tf_idf_val.save().then(result => {
//         console.log('tf_idf saved')
//     }).catch((err) => {
//         console.log(err);
//     });

// saving problems and magnitude values
var problem_desc = [];
var problem_titles = [];
var problem_urls = [];
var tot_doc=1737

for(var i=1; i<=tot_doc; i++)
{
var desc = fs.readFileSync('Corpus/leet_prob'+i.toString()+'.txt').toString();
problem_desc.push(desc);
}
problem_titles = fs.readFileSync('leetcode_prob_titles.txt').toString().split('\n');
problem_urls = fs.readFileSync('leetcode_prob_url.txt').toString().split('\n');

var tot_keywds = all_keywds.length;
mag_docs=[];
for (var i = 0; i < tot_doc; i++) {
    var value = 0;
    for(var j=0; j<tot_keywds; j++)
    {
        if(!isNaN(tf_idf_matrix[i*tot_keywds+j]))
        {
            value+= tf_idf_matrix[i*tot_keywds+j]*tf_idf_matrix[i*tot_keywds+j];
        }
    }
    mag_docs.push(Math.sqrt(value));
    const all_prob = new all_problem({
        problem_desc: problem_desc[i],
        problem_title: problem_titles[i],
        problem_url: problem_urls[i],
        problem_mag: Math.sqrt(value),
        problem_id: i+1
    });
    var cnt=i+1;
    all_prob.save().then(result => {
        console.log('problem saved!')
        console.log(cnt)
    }).catch((err) => {
        console.log(err);
    });
}
// saving magnitudes to server
var mag_str = mag_docs.toString();
const mag_save = new Db_mag({
    mag_values: mag_str,
});

mag_save.save().then(result => {
    console.log('mags saved!')
}).catch((err) => {
    console.log(err);
});