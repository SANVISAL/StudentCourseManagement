import {
  ICreateCourse,
  IUpdateCourse,
} from "../database,/repository/@types/course.repository.type";
import { SearchByDates } from "../database,/repository/course.repository";
import CourseService from "../services/course.service";

class CourseController {
  private courseService: CourseService;
  constructor() {
    this.courseService = new CourseService();
  }

  async createCourse(courseDetaila: ICreateCourse) {
    try {
      const course = await this.courseService.createCourse(courseDetaila);
      return course;
    } catch (err) {
      throw err;
    }
  }

  public async getAllCourse() {
    try {
      const result = await this.courseService.getAllCourse();
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async upateCourse(id: string, courseDetails: IUpdateCourse) {
    try {
      const result = await this.courseService.updateCourse(id, courseDetails);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async deleteCourse(id: string) {
    try {
      const result = await this.courseService.deleteCourse(id);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async findByName(name: string) {
    try {
      const result = await this.courseService.findByName(name);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async fliterByStartDateEndDate(filter: SearchByDates) {
    try {
      const result = await this.courseService.filterByStartDateEndDate(filter);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async findById(id: string) {
    try {
      const result = await this.courseService.findById(id);;
      return result;
    } catch (err) {
      throw err
    }
  }
  
}

export default CourseController;
