const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");
const user = require("../models/user");
const { response } = require("../app");

async function register(req, res) {
    const {firstname, lastname, email, password} = req.body;

    if(!email) res.status(400).send({ msg: "El email es obligatorio"});
    if(!password) res.status(400).send({ msg: "La contraseña es obligatoria"});

    const user = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        role: "user",
        active: false,
    });

    const salt= bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    user.password = hashPassword;

    try{
        await user.save().then(() => {
            res.status(200).send({ msg: "Usuario guardado"});
        }).catch ((error) => {
            res.status(400).send({ msg: `Error al crear el usuario: ${error}`});
        });
    } catch (error) {
        res.status(400).send({ msg: `Errro al crear el usuario: ${error}`});
    }
}

async function login(req, res) {
    const {email, password} = req.body

    if(!email) res.status(400).send({msg: "El email es obligatorio"});
    if(!password) res.status(400).send({msg: "La contraseña es obligatoria"});

    const emailLowerCase = email.toLowerCase();

    try{
        await user.findOne({email: emailLowerCase}).then((user) => {
            bcrypt.compare(password, user.password, (bcryptError, check) => {
                if(bcryptError) {
                    res.status(500).send({ msg: `Error desconocido`});
                } else if(!check) {
                    res.status(500).send({ msg: "Contraseña incorrecta"});
                } else if (!user.active) {
                    res.status(401).send({ msg: "Usuario se encuentra inactivo"});
                } else {
                    res.status(200).send({ 
                        access: jwt.createAccessToken(user),
                        refresh: jwt.createRefreshToken(user),
                    });
                }
            });
        }).catch (() => {
            res.status(500).send({ msg: "Error del servidor"});
        });
    } catch {
        res.status(400).send({ msg: `Hubo un error desconocido`});
    }
}

async function refreshAccessToken(req, res) {
    const { token } = req.body;

    if(!token) res.status(400).send({msg: "Token no existe"})

    const { user_id } = jwt.decoded(token);

    try {
        await user.findOne({_id: user_id}).then((user) => {
            res.status(200).send({
                accessToken: jwt.createAccessToken(user),
            });
        }).catch (() => {
            res.status(500).send({msg: "Error del servidor"});
        });
    } catch {
        res.status(400).send({ msg: `Hubo un error desconocido`});
    }
}

module.exports = {
    register,
    login,
    refreshAccessToken,
};