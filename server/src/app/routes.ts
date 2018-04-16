import {Application} from "express";

let AuthenticationController = require('./controllers/authentication');
let TodoController = require('./controllers/todos');
import * as express from 'express';
let passportService = require('../config/passport');
import * as passport from 'passport';

let requireAuth = passport.authenticate('jwt', {session: false});
let requireLogin = passport.authenticate('local', {session: false});

module.exports = function(app: Application) {

    let apiRoutes = express.Router(),
        authRoutes = express.Router(),
        todoRoutes = express.Router();

    // Auth Routes
    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    authRoutes.get('/protected', requireAuth, function(req, res) {
        res.send({content: 'Success'});
    });

    // Todo Routes
    apiRoutes.use('/todos', todoRoutes);

    todoRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['reader', 'creator', 'editor']),
        TodoController.getTodos);
    todoRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['creator', 'editor']),
        TodoController.createTodo);
    todoRoutes.delete('/:todo_id', requireAuth, AuthenticationController.roleAuthorization(['editor']),
        TodoController.deleteTodo);

    // Set up routes
    app.use('/api', apiRoutes);

};