import { AccessPolicy } from "../../models/access_policy";
import { Admin } from "../../models/admin";

/** Helpers */
import Bcrypt from "../../helpers/Bcrypt";

export const runSeeder = async (req, res) => {
  /** Access Policy Data */
  const accessPolicyData = {
    is_super_admin: true,
    name: !req.body.username ? "super_admin" : req.body.username,
  };

  /** Admin Data */
  const adminData = [
    {
      name: "super_admin",
      contact: {
        phone_number: "8562052750365",
        email: "super_admin@gmail.com",
      },
      password: await Bcrypt.hashPassword("Test123!"), // 111998tsc
    },
    {
      name: "super_admin2",
      contact: {
        phone_number: "8562052750365",
        email: "super_admin2@gmail.com",
      },
      password: await Bcrypt.hashPassword("Test123!"), // 111998tsc
    },
  ];

  const checkAccessPolicy = await AccessPolicy.find();
  if (checkAccessPolicy.length > 0) {
    return res.json("Seeder already run... please try again");
  }
  const accessSave = await AccessPolicy.create(accessPolicyData);
  adminData[0].access_policy = accessSave._id;
  adminData[1].access_policy = accessSave._id;
  await Admin.create(adminData);

  res.json("Seeder Created");
};
