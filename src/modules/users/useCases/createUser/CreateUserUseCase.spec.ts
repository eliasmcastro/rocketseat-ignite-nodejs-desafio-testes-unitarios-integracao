import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';

import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to create a new user', async () => {
    const user = {
      name: 'User test',
      email: 'user@email.com',
      password: '123456'
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(
      user.email,
    );

    expect(userCreated).toHaveProperty('id');
  });

  it('should not be able to create a new user with email exists', async () => {
    expect(async () => {
      const user = {
        name: 'User test',
        email: 'user@email.com',
        password: '123456'
      };

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
