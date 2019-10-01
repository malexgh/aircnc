const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect(process.env.MONGODB_KEY, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(routes);

app.listen(3333);
