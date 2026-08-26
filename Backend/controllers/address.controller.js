import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";
export const createAddress = async (req, res, next) => {
  try {
    const { Users_Id, Address, Province, District, Subdistrict, Postal_Code,
      Latitude, Longitude, Is_Default } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(Users_Id)
      }
    });
    if (!user) {
      createError(404, "User not found");
    }
    if (Is_Default === true) {
      await prisma.addresses.updateMany({
        where: {
          Users_Id: Number(Users_Id),
          Is_Default: true
        },
        data: {
          Is_Default: false
        }
      });
    }
    const address = await prisma.addresses.create({
      data: {
        Users_Id: Number(Users_Id),
        Address: Address || null,
        Province: Province,
        District: District || null,
        Subdistrict: Subdistrict || null,
        Postal_Code: Postal_Code || null,
        Latitude: Number(Latitude),
        Longitude: Number(Longitude),
        Is_Default: Is_Default === true
      }
    });
    res.json({ message: "Address created successfully", result: address });
  } catch (err) {
    next(err);
  }
};
export const getMyAddresses = async (req, res, next) => {
  try {
    const { Users_Id } = req.params;
    const addresses = await prisma.addresses.findMany({
      where: {
        Users_Id: Number(Users_Id)
      },
      orderBy: [
        {
          Is_Default: "desc"
        },
        {
          Created_At: "desc"
        }
      ]
    });
    res.json({ result: addresses });
  } catch (err) {
    next(err);
  }
};
export const getAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const address = await prisma.addresses.findUnique({
      where: {
        Address_Id: Number(id)
      }
    });
    if (!address) {
      createError(404, "Address not found");
    }
    res.json({ result: address });
  } catch (err) {
    next(err);
  }
};
export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Users_Id, Address, Province, District, Subdistrict, Postal_Code,
      Latitude, Longitude, Is_Default } = req.body;
    const address = await prisma.addresses.findUnique({
      where: {
        Address_Id: Number(id)
      }
    });
    if (!address) {
      createError(404, "Address not found");
    }
    if (address.Users_Id !== Number(Users_Id)) {
      createError(403, "Access Denied");
    }
    if (Is_Default === true) {
      await prisma.addresses.updateMany({
        where: {
          Users_Id: Number(Users_Id),
          Address_Id: {
            not: Number(id)
          },
          Is_Default: true
        },
        data: {
          Is_Default: false
        }
      });
    }
    const result = await prisma.addresses.update({
      where: {
        Address_Id: Number(id)
      },
      data: {
        Address: Address || address.Address,
        Province: Province || address.Province,
        District: District || address.District,
        Subdistrict: Subdistrict || address.Subdistrict,
        Postal_Code: Postal_Code || address.Postal_Code,
        Latitude: Number(Latitude),
        Longitude: Number(Longitude),
        Is_Default: Is_Default || address.Is_Default
      }
    });
    res.json({ message: "Address updated successfully", result });
  } catch (err) {
    next(err);
  }
};
export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Users_Id } = req.body;
    const address = await prisma.addresses.findUnique({
      where: {
        Address_Id: Number(id)
      }
    });
    if (!address) {
      createError(404, "Address not found");
    }
    if (address.Users_Id !== Number(Users_Id)) {
      createError(403, "Access Denied");
    }
    await prisma.addresses.delete({
      where: {
        Address_Id: Number(id)
      }
    });
    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    next(err);
  }
};