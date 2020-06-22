// Files Import Models,Controller ...
const Helpers = require("../helpers/Global");
const QB = require("../helpers/query_builder");
const FileProvider = require("../providers/file_provider");
const ResCtl = require("./response_controller");
const Category = require("../models/category");
const CatProvider = require("../providers/category_provider");
const constant = require("../configs/constant");

// save category
export const saveCategory = async (req, res, next) => {
  // define response
  const response = new ResCtl(res);
  try {
    const isValid = CatProvider.validateSaveData(req);
    if (!Helpers.isEmptyObj(isValid)) {
      return response.badRequest({ data: isValid });
    }

    // name check
    const isName = await Category.findOne({ name: req.body.name });
    if (isName !== null) {
      return response.badRequest({ msg: "Name is already exist" });
    }

    const isUpload = FileProvider.uploadImage({
      req: req,
      path: constant.imgPath.category,
      file: req.files.img,
    });
    if (!isUpload.status) return response.badRequest(isUpload);

    // cal save function from provider
    const isSave = await Category.create(req.body);
    if (!isSave) return response.badRequest({ msg: "can not add" });

    return response.success({ data: isSave });
  } catch (error) {
    return response.somethingWrong({ error: error });
  }
};

// update category
export const updateCategory = async (req, res, next) => {
  // define response
  const response = new ResCtl(res);
  try {
    // Check if auth is not super admin
    if (!req.is_super_admin)
      return response.notAllowed({ msg: "access denied" });

    const cat_id = req.params.cat_id;

    // cal save function from provider
    if (!Helpers.validateObjectId(cat_id) || !req.body.name) {
      return response.badRequest({ msg: "invalid request" });
    }

    const isCatID = await QB.isIdExist(Category, cat_id);
    if (isCatID == null) {
      return response.notFound({ msg: "Id is not exist" });
    }
    // name check
    const isName = await Category.findOne({ name: req.body.name });
    if (isName !== null && isName.name !== isCatID.name) {
      return response.badRequest({ msg: "Name is already exist" });
    }

    // save data
    isCatID.name = req.body.name;

    if (req.files) {
      if (!req.files.img) {
        return response.badRequest({ msg: "img is required" });
      }
      const isUpload = FileProvider.uploadImage({
        req: req,
        path: constant.imgPath.category,
        file: req.files.img,
      });
      isCatID.img = req.body.img;
      if (!isUpload.status) return response.badRequest(isUpload);
    }

    if (await isCatID.save()) return response.success({ data: "updated" });
    return response.badRequest({ msg: "can not update" });
  } catch (error) {
    return response.somethingWrong({ error: error });
  }
};

// get all category
export const getAllCategory = async (req, res, next) => {
  // define response
  const response = new ResCtl(res);
  try {
    const catData = await CatProvider.fetch(null, req.is_super_admin);
    return response.success(catData);
  } catch (error) {
    return response.somethingWrong({ error: error });
  }
};

// get category
export const getCategory = async (req, res, next) => {
  // define response
  const response = new ResCtl(res);
  try {
    const catData = await CatProvider.fetch(
      req.params.cat_id,
      req.is_super_admin
    );
    return response.success(catData);
  } catch (error) {
    return response.somethingWrong({ error: error });
  }
};

// delete category
export const deleteCategory = async (req, res, next) => {
  // define response
  const response = new ResCtl(res);
  try {
    // Check validator
    if (!Helpers.validateObjectId(req.params.cat_id)) {
      return response.badRequest({ data: "invalid id" });
    }

    const isId = await QB.isIdExist(Category, req.params.cat_id);
    if (!isId || isId.is_active == "in_active") {
      return response.notFound({ msg: "no data" });
    }

    const delAcc = await QB.deleteIsActive(Category, req.params.cat_id);
    if (!delAcc) {
      return response.badRequest({ msg: "can not delete" });
    }
    return response.success({ msg: "deleted" });
  } catch (error) {
    return response.somethingWrong({ error: error });
  }
};
