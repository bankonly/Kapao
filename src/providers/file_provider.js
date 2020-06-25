import multer from "multer";
import fs from "fs";
import uuid from "uuid";
import constant from "../configs/constant";
import sharp from "sharp";
import formidable from "formidable";

/** helpers */
import { isEmptyObj } from "../helpers/Global";

/** Controllers */
import Res from "../controllers/default_res_controller";

/** validate image */
export const imageValidate = (fileData, filetype = ".jpg") => {
  try {
    var error = {};
    var file = "./" + fileData.path + filetype;
    fs.rename(fileData.path, file, (err) => {
      if (err) error.upload = "image upload failed";
    });

    /** check if image over than define */
    if (fileData.size > constant.image_size_allow) {
      error.maxSize = "max size is " + constant.image_size_allow + "bytes";
    }

    /** check file type */
    if (!constant.image_type_accept.includes(fileData.mimetype.split("/")[1])) {
      error.fileType = "file type is not correct";
    }

    if (!isEmptyObj(error)) {
      return Res.badRequest({ data: error });
    }

    return Res.success({ data: { file: file, fileType: filetype } });
  } catch (error) {
    return Res.somethingWrong({ error: error });
  }
};

/** single image upload */
export const uploadImage = ({
  path,
  field,
  req,
  res,
  height = 512,
  width = 512,
  maxUpload = 5,
  fileType = ".jpg",
}) => {
  try {
    if (!field) return Res.badRequest({ msg: field + " is required" });
    /** check if path exist and create */
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    /** save image with multi */
    const upload = multer({ dest: path }).array(field, maxUpload);
    return new Promise((resolve, reject) => {
      var response = Res.success({});
      var error = {};
      upload(req, res, (err) => {
        req.body = req.body;
        if (req.files.length > 5) {
          error.limit = "limit upload is " + maxUpload;
          response = Res.badRequest({ data: error });
        } else if (req.files.length == 0) {
          error.image = "image can not be null";
          response = Res.badRequest({ data: error });
        } else {
          /** loop image list */
          req.files.forEach((file, index) => {
            const resizePath = path;
            const folderName = width + "x" + height + "/";
            /** new file name */
            const newFile = resizePath + folderName + file.filename + fileType;
            /** rename image */
            response = imageValidate(file, fileType);
            if (err || !response.status) {
              // console.log(path + file.filename + fileType)
              removeImage(path + file.filename + fileType);
              response = Res.badRequest(response);
            } else {
              /** check if new dir is not exist */
              if (!fs.existsSync(resizePath + folderName)) {
                fs.mkdirSync(resizePath + folderName);
              }

              /** call resize func */
              const isResize = resizeImage({
                width: width,
                height: height,
                oldPath: response.data.file,
                newPath: newFile,
              });
              console.log(response.data);
              if (!isResize.status) {
                response = isResize;
              } else response = Res.success(response);
            }
          });
        }
        /** if save image not success */
        if (!response.status) {
          return resolve(response);
        } else {
          return resolve(Res.success({ data: req.body }));
        }
      });
    });
  } catch (error) {
    return Res.somethingWrong({ error: error });
  }
};

export const resizeImage = ({ width, height, oldPath, newPath }) => {
  try {
    var response = Res.success({});
    sharp(oldPath)
      .resize(width, height)
      .toFile(newPath, (e, info) => {
        if (e) response = Res.badRequest({ msg: "imagevalidate error" });
      });
    return response;
  } catch (error) {
    return Res.somethingWrong({ error: error, msg: "from resize" });
  }
};

/** save image */
export const uploadImagev2 = (req, path, multiples = true) => {
  try {
    const form = formidable({ multiples: multiples });
    form.parse(req, (err, fields, files) => {
      // const oldPath = fi
      console.log(files.image);
      console.log(typeof files.image);

      if (multiples) {
        files.im;
      }
    });
  } catch (error) {
    return Res.somethingWrong({ error: error, msg: "from resize" });
  }
};

export const removeImage = (path) => {
  fs.unlink(path, (err) => console.log(err));
};
