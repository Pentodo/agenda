var mongoose = require('mongoose');
var fs = require('fs/promises');

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

    create = () => this.load().then(model => {
        if (model) {
            this.pushError('E-mail de contato já cadastrado!');
        }
        else {
            model = ContatoModel.create({
                name: this.body.name, email: this.body.email, pic: this.file?.path, createdBy: this.session.email
            });
        };

        return this.model = model;
    });

    load = () => this.model = Promise.resolve(this?.model || ContatoModel.findOne({ email: this.body.email, createdBy: this.session.email }));

    update = () => this.load().then(model => {
        const update = { name: this.body.name };

        if (this.file?.path) {
            update.pic = this.file?.path;

            if (model.pic) {
                fs.unlink(model.pic);
            }
        }

        return this.model = model.updateOne(update);
    });

    delete = () => this.load().then(model => {
        if (model.pic) {
            fs.unlink(model.pic);
        }

        return this.model = model.deleteOne();
    });

    pushError = error => {
        if (this.errors)  {
            this.errors.push(error);
        }
        else {
            this.errors = [error];
        }
    };
}

module.exports = Contato;
