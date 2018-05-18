const mongoose = require('mongoose');
const async = require('async');
const C = require('chance');
const _ = require('underscore');
const Cat = require('./models/cat.model');
const User = require('./models/user.model');
const Comment = require('./models/comment.model');

const DB = 'mongodb://localhost/cats-and-comments';
const chance = new C();

mongoose.connect(DB, (err) => {
    if(err) console.log(err);
    else console.log(`Connected to ${DB}...`)
});

mongoose.connection.dropDatabase();

// generate random users and cats
const USERS = new Array(10).fill(null).map(n => {
    return new User({
        name: chance.name(),
        username: `${chance.first()}${chance.animal()}${chance.integer({min: 1, max: 200})}`
    });
});

const CATS = new Array(20).fill(null).map(c => {
    return new Cat({
        name: chance.first(),
        breed: chance.pickone(['Norwegian Forest Cat', 'Siamese', 'Tabby', 'British Shorthair', 'Manx', 'Persian', 'Maine Coon', 'Scottish Fold', 'Russian Blue', 'Egyptian Mau'])
    });
});

// Seed all users

function seedUsers (cb) {
    User.insertMany(USERS, (err, docs) => {
        if(err) cb(err);
        else cb(null, docs)
    })
}

// Seed all cats

function seedCats (userDocs, cb) {
    Cat.insertMany(CATS, (err, catDocs) => {        
        if(err) cb(err);
        else cb(null, userDocs,catDocs)
    })
}

// Create and save random comments

function seedComments (userDocs, catDocs, cb) {
    const userIds = userDocs.map(u => u._id);

    // async loop
    async.mapSeries(catDocs, function (cat, catCb) {
        const numComments = Math.floor(Math.random() * 20);
        const comments = new Array(numComments).fill(null).map(c => {
            return new Comment({
                made_by: chance.pickone(userIds),
                made_about: cat._id,
                body: chance.paragraph({sentences: Math.floor(Math.random() * 5)})
            });
        });
        Comment.insertMany(comments, catCb)
    }, (err, result) => {        
        cb(null, {userDocs, catDocs, commentDocs: _.flatten(result)});
    })
}

   

   

// With the cats and users usernames, for each cat, create 1-10 comments belonging to random users

// 1. function below is using callbacks

// seedUsers(function (err, userData) {
//     const userIds = userData.map(u => u._id);
//     if(err) console.log(err);
//     else {
//         seedCats(function (err, catData) {
//             if(err) console.log(err);
//             else {
//                 console.log(`Seeded ${userData.length} users and ${catData.length} cats`);
//                 // For each cat, create a random number of comments by random users
//                 let catsProcessed = 0;
//                 catData.forEach(cat => {
//                     createRandomNumOfComments(userIds, cat._id, function (err, comments) {
//                         catsProcessed++;
//                         if(err) console.log(err);
//                         else {
//                           console.log(`Seeded ${comments.length} comments for ${cat.name}`)       
//                         } 
//                         if(catsProcessed === catData.length) mongoose.connection.close();
//                     })
//                 });
//             }             
//         })
//     }
// })

// 2. Below we are using async library 'waterfall' method

async.waterfall([
    seedUsers,
    seedCats,
    seedComments
], function (err, result) {
    if(err) console.log(err);
    else console.log(result);
    mongoose.connection.close()
})





// async.waterfall([
//     myFirstFunction,
//     mySecondFunction,
//     myLastFunction,
// ], function (err, result) {
//     // result now equals 'done'
// });
// function myFirstFunction(callback) {
//     callback(null, 'one', 'two');
// }
// function mySecondFunction(arg1, arg2, callback) {
//     // arg1 now equals 'one' and arg2 now equals 'two'
//     callback(null, 'three');
// }
// function myLastFunction(arg1, callback) {
//     // arg1 now equals 'three'
//     callback(null, 'done');
// }