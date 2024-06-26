import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { OperationType } from '../../entities/Statement';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from './CreateStatementUseCase';

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe('CreateStatementUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it('should be able to create a deposit statement', async () => {
    const user = await usersRepository.create({
      name: 'User test',
      email: 'user@email.com',
      password: '123456'
    });

    const response = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: 'test',
      amount: 100,
      type: OperationType.DEPOSIT
    });

    expect(response).toHaveProperty('id');
  });

  it('should be able to create a withdraw statement', async () => {
    const user = await usersRepository.create({
      name: 'User test',
      email: 'user@email.com',
      password: '123456'
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      description: 'test',
      amount: 101,
      type: OperationType.DEPOSIT
    });

    const response = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: 'test',
      amount: 100,
      type: OperationType.WITHDRAW
    });

    expect(response).toHaveProperty('id');
  });

  it('should not be able to create a withdraw statement without funds', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: 'User test',
        email: 'user@email.com',
        password: '123456'
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        description: 'test',
        amount: 100,
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it('should not be able to create a statement with a non-existent user', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'non-existent',
        description: 'test',
        amount: 100,
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
