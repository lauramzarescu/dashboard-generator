require('dotenv').config({ path: './config.env' });

const basicAuth = require('express-basic-auth');
const express = require('express');

const mockedDataRoutes = express.Router();
const protectedMockedDataRoutes = express.Router();

protectedMockedDataRoutes.use(
    basicAuth({
        authorizer: authorizer,
        unauthorizedResponse: getUnauthorizedResponse,
    })
);

function generateRandomNumbers(count = 12) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 1000));
}

function generateRandomLabels(count = 3) {
    return Array.from({ length: count }, (element, index) => 'Label-' + (index + 1));
}

function authorizer(username, password) {
    const userMatches = basicAuth.safeCompare(username, 'admin');
    const passwordMatches = basicAuth.safeCompare(password, 'admin');

    return userMatches && passwordMatches;
}

function getUnauthorizedResponse(req) {
    return req.auth ? 'Credentials for ' + req.auth.user + ' rejected' : 'No credentials provided';
}

// get line chart data
mockedDataRoutes.route('/line/:count').get(function (req, res) {
    let object = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [],
    };

    for (let i = 0; i < req.params.count; i++) {
        object.data.push({
            value: generateRandomNumbers(12),
            label: 'Label-' + (i + 1),
        });
    }

    return res.json(object);
});

// get protected doughnut chart data
protectedMockedDataRoutes.route('/doughnut/basic-auth/:count').get(function (req, res) {
    let object = {
        labels: generateRandomLabels(req.params.count),
        data: [],
    };

    object.data.push({
        value: generateRandomNumbers(req.params.count),
        label: 'Dataset',
    });

    return res.send(object);
});

module.exports = [mockedDataRoutes, protectedMockedDataRoutes];
