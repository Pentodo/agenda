var mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);

class Usuario {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.model = null;
    }

    async initialize() {
        if (!validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido!');
        };
        if (this.body.password.length < 6) {
            this.errors.push('Senha inválida: menor que 6 dígitos!');
        };

        this.body = {
            email: this.body.email,
            password: await bcrypt.hash(this.body.password, 8)
        }

        await this.getModel();
    }

    async loginCheck() {
        const password = this.body.password;
        await this.initialize();

        if (this.errors.length) {
            return;
        }

        if (!this.model) {
            this.errors.push('Usuário não encontrado!');
        }
        else if (!await bcrypt.compare(password, this.model.password)) {
            this.errors.push('Senha incorreta!');
        }
    }

    async register() {
        await this.initialize();

        if (this.model) {
            this.errors = ['Usuário já cadastrado!'];
        }
        else if (!this.errors.length) {
            this.model = await UsuarioModel.create(this.body);
        }
    }

    async getModel() {
        this.model = await UsuarioModel.findOne({ email: this.body.email });
    }
}

module.exports = Usuario;
