const Newsletter = require("../models/newsletter");

async function subscribeEmail(req, res) {
    const {email} = req.body;

    const newsletter = new Newsletter({
        email: email.toLowerCase(),
    });

    if(!email){
        res.status(400).send({msg: "Debe escribir un correo"});
    } else {

        try {
            await newsletter.save().then(() => {
                res.status(200).send({msg: "Email registrado"});
            }).catch(() => {
                res.status(400).send({msg: "Email ya está registrado"});
            });
        } catch (error) {
            res.status(400).send({msg: "Hubo un error desconocido"});
        }
    }
}

async function getEmails(req, res) {
    const {page = 1, limit = 10} = req.query;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    try {
        await Newsletter.paginate({}, options).then((emailsStored) => {
            res.status(200).send(emailsStored);
        }).catch(() => {
            res.status(400).send({msg: "No se pudieron obtener los emails"});
        });
    } catch (error) {
        res.status(400).send({msg: "Hubo un error desconocido"});
    }
}

async function deleteEmail(req, res) {
    const {id} = req.params;

    try {
        await Newsletter.findByIdAndDelete(id).then(() => {
            res.status(200).send({msg: "Email eliminado"});
        }).catch(() => {
            res.status(400).send({msg: "No se pudo eliminar el email"});
        });
    } catch (error) {
        res.status(400).send({msg: "Hubo un error desconocido"});
    }
}

module.exports = {
    subscribeEmail,
    getEmails,
    deleteEmail,
};