const Course = require("../models/course");
const image = require("../utils/image");

async function createCourse(req, res) {
  const course = new Course(req.body);

  const imagePath = image.getFilePath(req.files.miniature);
  course.miniature = imagePath;

  try {
    await course
      .save()
      .then((courseStore) => {
        res.status(201).send(courseStore);
      })
      .catch(() => {
        res.status(400).send({ msg: "Hubo un error al crear el curso" });
      });
  } catch (error) {
    res.status(400).send({ msg: "Hubo un error desconocido" });
  }
}

async function getCourse(req, res) {
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  try {
    await Course.paginate({}, options)
      .then((courses) => {
        res.status(200).send(courses);
      })
      .catch(() => {
        res.status(400).send({ msg: "Hubo un error al obtener el curso" });
      });
  } catch (error) {
    res.status(400).send({ msg: "Hubo un error desconocido" });
  }
}

async function updateCourse(req, res) {
  const { id } = req.params;
  const courseData = req.body;

  if (req.files.miniature) {
    const imagePath = image.getFilePath(req.files.miniature);
    courseData.miniature = imagePath;
  }

  try {
    await Course.findByIdAndUpdate({ _id: id }, courseData)
      .then(() => {
        res.status(200).send({ msg: "Actualización correcta" });
      })
      .catch(() => {
        res.status(400).send({ msg: "Hubo un error al actualizar el curso" });
      });
  } catch (error) {
    res.status(400).send({ msg: "Hubo un error desconocido" });
  }
}

async function deleteCourse(req, res) {
  const { id } = req.params;
  res.status(200).send({ msg: "Curso eliminado correctamente" });
  try {
    await Course.findByIdAndDelete(id)
      .then(() => {})
      .catch(() => {
        res.status(400).send({ msg: "Hubo un error al eliminar el curso" });
      });
  } catch (error) {
    res.status(400).send({ msg: "Hubo un error desconocido" });
  }
}

module.exports = {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
};
