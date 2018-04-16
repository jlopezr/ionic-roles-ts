import * as bcrypt from 'bcrypt-nodejs';
import {prop, pre, instanceMethod, Typegoose, InstanceType} from 'typegoose';
import {NextFunction} from "express";
import {ObjectID} from "bson";

export enum Role {
    reader,
    creator,
    editor
}

@pre<User>('save', function (next: NextFunction) {
    let user = this;
    let SALT_FACTOR = 5;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function (err: Error, hash: string) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });

    });
})

export class User extends Typegoose {
    //@prop({required: true, lowercase: true, unique: true})
    @prop({required: true, unique: true})
    email!: string;

    @prop({required: true})
    password!: string;

    @prop({required: true, enum: Role, default: Role.reader})
    role!: string;

    @instanceMethod
    comparePassword(this: InstanceType<User>, passwordAttempt: string, cb: (e: Error | null, b?: boolean) => void) {

        bcrypt.compare(passwordAttempt, this.password, function (err, isMatch) {

            if (err) {
                return cb(err);
            } else {
                cb(null, isMatch);
            }
        });
    }
}

export const model = new User().getModelForClass(User, {schemaOptions: {timestamps: true}});