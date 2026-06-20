import prisma from "../config/prisma.js";
import createError from "../utils/createError.js";

export const createReview = async (req, res, next) => {
  try {
    const { Order_Id, Rating, Comment } = req.body;
    const order = await prisma.orders.findUnique({
      where: {
        Order_Id: Number(Order_Id)
      }
    });
    if (!order) {
      createError(404, "Order not found");
    }
    if (order.Status !== "COMPLETED") {
      createError(400, "Order is not completed")
    }
    const review = await prisma.reviews.findUnique({
      where: {
        Order_Id: Number(Order_Id)
      }
    });
    if (review) {
      createError(400, "Review already exists")
    }
    const result = await prisma.reviews.create({
      data: {
        Order_Id: Number(Order_Id),
        Rating: Number(Rating),
        Comment
      }
    });
    res.json({message: "Create Review Success",result});
  } catch (err) {
    next(err);
  }
};
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.reviews.findMany({
      include: {
        Order: {
          include: {
            User: {
              include: {
                Profile: true
              }
            },
            Service: true
          }
        }
      },
      orderBy: {
        Created_At: "desc"
      }
    });
    res.json({result: reviews});
  } catch (err) {
    next(err);
  }
};
export const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await prisma.reviews.findUnique({
      where: {
        Review_Id: Number(id)
      },
      include: {
        Order: {
          include: {
            User: true,
            Service: true
          }
        }
      }
    });
    if (!review) {
      createError(404, "Review not found");
    }
    res.json({result: review});
  } catch (err) {
    next(err);
  }
};
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Rating, Comment } = req.body;
    const review = await prisma.reviews.findUnique({
      where: {
        Review_Id: Number(id)
      }
    });
    if (!review) {
      createError(404, "Review not found");
    }
    const result = await prisma.reviews.update({
      where: {
        Review_Id: Number(id)
      },
      data: {
        Rating: Number(Rating),
        Comment
      }
    });
    res.json({message: "Update Review Success",result});
  } catch (err) {
    next(err);
  }
};
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await prisma.reviews.findUnique({
      where: {
        Review_Id: Number(id)
      }
    });
    if (!review) {
      createError(404, "Review not found");
    }
    await prisma.reviews.delete({
      where: {
        Review_Id: Number(id)
      }
    });
    res.json({message: "Delete Review Success"});
  } catch (err) {
    next(err);
  }
};
export const getReviewsByService = async (req,res,next) => {
  try {
    const { serviceId } = req.params;
    const reviews = await prisma.reviews.findMany({
      where: {
        Order: {
          Service_Id: Number(serviceId)
        }
      },
      include: {
        Order: {
          include: {
            User: {
              include: {
                Profile: true
              }
            }
          }
        }
      },
      orderBy: {
        Created_At: "desc"
      }
    });
    res.json({result: reviews});
  } catch (err) {
    next(err);
  }
};
export const getServiceRating = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const reviews = await prisma.reviews.findMany({
      where: {
        Order: {
          Service_Id: Number(serviceId)
        }
      },
      select: {
        Rating: true
      }
    });
    const totalReviews = reviews.length;
    let totalRating = 0;
    reviews.forEach((review) => {
      totalRating += review.Rating;
    });
    const averageRating =totalReviews > 0? totalRating / totalReviews: 0;
    res.json({averageRating,totalReviews});
  } catch (err) {
    next(err);
  }
};