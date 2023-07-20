const bcrypt = require("bcryptjs");
const User = require("../models/user");
const image = require("../utils/image");

async function getMe(req,  res) {
    const { user_id } = req.user;

    const response = await User.findById(user_id);

    if (!response) {
        res.status(400).send({ msg: "No se a encontrado usuario"});
    } else {
        res.status(200).send(response);
    }
}

async function getUsers(req, res) {
    const {active} = req.query;
    let response = null

    if(active === undefined) {
        response = await User.find();
    } else {
        response = await User.find({ active });
    }

    res.status(200).send(response);
}

async function createUser(req, res) {
    const { password } = req.body;
    const user = new User({ ...req.body, active: false });

    const salt = bcrypt.genSaltSync(10);
    const hasPassword = bcrypt.hashSync(password, salt);
    user.password = hasPassword;

    if(req.files.avatar) {
        const imagePath = image.getFilePath(req.files.avatar);
        user.avatar = imagePath;
    }

    try {
        await user.save().then((userStored) => {
            res.status(201).send(userStored);
        }).catch((error)=> {
            res.status(400).send({msg: "Error al crear el usuario" + error});
        });

    } catch (error) {
        res.status(500).send({msg: "Hubo un error desconocido" + error});
    }
}

async function updateUser(req, res) {
    const { id } = req.params;
    const userData = req.body;

    //Password
    if(userData.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(userData.password, salt);
        userData.password = hashPassword
    } else {
        delete userData.password;
    }

    //Avatar
    if(req.files.avatar) {
        const imagePath = image.getFilePath(req.files.avatar);
        userData.avatar = imagePath;
    }

    try {
        await User.findByIdAndUpdate({_id: id}, userData).then(() =>{
            res.status(200).send({msg: "Actualizacion correcta"});
        }).catch(() => {
            res.status(400).send({msg: "Error al actualizar el usuario"});
        });
    } catch (error) {
        res.status(400).send({msg: "Hubo un problema desconocido"});
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id).then(() => {
            res.status(200).send({msg: "Usuario eliminado"});
        }).catch(() => {
            res.status(400).send({msg: "Error al eliminar el usuario"});
        });

    } catch (error) {
        res.status(400).send({msg: "Hubo un problema desconocido"});
    }
}
module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};