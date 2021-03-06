import * as jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from "express";
import {model as User, User as UserType} from '../models/user';
import {ObjectID} from "bson";
let authConfig = require('../../config/auth');

interface UserInfo {
    _id: any;
    email: string;
    role: string;
}

function generateToken(user: UserInfo) : string {
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}

function setUserInfo(request: Express.User) : UserInfo {
    return {
        _id: request._id,
        email: request.email,
        role: request.role
    };
}

export function login(req: Request, res: Response, next: NextFunction) {
    // req.user is set in previously called requireAuth middleware
    let userInfo = setUserInfo(req.user!);

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });

};

export function register(req: Request, res: Response, next: NextFunction) {

    let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role;

    if(!email) {
        return res.status(422).send({error: 'You must enter an email address'});
    }

    if(!password) {
        return res.status(422).send({error: 'You must enter a password'});
    }

    User.findOne({email: email}, function(err, existingUser) {

        if(err) {
            return next(err);
        }

        if(existingUser) {
            return res.status(422).send({error: 'That email address is already in use'});
        }

        let user = new User({
            email: email,
            password: password,
            role: role
        });

        user.save(function(err, user) {

            if(err) {
                return next(err);
            }

            let userInfo = setUserInfo(user);

            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            })

        });

    });

};

export function roleAuthorization(roles: string[]) {

    return function(req: Request, res: Response, next: NextFunction) {

        // req.user is set in previously called requireAuth middleware
        let user = req.user!;

        User.findById(user._id, function(err, foundUser) {

            if(err) {
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }

            if(foundUser !== null && roles.indexOf(foundUser.role) > -1) {
                return next();
            }

            res.status(401).json({error: 'You are not authorized to view this content'});
            return next('Unauthorized');

        });

    }

};
