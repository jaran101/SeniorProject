import prisma from "../config/prisma.js";
import provinces from "./data/provinces.json" with { type: "json" };
import districts from "./data/districts.json" with { type: "json" };
import subdistricts from "./data/subdistricts.json" with { type: "json" };
const seed = async () => {
  try {
    console.log("=================================");
    console.log("Starting location seed...");
    console.log("=================================");
    console.log("Seeding provinces...");
    for (const province of provinces) {
      await prisma.provinces.upsert({
        where: {
          Province_Id: province.id
        },
        update: {
          Name: province.provinceNameTh
        },
        create: {
          Province_Id: province.id,
          Name: province.provinceNameTh
        }
      });
    }
    console.log(`Provinces: ${provinces.length}`);
    console.log("Seeding districts...");
    for (const district of districts) {
      const province = provinces.find((item) => item.provinceCode === district.provinceCode);
      if (!province) {
        console.log(`Province not found for district: ${district.districtNameTh}`);
        continue;
      }
      await prisma.districts.upsert({
        where: {
          District_Id: district.id
        },
        update: {
          Province_Id: province.id,
          Name: district.districtNameTh
        },
        create: {
          District_Id: district.id,
          Province_Id: province.id,
          Name: district.districtNameTh
        }
      });
    }
    console.log(`Districts: ${districts.length}`);
    console.log("Seeding subdistricts...");
    for (const subdistrict of subdistricts) {
      const district = districts.find((item) => item.districtCode === subdistrict.districtCode);
      if (!district) {
        console.log(`District not found for subdistrict: ${subdistrict.subdistrictNameTh}`);
        continue;
      }
      await prisma.subdistricts.upsert({
        where: {
          Subdistrict_Id: subdistrict.id
        },
        update: {
          District_Id: district.id,
          Name: subdistrict.subdistrictNameTh,
          Postal_Code: String(subdistrict.postalCode)
        },
        create: {
          Subdistrict_Id: subdistrict.id,
          District_Id: district.id,
          Name: subdistrict.subdistrictNameTh,
          Postal_Code: String(subdistrict.postalCode)
        }
      });
    }
    console.log(`Subdistricts: ${subdistricts.length}`);
    console.log("=================================");
    console.log("Location seed completed!");
    console.log("=================================");
  } catch (error) {
    console.error("Seed failed:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};
seed();