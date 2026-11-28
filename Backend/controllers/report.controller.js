import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";
export const createReport = async (req, res, next) => {
  try {
    const { Users_Id, Title, Description } = req.body;
    if (!Users_Id || !Title|| !Description) {
      createError(400, "Please enter all required fields");
    }
    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(Users_Id),
      },
    });
    if (!user) {
      createError(404, "User not found");
    }
    const report = await prisma.reports.create({
      data: {
        Users_Id: Number(Users_Id),
        Title: Title,
        Description: Description
      }
    });
    res.json({message: "Create Report Success",result: report});
  } catch (err) {
    next(err);
  }
};
export const getMyReports = async (req, res, next) => {
  try {
    const { Users_Id } = req.params;
    if (!Users_Id) {
      createError(400,"Please enter Users_Id");
    }

    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(Users_Id),
      },
    });
    if (!user) {
      createError(404,"User not found");
    }
    const reports = await prisma.reports.findMany({
      where: {
        Users_Id: Number(Users_Id),
      },
      orderBy: {
        Created_At: "desc"
      }
    });
    res.json({result: reports});
  } catch (err) {
    next(err);
  }
};
export const getAllReports = async (req, res, next) => {
  try {
    const { Users_Id } = req.params;
    if (!Users_Id) {
      createError(400, "Please enter Users_Id");
    }
    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(Users_Id),
      },
    });
    if (!user) {
      createError(404, "User not found");
    }
    if (user.Role !== "ADMIN") {
      createError(403, "Only Admin can view all reports");
    }
    const reports = await prisma.reports.findMany({
      include: {
        User: {
          select: {
            Users_Id: true,
            Email: true,
            Role: true
          }
        }
      },
      orderBy: {
        Created_At: "desc"
      }
    });
    res.json({result: reports});
  } catch (err) {
    next(err);
  }
};
export const updateReportStatus = async (req, res, next) => {
  try {
    const { Report_Id } = req.params;
    const { Users_Id, Status, Admin_Reply } = req.body;
    if (!Users_Id || !Status) {
      createError(400, "Please enter all required fields");
    }
    const user = await prisma.users.findUnique({
      where: {
        Users_Id: Number(Users_Id)
      }
    });
    if (!user) {
      createError(404, "User not found");
    }
    if (user.Role !== "ADMIN") {
      createError(403, "Only Admin can update report status");
    }
    const report = await prisma.reports.findUnique({
      where: {
        Report_Id: Number(Report_Id)
      }
    });
    if (!report) {
      createError(404, "Report not found");
    }
    const updatedReport = await prisma.reports.update({
      where: {
        Report_Id: Number(Report_Id)
      },
      data: {
        Status: Status,
        Admin_Reply: Admin_Reply
      }
    });
    res.json({message: "Update Report Status Success",result: updatedReport});
  } catch (err) {
    next(err);
  }
};

