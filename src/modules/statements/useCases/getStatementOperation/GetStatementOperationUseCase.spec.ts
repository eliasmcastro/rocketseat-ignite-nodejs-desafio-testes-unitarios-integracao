import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { OperationType } from '../../entities/Statement';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { GetStatementOperationError } from './GetStatementOperationError';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('GetStatementOperationUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it('should be able to get the statement operation', async () => {
    const user = await usersRepository.create({
      name: 'User test',
      email: 'user@email.com',
      password: '123456'
    });

    const statement = await statementsRepository.create({
      user_id: user.id as string,
      description: 'test',
      amount: 100,
      type: OperationType.DEPOSIT
    });

    const response = await getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: user.id as string,
    });

    expect(response).toBe(statement);
  });

  it('should not be able to get the statement operation with a non-existent user', async () => {
    expect(async () => {
      const statement = await statementsRepository.create({
        user_id: 'non-existent',
        description: 'test',
        amount: 100,
        type: OperationType.DEPOSIT
      });

      await getStatementOperationUseCase.execute({
        user_id: 'non-existent',
        statement_id: statement.id as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('should not be able to get the statement operation with a non-existent statement', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: 'User test',
        email: 'user@email.com',
        password: '123456'
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: 'non-existent'
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
