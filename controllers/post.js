const Post = require("../models/post");
const image = require("../utils/image");

async function createPost(req, res) {
    const post = new Post(req.body);
    post.created_at = new Date();

    const imagePath = image.getFilePath(req.files.miniature);
    post.miniature = imagePath;

    try {
        await post.save().then((postStored) => {
            res.status(200).send(postStored);
        }).catch(() => {
            res.status(400).send({msg: "Error al crear el post"});
        });
    } catch (error) {
        res.status(400).send({msg: "Hubo un error desconocido"});
    }
}

async function getPost(req, res) {
    const {page = 1, limit = 10} = req.query;

    const options = {
        page: parseInt(page),
        limit:parseInt(limit),
        sort: {created_at: "desc"},
    };

    try {
        await Post.paginate({}, options).then((postStored) => {
            res.status(200).send(postStored);
        }).catch(() => {
            res.status(400).send({msg: "Error al obtener los post"});
        });
    } catch (error) {
        res.status(400).send({msg: "Hubo un error desconocido"});
    }
}

async function updatePost (req, res) {
    const {id} = req.params;
    const postData = req.body;

    if(req.files.miniature) {
        const imagePath = image.getFilePath(req.files.miniature);
        postData.miniature = imagePath;
    }

    try {
        await Post.findByIdAndUpdate({_id: id}, postData).then(() => {
            res.status(200).send({msg: "Actualización correcta"});
        }).catch(() => {
            res.status(400).send({msg: "Error al actualizar el post"});
        });
    } catch (error) {
        res.status(400).send({msg: "Hubo un error desconocido"});
    }
}

async function deletePost (req, res) {
    const {id} = req.params;

    try {
        await Post.findByIdAndDelete(id).then(() => {
            res.status(200).send({msg: "Post eliminado correctamente"});
        }).catch(() => {
            res.status(400).send({msg: "Error al eliminar el post"});
        });
    } catch (error) {
        res.status(400).send({msg: "Hubo un error desconocido"});
    }
}

async function getPostPath (req, res) {
    const {path} = req.params;

    try {
        await Post.findOne({path}).then((postStored) => {
            res.status(200).send(postStored);
        }).catch(() => {
            res.status(400).send({msg: "Error al encontrar el post"});
        });
    } catch (error) {
        res.status(400).send({msg: "Hubo un error desconocido"});
    }
}

module.exports = {
    createPost,
    getPost,
    updatePost,
    deletePost,
    getPostPath,
};