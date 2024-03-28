import { AppError } from '../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able to show a user', async () => {
    const user = {
      name: 'User test',
      email: 'user@email.com',
      password: '123456'
    };

    const userCreated = await createUserUseCase.execute(user);

    const userProfile = await showUserProfileUseCase.execute(userCreated.id as string);

    expect(userProfile).toBe(userCreated);
  });

  it('should not be able to show a non-existent user', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('non-existent-user-id');
    }).rejects.toBeInstanceOf(AppError);
  });
});
