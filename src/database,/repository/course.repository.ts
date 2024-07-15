import {
  ApiError,
  MissingReqirement,
  NotFoundError,
} from "../../errors/api-error";
import { Course } from "../model/course.model";
import { ICreateCourse, IUpdateCourse } from "./@types/course.repository.type";

export interface SearchByDates {
  startDate?: string;
  endDate?: string;
}

class CourseRepository {
  // methods to perform CRUD operations on courses
  async createCourse(courseDetails: ICreateCourse) {
    try {
      if (!courseDetails.Name || !courseDetails.professorName) {
        throw new MissingReqirement("Missing required cuurse details");
      }

      const course = new Course(courseDetails);
      const newCourse = await course.save();
      if (!newCourse) {
        throw new ApiError("Course Creation Failed");
      } else {
        return { message: "Course created successfully", data: course };
      }
    } catch (err) {
      console.log("CourseRepository:", err);
      if (err instanceof ApiError || err instanceof MissingReqirement) {
        throw err;
      }
      throw new ApiError("Unexpected error occurred while creating course");
    }
  }

  // async createCourse(courseDetails: ICreateCourse) {
  //   try {
  //     // Input validation (can use a library like Joi or Zod)
  //     if (!courseDetails.Name || !courseDetails.startDate || !courseDetails.endDate) {
  //       throw new ApiError("Invalid course details");
  //     }

  //     const course = new Course(courseDetails);
  //     const newCourse = await course.save();

  //     if (!newCourse) {
  //       throw new ApiError("Error creating course");
  //     }

  //     return { message: "Course created successfully", data: newCourse };
  //   } catch (error) {
  //     logger.error("CourseRepository:", error); // Better logging with logger
  //     if (error instanceof ApiError) {
  //       throw error; // Rethrow known errors
  //     }
  //     throw new ApiError("Unexpected error occurred while creating course");
  //   }
  // }

  async getAllCourses() {
    try {
      const course = await Course.find({ isDeleted: false });
      console.log("Course:", course);
      if (course.length !== 0) {
        return course;
      } else {
        throw new NotFoundError("Course Not Found");
      }
    } catch (err) {
      console.log("Course Repository:", err);
      if (err instanceof NotFoundError) {
        throw err; // Rethrow known errors
      }
      throw new ApiError("Unexpected error occurred while");
    }
  }
  async updateCourse(id: string, courseDetails: IUpdateCourse) {
    try {
      console.log("Course Repository Update", courseDetails);
      const course = await Course.findById(id);
      if (course !== null) {
        const updatecourse = await Course.findByIdAndUpdate(id, courseDetails, {
          new: true,
        });
        return updatecourse;
      } else {
        throw new ApiError("Invalid Course ID");
      }
    } catch (err) {
      console.log("Update Course Repository:", err);
      if (err instanceof ApiError) {
        throw err; // Rethrow known errors
      }
      throw new ApiError("Unexpected error occurred while update course");
    }
  }
  async deleteCourse(id: string) {
    try {
      const course = await Course.findById(id);
      if (course !== null) {
        const deleteCourse = await Course.findByIdAndUpdate(
          id,
          {
            isDeleted: true,
            deletedAt: new Date(),
          },
          { new: true }
        );
        return deleteCourse;
      } else {
        throw new ApiError("Invalid Course ID To Delete");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        throw err; // Rethrow known
      }
      throw new ApiError("Unexpected error occurred while delete course");
    }
  }
  async findByName(name: string) {
    try {
      console.log("Searching for course with name:", name);
      const query = {
        $or: [{ Name: name }],
      };
      const course = await Course.find(query);
      console.log("course:", course);
      if (course.length > 0) {
        return course;
      } else {
        throw new NotFoundError("Course Not Found");
      }
    } catch (err) {
      console.log("course Repository:", err);
      if (err instanceof ApiError) {
        throw err; // Rethrow known errors
      }
      throw new ApiError("Unexpected error occurred while find course");
    }
  }

  async filterStartDateByEndDate(filter: SearchByDates) {
    const query: any = { isDeleted: false };
    if (filter.startDate) {
      query.startDate = { $gte: filter.startDate };
    }

    if (filter.endDate) {
      query.endDate = { $lte: filter.endDate };
    }

    try {
      const course = await Course.find(query);
      if (course == null || course.length === 0) {
        throw new NotFoundError("Course Not Found");
      } else {
        return course;
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError("Unexpected error occurred while filter");
    }
  }
  async findById(id: string) {
    try {
      const course = await Course.findById(id);
      if (course == null) {
        throw new NotFoundError("Course Not Found");
      } else {
        return course;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError("Unexpected error occurred while find course");
    }
  }
}

export default CourseRepository;
