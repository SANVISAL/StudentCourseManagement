export interface ICreateStudent {
  fullNameEn: string;
  fullNameKh: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  phoneNumber: string;
}

export interface IUpdateStudent {
  fullNameEn?: string;
  fullNameKh?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female";
  phoneNumber?: string;
}
