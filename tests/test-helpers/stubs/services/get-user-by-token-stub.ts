import { makeUserEntity } from "../../entities/user-entity-helper";
import { GetUserByTokenUseCaseInterface } from "../../../../src/domain/protocols";

export class GetUserByTokenServiceStub
  implements GetUserByTokenUseCaseInterface.Service
{
  public async execute({
    token,
  }: GetUserByTokenUseCaseInterface.Input): Promise<GetUserByTokenUseCaseInterface.Output> {
    return Promise.resolve(makeUserEntity());
  }
}
