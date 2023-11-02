import { makeUserEntity } from "../../entities/user-entity-helper";
import { DeleteUserUseCaseInterface } from "../../../../src/domain/protocols";

export class DeleteUserServiceStub
  implements DeleteUserUseCaseInterface.Service
{
  public execute({
    id,
  }: DeleteUserUseCaseInterface.Input): Promise<DeleteUserUseCaseInterface.Output> {
    return Promise.resolve(makeUserEntity());
  }
}
