import {Request, Response, NextFunction} from "express";
import {model as Todo, Todo as TodoType} from '../models/todo';

export function getTodos(req: Request, res: Response, next: NextFunction) {
    Todo.find(function (err, todos) {
        if (err) {
            res.send(err);
        }
        res.json(todos);

    });
};

export function createTodo(req: Request, res: Response, next: NextFunction) {
    Todo.create({
        title: req.body.title
    }, function (err: Error, todo: TodoType[]) {
        if (err) {
            res.send(err);
        }
        Todo.find(function (err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
    });
};

export function deleteTodo(req: Request, res: Response, next: NextFunction) {
    Todo.remove({
        _id: req.params.todo_id
    }, function (err) {
        res.sendStatus(200);
    });
};