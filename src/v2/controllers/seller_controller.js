import Res from "./response_controller";

const sellerModel = require("../models/seller");

const crypto = require("crypto-js");

const config = require("./../configs/constant");

const { uploadImage, removeFile } = require("./../providers/file_provider");

// get all sellers
exports.getSellerList = async (req, res) => {
  const response = new Res(res);
  try {
    const sellers = await sellerModel
      .find()
      .populate(["category_id", "delivery_fee_option_id"]);
    if (sellers.length > 0) {
      response.success({ data: sellers });
    } else {
      response.success({ data: sellers, msg: "no data found" });
    }
  } catch (ex) {
    response.somethingWrong({ error: ex });
  }
};
// get seller by ID
exports.findSellerByID = async (req, res) => {
  const response = new Res(res);
  const sellerID = req.params.sellerID;
  try {
    const sellers = await sellerModel
      .findById(sellerID)
      .populate(["category_id", "delivery_fee_option_id"]);
    if (sellers) {
      response.success({ data: sellers });
    } else {
      response.success({ data: sellers, msg: "no data found" });
    }
  } catch (ex) {
    response.somethingWrong({ error: ex });
  }
};
// create new  seller
exports.createSeller = async (req, res) => {
  const response = new Res(res);

  // upload images
  const uploadSttImg = uploadImage({
    req,
    path: config.imgPath.seller,
    file: req.files.img,
  });
  if (uploadSttImg.status && uploadSttImg.code === 200) {
    req.body.img = uploadSttImg.data;
  }
  const uploadSttLogo = uploadImage({
    req,
    path: config.imgPath.seller,
    file: req.files.logo,
  });
  if (uploadSttLogo.status && uploadSttLogo.code === 200) {
    req.body.logo = uploadSttLogo.data;
  } else {
    // remove just uploaded image
  }
  // end upload image

  const SECRET_KEY_PASS = process.env.SECRET_KEY_PASS;
  const sellerData = req.body;
  const encriptedPass = crypto.AES.encrypt(
    JSON.stringify(req.body.pass),
    SECRET_KEY_PASS
  );
  req.body.pass = encriptedPass;
  try {
    const newSeller = new sellerModel(sellerData);
    const savedSeller = await newSeller.save();
    if (savedSeller) {
      response.created({
        data: savedSeller,
        msg: "create seller successfully",
      });
    } else {
      response.success({ msg: "create seller failed" });
    }
  } catch (ex) {
    response.somethingWrong({ error: ex });
  }
};

// disable  seller
exports.enableDisableSeller = async (req, res) => {
  const response = new Res(res);
  const sellerID = req.params.sellerID;
  try {
    const foundSeller = await sellerModel.findById(sellerID);
    if (!foundSeller) {
      return response.notFound({ data: sellerID, msg: "seller not found" });
    }
    foundSeller.set(req.body);
    if (await foundSeller.save()) {
      return response.success({ data: foundSeller });
    } else {
      return response.somethingWrong({});
    }
  } catch (ex) {
    return response.somethingWrong({ error: ex });
  }
};

// update  seller
exports.updateSeller = async (req, res) => {
  const response = new Res(res);
  const sellerID = req.params.sellerID;
  const sellerData = req.body;
  try {
    let foundSeller = await sellerModel.findById(sellerID);
    if (!foundSeller) {
      return response.notFound({ data: sellerID, msg: "seller not found" });
    }
    foundSeller.set(sellerData);
    if (await foundSeller.save()) {
      return response.success({
        data: foundSeller,
        msg: "update seller successfully",
      });
    } else {
      return response.somethingWrong({});
    }
  } catch (ex) {
    return response.somethingWrong({ error: ex });
  }
};

// edit  seller images
exports.updateSellerImages = async (req, res) => {
  const response = new Res(res);
  const sellerID = req.params.sellerID;
  const sellerData = req.body;
  try {
    let foundSeller = await sellerModel.findById(sellerID).select("img logo");
    if (!foundSeller) {
      return response.notFound({ data: sellerID, msg: "seller not found" });
    }

    // get old image name
    const imgOldName = foundSeller.img;
    const logoOldName = foundSeller.logo;

    let newImg = "";
    let newLogo = "";
    let removeFileStatus = {
      logo: {
        small: "upload new file not success",
        big: "upload new file not success",
        original: "upload new file not success",
      },
      img: {
        small: "upload new file not success",
        big: "upload new file not success",
        original: "upload new file not success",
      },
    };
    // upload images
    const uploadSttImg = uploadImage({
      req,
      path: config.imgPath.seller,
      file: req.files.img,
    });
    if (uploadSttImg.status && uploadSttImg.code === 200) {
      newImg = uploadSttImg.data;
      removeFileStatus.img.original = await removeFile(
        config.imgPath.seller,
        imgOldName
      );
      removeFileStatus.img.small = await removeFile(
        `${config.imgPath.seller}/200x200`,
        imgOldName
      );
      removeFileStatus.img.big = await removeFile(
        `${config.imgPath.seller}/800x800`,
        imgOldName
      );
    }
    const uploadSttLogo = uploadImage({
      req,
      path: config.imgPath.seller,
      file: req.files.logo,
    });
    if (uploadSttLogo.status && uploadSttLogo.code === 200) {
      newLogo = uploadSttLogo.data;
      removeFileStatus.logo.original = await removeFile(
        config.imgPath.seller,
        logoOldName
      );
      removeFileStatus.logo.small = await removeFile(
        `${config.imgPath.seller}/200x200`,
        logoOldName
      );
      removeFileStatus.logo.big = await removeFile(
        `${config.imgPath.seller}/800x800`,
        logoOldName
      );
    } else {
      // remove just uploaded image
    }
    // end upload image

    // save image name to database
    foundSeller.set({
      img: newImg,
      logo: newLogo,
    });
    if (await foundSeller.save()) {
      return response.success({
        data: [foundSeller, removeFileStatus],
        msg: "update seller images successfully",
      });
    } else {
      return response.somethingWrong({});
    }
  } catch (ex) {
    return response.somethingWrong({ error: ex });
  }
};
