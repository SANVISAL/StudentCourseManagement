import {
  ICreateCourse,
  IUpdateCourse,
} from "../database,/repository/@types/course.repository.type";
import CourseRepository, {
  SearchByDates,
} from "../database,/repository/course.repository";

class CourseService {
  private courseRepo: CourseRepository;
  constructor() {
    this.courseRepo = new CourseRepository();
  }
  async createCourse(courseDetaila: ICreateCourse) {
    try {
      const course = await this.courseRepo.createCourse(courseDetaila);
      if (course === null) {
        throw new Error("Course Creation Failed");
      } else {
        return course;
      }
    } catch (err) {
      throw err;
    }
  }
  async getAllCourse() {
    try {
      return await this.courseRepo.getAllCourses();
    } catch (err) {
      throw err;
    }
  }

  async updateCourse(id: string, courseDetails: IUpdateCourse) {
    try {
      const couesr = await this.courseRepo.updateCourse(id, courseDetails);
      return couesr;
    } catch (err) {
      throw err;
    }
  }

  async deleteCourse(id: string) {
    try {
      const course = await this.courseRepo.deleteCourse(id);
      return course;
    } catch (err) {
      throw err;
    }
  }
  async findByName(name: string) {
    try {
      const course = await this.courseRepo.findByName(name);
      return course;
    } catch (err) {
      throw err;
    }
  }
  async filterByStartDateEndDate(filter: SearchByDates) {
    try {
      const course = await this.courseRepo.filterStartDateByEndDate(filter);
      return course;
    } catch (err) {
      throw err;
    }
  }
  async findById(id: string) {
    try {
      const course = await this.courseRepo.findById(id);
      if (course == null) {
        throw new Error("course Not Found");
      } else {
        return course;
      }
    } catch (err) {
      throw err;
    }
  }
}

export default CourseService;
