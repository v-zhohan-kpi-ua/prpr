import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  F0PropertiesFormPersonalContactPreferred,
  F0PropertiesFormPersonalTitle,
  F0PropertiesFormPropertyFutureOptions,
} from '@prpr/documents/properties';
import { Type } from 'class-transformer';
import { isValidLocationId } from 'src/common/validators/is-valid-location-id.validator';

class PersonalNamesI18n {
  @Matches(/^[А-ЩЬЮЯҐЄІЇа-щьюяґєії ]+$/, {
    message: 'uk should contain only Ukrainian letters',
  })
  @IsString()
  @IsNotEmpty()
  uk: string;

  @Matches(/^[A-Za-z ]+$/, {
    message: 'en should contain only English letters',
  })
  @IsString()
  @IsNotEmpty()
  en: string;
}

class PersonalContact {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsIn(F0PropertiesFormPersonalContactPreferred)
  @IsNotEmpty()
  preferred: (typeof F0PropertiesFormPersonalContactPreferred)[number];
}

class Personal {
  @IsString()
  @IsIn(F0PropertiesFormPersonalTitle)
  @IsNotEmpty()
  title: (typeof F0PropertiesFormPersonalTitle)[number];

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PersonalNamesI18n)
  surname: PersonalNamesI18n;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PersonalNamesI18n)
  givenName: PersonalNamesI18n;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  dob: Date;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PersonalContact)
  contact: PersonalContact;

  @IsString()
  @IsNotEmpty()
  addressForLegalCorrespondence: string;
}

class PropertySelfAssessmentPhysicalDamage {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  externalWalls: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  roof: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  windows: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  internalWalls: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  engineeringSystems: number;
}

class PropertySelfAssessmentSafety {
  @IsBoolean()
  @IsNotEmpty()
  explosives: boolean;

  @IsBoolean()
  @IsNotEmpty()
  debris: boolean;
}

class PropertySelfAssessmentLivingConditions {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  habitability: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  repairability: number;
}

class PropertySelfAssessment {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PropertySelfAssessmentPhysicalDamage)
  physicalDamage: PropertySelfAssessmentPhysicalDamage;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PropertySelfAssessmentSafety)
  safety: PropertySelfAssessmentSafety;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PropertySelfAssessmentLivingConditions)
  livingConditions: PropertySelfAssessmentLivingConditions;

  @IsString()
  @IsOptional()
  descriptionOfDamage?: string;
}

class Property {
  @Matches(/^UA.*/)
  @IsString()
  @isValidLocationId()
  @IsNotEmpty()
  residenceId: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  buildingNumber: number;

  @Min(1)
  @IsNumber()
  @IsOptional()
  apartmentNumber?: number;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PropertySelfAssessment)
  selfAssessment: PropertySelfAssessment;

  @IsIn(F0PropertiesFormPropertyFutureOptions, { each: true })
  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  future: (typeof F0PropertiesFormPropertyFutureOptions)[number][];
}

class Docs {
  @ArrayMaxSize(3)
  @Matches(/^temp\/documents\/f0.*/, { each: true })
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty()
  id: string[];

  @ArrayMaxSize(6)
  @Matches(/^temp\/documents\/f0.*/, { each: true })
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty()
  propertyId: string[];

  @ArrayMaxSize(6)
  @Matches(/^temp\/documents\/f0.*/, { each: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  evidenceOfDamagedProperty?: string[];
}

class F0CreateInputDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Personal)
  personal: Personal;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Property)
  property: Property;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Docs)
  docs: Docs;
}

export { F0CreateInputDto };
