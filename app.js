"use strict"

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Car = require('./car.model');  

const db = 'mongodb://localhost/example';
const port = 8080;

mongoose.connect(db);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req,res) => {
    res.send("api works");
});


// get all cars
app.get('/cars', (req,res) => {
    console.log('get all cars');
    Car.find({}).exec((err,cars) => {
        if(err) {
            res.send('error has occured in /cars')
        } else {
            console.log(cars);
            res.json(cars);
        }
    });
});

// get car by id
app.get('/car/:id', (req,res) => {
    console.log('get', req.params.id, 'car');
    Car.findOne({
        _id: req.params.id
    }).exec((err,car) => {
        if (err) {
            res.send('error has occured in /car/:id');
        } else {
            console.log(car);
            res.json(car);
        }
    });
});

// post car
app.post('/car', (req,res) => {
    var car = new Car();

    car.name = req.body.name;
    car.manufacturer = req.body.manufacturer;
    car.price = req.body.price;

    car.save((err,car) => {
        if (err) {
            res.send('error saving car');
        } else {
            console.log('save car', car);
            res.send(car);
        }
    });
});

// alternative post car
app.post('/car2', (req,res) => {
    Car.create(req.body, (err,car) => {
        if (err) {
            res.send('error saving car');
        } else {
            console.log('save car', car);
            res.send(car);
        }
    })
});

// update model name of existing car
app.put('/car/:id', (req,res) => {
    Car.findOneAndUpdate({
        _id: req.params.id
    }, 
    {$set: 
        {name: req.body.name}},
         {upsert: true},
          (err,car) => {
             if (err) {
                res.send('error occured while trying to update car')
             } else {
                 console.log('updated car', car);
                 res.send(200);
             }
    });
});

// delete car
app.delete('/car/:id', (req,res) => {
    Car.findOneAndRemove({
        _id: req.params.id
    }, (err,car)  => {
        if (err) {
            res.send('error occured while trying to delete car');
        } else {
            console.log(car, 'deleted');
            res.send(200);
        }
    });
});

app.listen(port, () => {
    console.log('app listening on port', port);
});
