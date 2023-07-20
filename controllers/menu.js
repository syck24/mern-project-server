const Menu = require("../models/menu");

async function createMenu(req, res) {
    const menu = new Menu(req.body)

    try {
        await menu.save().then((menuStored) => {
            res.status(200).send(menuStored);
        }).catch(() => {
            res.status(400).send({msg: "Error al crear el menu"});
        });
    } catch (error) {
        res.status(400).send({msg: "Hubo un problema desconocido"});
    }
}

async function getMenu(req, res) {
    const { active } = req.query;

    let response = null;

    if(active === undefined) {
        response = await Menu.find().sort({order: "asc"});
    } else {
        response = await Menu.find({ active }).sort({order: "asc"});
    }

    if(!response) {
        res.status(400).send({msg: "No se a encontrado ningun menu"})
    } else {
        res.status(200).send(response)
    }
}

async function updateMenu(req, res) {
    const { id } = req.params;
    const menuData = req.body;

    try {
        await Menu.findByIdAndUpdate({_id: id}, menuData).then(() => {
            res.status(200).send({msg: "Actualización correcta"});
        }).catch(() => {
            res.status(400).send({msg: "Error al actualizar el menú"});
        });
    } catch (error) {
        res.status(400).send({msg: "Hubo un problema desconocido"});
    }
}

async function deleteMenu(req, res) {
    const { id } = req.params;

    try {
        await Menu.findByIdAndDelete(id).then(() => {
            res.status(200).send({msg: "Menú eliminado"});
        }).catch(() => {
            res.status(400).send({msg: "Error al eliminar el menú"});
        });
    } catch (error) {
        res.status(400).send({msg: "Hubo un problema desconocido"});
    }
}

module.exports = {
    createMenu,
    getMenu,
    updateMenu,
    deleteMenu,
};