import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Student } from "../../enterprise/entities/student";
import { HashGenerator } from "../cryptography/hash-generator";
import { StudentsRepository } from "../repositories/students-repository";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentsWithSameEmail = await this.studentsRepository.findByEmail(
      email
    );

    if (studentsWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      email,
      name,
      password: hashedPassword,
    });

    await this.studentsRepository.create(student);

    return right({
      student,
    });
  }
}
