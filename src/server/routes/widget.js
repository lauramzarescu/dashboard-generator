require('dotenv').config({ path: './config.env' });

const response = require('express');
const express = require('express');
const { default: mongoose } = require('mongoose');

const widgetRoutes = express.Router();

const dbo = require('../db/conn');

const ObjectId = require('mongodb').ObjectId;

// const Schema = mongoose.Schema;
// const userSchema = new Schema({
//     user_id: ObjectId,
//     config: Object,
//     created_date: Date,
//     updated_at: Date(),
// });

// get all widgets
widgetRoutes.route('/widgets').get(function (req, res) {
    let db_connect = dbo.getDb(process.env.DB_NAME);

    db_connect
        .collection('widgets')
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// get widget by ID
widgetRoutes.route('/widget/:id').get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };

    db_connect.collection('widgets').findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// get widget by chartId
widgetRoutes.route('/widget/chartid/:id').get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { 'config.id': req.params.id };

    db_connect.collection('widgets').findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// get widgets by user_id
widgetRoutes.route('/widgets/:userId').get(function (req, res) {
    let db_connect = dbo.getDb();
    let query = { user_id: ObjectId(req.params.id) };

    db_connect.collection('widgets').find(query, function (err, result) {
        if (err) throw err;
        return res.json(result);
    });
});

// create a new widget
widgetRoutes.route('/widget').post(function (req, res) {
    let db_connect = dbo.getDb();
    let newWidget = {
        user_id: req.body.userId,
        config: req.body.config,
        created_date: new Date(),
        update_at: new Date(),
    };

    db_connect.collection('widgets').insertOne(newWidget, function (err, result) {
        if (err) {
            throw err;
        }
        return res.json(result);
    });
});

// update widget by id
widgetRoutes.route('/widget/:id').patch(function (req, res) {
    let db_connect = dbo.getDb();
    let query = { _id: ObjectId(req.params.id) };

    let updatedWidget = {
        $set: {
            config: req.body.config,
            update_at: new Date(),
        },
    };

    db_connect.collection('widgets').updateOne(query, updatedWidget, function (err, obj) {
        if (err) throw err;
        console.log('widget updated successfully');
        res.json(obj);
    });
});

// update widget by chart ID
widgetRoutes.route('/widget/chartid/:id').patch(function (req, res) {
    let db_connect = dbo.getDb();
    let query = { 'config.id': req.params.id };

    let updatedWidget = {
        $set: {
            config: req.body.config,
            update_at: new Date(),
        },
    };

    db_connect.collection('widgets').updateOne(query, updatedWidget, function (err, obj) {
        if (err) throw err;
        console.log('widget updated successfully');
        res.json(obj);
    });
});

// delete widget by id
widgetRoutes.route('/widget/:id').delete(function (req, res) {
    let db_connect = dbo.getDb();
    let query = { _id: ObjectId(req.params.id) };

    db_connect.collection('widgets').deleteOne(query, function (err, obj) {
        if (err) throw err;
        console.log('widget deleted successfully deleted');
        res.json(obj);
    });
});

module.exports = widgetRoutes;
