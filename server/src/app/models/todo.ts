import { prop, Typegoose } from 'typegoose';

export class Todo extends Typegoose {
    @prop({required:true})
    title!: string;
}

export const model = new Todo().getModelForClass(Todo, {schemaOptions:{timestamps: true}});