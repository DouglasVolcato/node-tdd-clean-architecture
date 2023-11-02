import { makeUserEntity } from "../../entities/user-entity-helper";
import { CreateUserUseCaseInterface } from "../../../../src/domain/protocols";

export class CreateUserServiceStub
  implements CreateUserUseCaseInterface.Service
{
  public async execute(
    userDto: CreateUserUseCaseInterface.Input
  ): Promise<CreateUserUseCaseInterface.Output> {
    return Promise.resolve(makeUserEntity());
  }
}
