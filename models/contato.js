var mongoose = require('mongoose');
var fs = require('fs/promises');
var path = require('path');
const { throws } = require('assert');

const ContatoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    pic: { type: String },
    createdBy: { type: String, required: true }
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
    constructor(body, file, session) {
        this.body = body;
        this.file = file;
        this.session = session;
    }

    static load = (createdBy) => ContatoModel.find({ createdBy });

    create = () => Promise.resolve(this?.model || this.load()).then(model => {
        if (model) {
            this.throwError('E-mail de contato já cadastrado!');
        }
        else {
            model = ContatoModel.create({
                name: this.body.name, email: this.body.email, pic: this.file?.path, createdBy: this.session.email
            });
        };

        return model;
    });

    load = () => this.model = this?.model || ContatoModel.findOne({ email: this.body.email, createdBy: this.session.email });

    update = () => Promise.resolve(this?.model || this.load()).then(model => {
        const update = { name: this.body.name };

        if (this.file?.path) {
            update.pic = this.file.path;

            if (model.pic) {
                fs.unlink(path.join(model.pic));
            }
        }

        return this.model = model.updateOne(update);
    });

    delete = () => Promise.resolve(this?.model || this.load()).then(model => {
        if (model.pic) {
            fs.unlink(path.join(model.pic));
        }

        return this.model = model.deleteOne();
    });

    throwError = (error) => {
        if (this.errors)  {
            this.errors.push(error);
        }
        else {
            this.errors = [error];
        }
    };
}

module.exports = Contato;
