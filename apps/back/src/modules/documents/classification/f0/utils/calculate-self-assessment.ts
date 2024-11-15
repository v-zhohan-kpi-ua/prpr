import { F0CreateInputDto } from '../dto/create.input.dto';
import { roundResult } from './round-result';

export function calculateSelfAssessment(input: F0CreateInputDto) {
  const { physicalDamage, safety, livingConditions } =
    input.property.selfAssessment;

  const physicalDamageCoefficient = 0.6;
  const safetyCoefficient = 0.1;
  const livingConditionsCoefficient = 0.3;

  const physicalDamageScore =
    (Object.values(physicalDamage).reduce(
      (sum: number, value: number) => sum + value,
      0,
    ) /
      Object.keys(physicalDamage).length) *
    physicalDamageCoefficient;
  const physicalDamageHowItWasCalculated = `(((${Object.values(
    physicalDamage,
  ).join(
    ' + ',
  )}) / ${Object.keys(physicalDamage).length}) * ${physicalDamageCoefficient})`;

  const safetyScore =
    (Object.values(safety).reduce(
      (sum: number, value: boolean) => sum + (value ? 5 : 0),
      0,
    ) /
      Object.keys(safety).length) *
    safetyCoefficient;
  const safetyHowItWasCalculated = `(((${Object.values(safety)
    .map((value) => (value ? 5 : 0))
    .join(' + ')}) / ${Object.keys(safety).length}) * ${safetyCoefficient})`;

  const livingConditionsScore =
    (Object.values(livingConditions).reduce(
      (sum: number, value: number) => sum + value,
      0,
    ) /
      Object.keys(livingConditions).length) *
    livingConditionsCoefficient;
  const livingConditionsHowItWasCalculated = `(((${Object.values(
    livingConditions,
  ).join(
    ' + ',
  )}) / ${Object.keys(livingConditions).length}) * ${livingConditionsCoefficient})`;

  const result = physicalDamageScore + safetyScore + livingConditionsScore;
  const resultRounded = roundResult(result);
  const howItWasCalculated = `${physicalDamageHowItWasCalculated} + ${safetyHowItWasCalculated} + ${livingConditionsHowItWasCalculated}`;

  return {
    result,
    resultRounded,
    howItWasCalculated,
  };
}
