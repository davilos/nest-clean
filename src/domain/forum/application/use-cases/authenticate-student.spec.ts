import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeStudent } from "test/factories/make-student";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { AuthenticateStudentUseCase } from "./authenticate-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateStudentUseCase;

describe("Authenticate Student", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate a student", async () => {
    const student = makeStudent({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("password"),
    });

    inMemoryStudentsRepository.items.push(student);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "password",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
