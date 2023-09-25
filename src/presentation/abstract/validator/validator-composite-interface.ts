import { ValidatorInterface } from "./validator-interface";

export interface ValidatorCompositeInterface extends ValidatorInterface {
  setValidators(validators: ValidatorInterface[]): void;
}
