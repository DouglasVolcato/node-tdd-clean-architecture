import { ValidatorInterface } from "./validator-interface";

export interface ValidatorBuilderInterface extends ValidatorInterface {
  isRequired(fieldName: string): ValidatorBuilderInterface;
  isEmail(fieldName: string): ValidatorBuilderInterface;
}
