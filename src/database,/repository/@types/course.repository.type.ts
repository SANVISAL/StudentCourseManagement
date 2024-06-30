export interface ICreateCourse {
    Name: string;
    professorName: string;
    numberOfStudents: number;
    startDate: string;
    endDate: string;
  }
  
  export interface IUpdateCourse {
    Name?: string;
    professorName?: string;
    numberOfStudents?: number;
    startDate?: string;
    endDate?: string;
  }
  