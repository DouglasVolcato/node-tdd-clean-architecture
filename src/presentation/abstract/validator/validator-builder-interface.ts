import { ValidatorInterface } from "./validator-interface";

export interface ValidatorBuilderInterface extends ValidatorInterface {
  of(fieldName: string): ValidatorBuilderInterface;
  isRequired(): ValidatorBuilderInterface;
  isEmail(): ValidatorBuilderInterface;
}
