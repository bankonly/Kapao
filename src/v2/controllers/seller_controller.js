import Res from "./response_controller";

const sellerModel = require("../models/seller");

const crypto = require("crypto-js");

// get all sellers
exports.getSellerList = async (req, res) => {
  const response = Res(res);
  try {
    const sellers = await sellerModel.find().populate(["category_id"]);
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
  const response = Res(res);
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
  const response = Res(res);
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
      response.success({ data: sellers, msg: "create seller failed" });
    }
  } catch (ex) {
    response.somethingWrong({ error: ex });
  }
};

// disable  seller
exports.disableSeller = async (req, res) => {
  const response = Res(res);
  const sellerID = req.params.sellerID;
  try {
    const foundSeller = await sellerModel.findById(sellerID);
    if (!foundSeller) {
      response.notFound({ data: sellers, msg: "seller not found" });
    }
    const newValue = foundSeller.is_active === "active" ? "inActive" : "active";
    foundSeller.is_active = newValue;
    if (await foundSeller.save()) {
      response.success({ data: foundSeller});
    } else {
      response.somethingWrong({});
    }
  } catch (ex) {
    response.somethingWrong({ error: ex });
  }
};

// edit  seller
exports.updateSeller = async (req, res) => {
  const response = Res(res);
  const sellerID = req.params.sellerID;
  const sellerData = req.body;
  try {
    let foundSeller = await sellerModel.findById(sellerID);
    if (!foundSeller) {
      response.notFound({ data: sellers, msg: "seller not found" });
    }
    foundSeller.set(sellerData);
    if (await foundSeller.save()) {
      response.success({
        data: foundSeller,
        msg: "update seller successfully",
      });
    } else {
      response.somethingWrong({});
    }
  } catch (ex) {
    response.somethingWrong({ error: ex });
  }
};