import prisma from "../config/prisma.js";
export const getProvinces = async (req, res, next) => {
  try {
    const provinces = await prisma.provinces.findMany({
      select: {
        Province_Id: true,
        Name: true
      },
      orderBy: {
        Name: "asc"
      }
    });
    res.json({result: provinces});
  } catch (err) {
    next(err);
  }
};

export const getDistricts = async (req, res, next) => {
  try {
    const { provinceId } = req.params;
    const districts = await prisma.districts.findMany({
      where: {
        Province_Id: Number(provinceId)
      },
      select: {
        District_Id: true,
        Name: true
      },
      orderBy: {
        Name: "asc"
      }
    });
    res.json({result: districts});
  } catch (err) {
    next(err);
  }
};

export const getSubdistricts = async (req, res, next) => {
  try {
    const { districtId } = req.params;
    const subdistricts = await prisma.subdistricts.findMany({
      where: {
        District_Id: Number(districtId)
      },
      select: {
        Subdistrict_Id: true,
        Name: true,
        Postal_Code: true
      },
      orderBy: {
        Name: "asc"
      }
    });
    res.json({result: subdistricts});
  } catch (err) {
    next(err);
  }
};