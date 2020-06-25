import fs from "fs";

export default {
  publicPath: "public",
  defaultImgPath: "./public/images/",
  productImgPath: "products/",
  image_type_accept: process.env.IMAGE_TYPE_ACCEPT.split(","),
  fetchLimit: parseInt(process.env.DB_FETCH_LIMITER),
  userRole: process.env.USER_ROLE,
  adminRole: process.env.ADMIN_ROLE,
  mailId: process.env.MAIL_ID,
  mailPassword: process.env.MAIL_PASSWORD,
  mailService: process.env.MAIL_SERVICE,
  READ_STORAGE_PATH: "./storages/",
  TYPE_WRITE: "utf-8",
  PRIVATE_KEY: fs.readFileSync("./private.key", "UTF-8"),
  JWT_ALGORITHMS: process.env.JWT_ALGORITHMS,
  token_life_time: process.env.TOKEN_LIFE_TIME,
  image_size_allow:process.env.IMAGE_SIZE_ALLOW,
  imgPath: {
    category: {
      path: "./img/category/",
    },
  },
};
