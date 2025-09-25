const router = require("express").Router();
const { submitAnswer, uploadFiles } = require("../controllers/answer");
const { tryCatch, validator, authenticate, authorize } = require("../middlewares");
const { answersValidations } = require("../lib/validators")
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images")
    },
    filename: function (req, file, cb) {
        const suffixName = Date.now();
        cb(null,  suffixName + "-" + file.originalname);
    }
})

const upload = multer({storage: storage});

router.use(authenticate, authorize());
router.post("/", answersValidations, validator, tryCatch(submitAnswer));

router.post("/upload", upload.array("files"), tryCatch(uploadFiles));

module.exports = router;