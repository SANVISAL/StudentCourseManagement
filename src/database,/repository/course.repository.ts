import { ICourse } from "../model/@types/course.types";
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
      const course = new Course(courseDetails);
      await course.save();
      return { message: "Course created successfully", data: course };
    } catch (error) {
      console.log("CourseRepository:", error);
      throw error;
    }
  }

  async getAllCourses() {
    try {
      const course = await Course.find({ isDeleted: false });
      console.log("Course:", course);
      if (course.length !== 0) {
        return course;
      } else {
        throw new Error("Course Not Found");
      }
    } catch (err) {
      console.log("Course Repository:", err);
      throw err;
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
        throw new Error("Invalid Course ID");
      }
    } catch (err) {
      console.log("Update Course Repository:", err);
      throw err;
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
        throw new Error("Invalid Course ID To Delete");
      }
    } catch (err) {
      throw err;
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
        throw new Error("Course Not Found");
      }
    } catch (err) {
      console.log("course Repository:", err);
      throw err;
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
        throw new Error("Course Not Found");
      } else {
        return course;
      }
    } catch (err: any) {
      throw err;
    }
  }
  async findById(id: string) {
    try {
      const course = await Course.findById(id);
      if (course == null) {
        throw new Error("Course Not Found");
      } else {
        return course;
      }
    } catch (err) {
      throw err;
    }
  }
}

export default CourseRepository;
