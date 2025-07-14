import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Student } from "@/domain/forum/enterprise/entities/student";

import { User as PrismaUser, Prisma } from "@prisma/client";

export class PrismaStudentMapper {
  static toDomain(raw: PrismaUser): Student {
    const studentId = new UniqueEntityID(raw.id);

    return Student.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
      },
      studentId,
    );
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      email: student.email,
      name: student.name,
      password: student.password,
    };
  }
}
