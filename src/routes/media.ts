import { v2 } from "cloudinary";
import { Router } from "express";
import multer from "multer";
import isAuth from "../middlewares/isAuth";
import { TAuthRequest } from "../lib/types";
import User from "../entities/User";
import getResponse from "../lib/utils/getResponse";
import getImageData from "../lib/utils/getImageData";
import File from "../entities/File";

const storage = multer.memoryStorage();
const uploader = multer({
  storage,
  fileFilter: (_, file, callback) => {
    if (file) {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
        callback(null, true);
      else callback(new Error("Invalid image file type!"));
    }
  },
});

const router = Router();
router.use("*", function (_, __, next) {
  v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
  next();
});

router.post(
  "/avatar",
  isAuth,
  uploader.single("image"),
  async (req: TAuthRequest, res) => {
    const user = await User.findOne({
      where: { id: req.user?.id },
      relations: ["avatar"],
    });
    if (!user) return res.json(getResponse(404));

    if (!req.file) return res.json(getResponse(400));

    const dataURI = getImageData(req.file.originalname, req.file.buffer);
    if (!dataURI) return res.json(getResponse(500, "Image parsing error!"));

    const result = await v2.uploader.upload(dataURI);

    if (user.avatar) {
      await v2.uploader.destroy(user.avatar.cid);
      await user.avatar.remove();
    }

    const avatar = new File();
    avatar.url = result.secure_url;
    avatar.cid = result.public_id;
    user.avatar = avatar;
    await user.save();

    return res.json(getResponse(200, user));
  }
);

export default router;
