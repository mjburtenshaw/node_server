'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const router = require('./routes');

const app = express();
const portNum = 8080;

/* Build sytlized listening message */
const listeningOn = chalk.hex('#8DE2F6').bold('node_server listening on ');
const host        = chalk.hex('#8DAEF6').bold('http://localhost');
const port        = chalk.hex('#C4D5FA').bold(`:${portNum}`);
const path        = chalk.hex('#8DAEF6').bold('/');
const listening = listeningOn + host + port + path;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(router);

app.listen(portNum, () => console.log(listening));