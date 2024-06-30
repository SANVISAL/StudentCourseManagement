# 🎓 Student Course Management System

This project implements a **Student Course Management system** using **Express**, **Node.js**, and **MongoDB**. It provides APIs for managing students and courses, with features like search, registration, and reporting.

---

## <span style="color: #6D4C41;">🚀 Tech Stack</span>

- <span style="color: #EF6C00;">**Express**</span>: Node.js web application framework
- <span style="color: #FF8A65;">**Node.js**</span>: JavaScript runtime
- <span style="color: #FFB74D;">**MongoDB**</span>: NoSQL database for storing student and course data

---

## <span style="color: #8E24AA;">📚 Database Design</span>

### <span style="color: #BA68C8;">Collections</span>

1. **Students**
   - Full name (both English and Khmer)
   - Date of birth
   - Gender
   - Phone number
   - Soft delete functionality

2. **Courses**
   - Name
   - Professor name
   - Limit number of students
   - Start date
   - End date
   - Soft delete functionality

### <span style="color: #9C27B0;">Relationships</span>

- Students can register for multiple courses.
- Courses can have multiple registered students.

---

## <span style="color: #43A047;">✨ Features</span>

1. **Student API**
   - CRUD operations with soft delete
   - Free-text search by Full name or phone number

2. **Course API**
   - CRUD operations with soft delete
   - Free-text search by Name
   - Advanced search filter by start date and end date

3. **Registration**
   - Register and remove courses for students

4. **Reporting**
   - API endpoints to generate reports:
     - Course report: Course name, professor, start date, end date, limit number of students, number of registered students
     - Student report: Student full name, date of birth, gender, phone number, number of courses registered

---

## <span style="color: #1E88E5;">🛠️ Setup and Installation</span>

1. **Clone the repository**:
   ```bash
   git clone <https://github.com/SANVISAL/StudentCourseManagement.git>
   cd student-course-management
