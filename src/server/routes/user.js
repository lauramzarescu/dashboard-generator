require('dotenv').config({ path: './config.env' });

const express = require('express');
const { default: mongoose } = require('mongoose');

// widgetRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const userRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

// const Schema = mongoose.Schema;
// const userSchema = new Schema({
//     fullname: String,
//     company_name: String,
//     company_site: String,
//     address: String,
//     email: String,
//     postal_code: String,
//     city: String,
//     country: String,
//     password: String,
//     created_date: Date,
//     updated_at: Date(),
// });

// get all users
userRoutes.route('/users').get(function (req, res) {
    let db_connect = dbo.getDb(process.env.DB_NAME);

    db_connect
        .collection('users')
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// get user by ID
userRoutes.route('/user/:id').get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };

    db_connect.collection('users').findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// create a new user
userRoutes.route('/user').post(function (req, res) {
    let db_connect = dbo.getDb();
    let newUser = {
        fullname: req.body.fullname,
        company_name: req.body.company_name,
        company_site: req.body.company_site,
        address: req.body.address,
        email: req.body.email,
        postal_code: req.body.postal_code,
        city: req.body.city,
        country: req.body.country,
        password: req.body.password,
        created_date: new Date(),
        updated_at: new Date(),
    };

    db_connect.collection('users').insertOne(newUser, function (err, res) {
        if (err) throw err;
        res.json(res);
    });
});

// update widget by id
userRoutes.route('/user/:id').patch(function (req, res) {
    let db_connect = dbo.getDb();
    let query = { _id: ObjectId(req.params.id) };
    let updatedUser = {
        $set: {
            fullname: req.body.user.fullname,
            company_name: req.body.user.company_name,
            company_site: req.body.user.company_site,
            address: req.body.user.address,
            email: req.body.user.email,
            postal_code: req.body.user.postal_code,
            city: req.body.user.city,
            country: req.body.user.country,
            updated_at: new Date(),
        },
    };

    db_connect.collection('users').updateOne(query, updatedUser, function (err, obj) {
        if (err) throw err;
        console.log('user updated successfully');
        res.json(obj);
    });
});

// delete widget by id
userRoutes.route('/user/:id').delete(function (req, res) {
    let db_connect = dbo.getDb();
    let query = { _id: ObjectId(req.params.id) };

    db_connect.collection('users').deleteOne(query, function (err, obj) {
        if (err) throw err;
        console.log('user deleted successfully');
        res.json(obj);
    });
});

module.exports = userRoutes;
