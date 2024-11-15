import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getById } from '@prpr/locations';

@ValidatorConstraint({
  name: 'isValidLocationId',
})
export class IsValidLocationIdConstraint
  implements ValidatorConstraintInterface
{
  validate(id: string) {
    const res = getById(id) || null;

    return res ? true : false;
  }

  defaultMessage(): string {
    return '$property with this location id is not valid';
  }
}

export function isValidLocationId(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidLocationIdConstraint,
    });
  };
}
