interface ValidatorInterface{
    validate(): boolean
}

class CreateUserController{
    private readonly validator: ValidatorInterface

    public constructor(validator:ValidatorInterface){
        this.validator = validator
    }

    public async execute(){
        this.validator.validate()
    }
}

class ValidatorStub implements ValidatorInterface{
    validate(): boolean {
        return true
    }
}

describe('CreateUserController', () => {
    it('Should call validator once',async () => {
        const validatorStub = new ValidatorStub()
        const sut = new CreateUserController(validatorStub)
        const validatorSpy = jest.spyOn(validatorStub, 'validate')
        await sut.execute()

        expect(validatorSpy).toBeCalledTimes(1)
    })
})