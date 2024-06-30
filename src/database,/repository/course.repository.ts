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
      //   const courseRequest = await this.findByPhoneNumber(
      //     courseDetails.phoneNumber
      //   );
      //   if (courseRequest) {
      //     throw new Error("course Already Exist");
      //   } else {
      const course = new Course(courseDetails);
      await course.save();
      return { message: "Course created successfully", data: course };
      //   }
    } catch (error) {
      console.log("CourseRepository:", error);
      throw error;
    }
  }

  async getAllCourses() {
    try {
      const course = await Course.find({ isDeleted: false });
      console.log("Course:", course);
      if (course) {
        return course;
      } else {
        throw new Error("Course Not Found");
      }
    } catch (err) {
      console.log("Course Repository:", err);
      throw new Error();
    }
  }
  async updateCourse(id: string, courseDetails: IUpdateCourse) {
    try {
      console.log("Course Repository Update", courseDetails);

      const updatecourse = await Course.findByIdAndUpdate(id, courseDetails, {
        new: true,
      });
      return updatecourse;
    } catch (err) {
      console.log("Update Course Repository:", err);
      throw new Error();
    }
  }
  async deleteCourse(id: string) {
    try {
      const course = await Course.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
        { new: true }
      );
      return course;
    } catch (err) {
      throw new Error("Course Repository:");
    }
  }
  async findByName(name: string) {
    try {
      const query = {
        $or: [{ Name: name }],
      };
      const course = await Course.find(query);
      console.log("course:", course);
      if (course) {
        return course;
      } else {
        throw new Error("course Not Found");
      }
    } catch (err) {
      console.log("course Repository:", err);
      throw err;
    }
  }
  async filterStartDateByEndDate(filter: SearchByDates) {
    const query:any = {isDeleted:false};
    if (filter.startDate) {
      query.startDate = { $gte: filter.startDate };
    }

    if (filter.endDate) {
      query.endDate = { $lte: filter.endDate };
    }

    try {
      const course = await Course.find(query);
      if (course == null) {
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
      return course;
    } catch (err) {
      throw err;
    }
  }
}

export default CourseRepository;
