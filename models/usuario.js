var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);

class Usuario {
    constructor(body) {
        this.body = body;
    }

    create = () => this.load(false).then(async model => {
        if (model) {
            this.pushError('Usuário já registrado!');
        }
        else {
            model = UsuarioModel.create({
                email: this.body.email,
                password: await bcrypt.hash(this.body.password, 8)
            });
        };

        return this.model = model;
    });

    load(logErrors = true) {
        return Promise.resolve(this?.model || UsuarioModel.findOne({ email: this.body.email })).then(async model => {
            if (logErrors) {
                if (!model) {
                    this.pushError('Usuário não registrado!');
                }
                else if (!await bcrypt.compare(this.body.password, model.password)) {
                    this.pushError('Senha incorreta!');
                }
            }

            return this.model = model;
        });
    }

    update = () => this.load().then(model => this.model = model.updateOne({ password: this.body.password }));

    delete = () => this.load().then(model => this.model = model.deleteOne());

    pushError = error => {
        if (this.errors) {
            this.errors.push(error);
        }
        else {
            this.errors = [error];
        }
    };
}

module.exports = Usuario;
