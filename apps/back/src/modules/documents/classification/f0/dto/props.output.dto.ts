import { Injectable } from '@nestjs/common';
import { F0Properties } from '@prpr/documents/properties';
import { getById, getFullName } from '@prpr/locations';
import { S3Service } from 'src/modules/s3/s3.service';

@Injectable()
export class F0PropertiesOutputDto {
  constructor(private readonly s3: S3Service) {}

  toDto(
    entity: F0Properties,
    context?: {
      howToFormat: ('for-inside-cluster' | 'owner' | 'with-docs-urls')[];
    },
  ) {
    const howToFormat = context?.howToFormat || [];

    const { form } = entity;

    // personal
    const formPersonal = {
      title: '***',
      surname: {
        en: '***',
        uk: '***',
      },
      givenName: {
        en: '***',
        uk: '***',
      },
      dob: undefined as Date | undefined,
      contact: {
        phone: '***',
        email: '***',
        preferred: form.personal.contact.preferred,
      },
      addressForLegalCorrespondence: '***',
    };

    if (
      howToFormat.includes('for-inside-cluster') ||
      howToFormat.includes('owner')
    ) {
      formPersonal.title = form.personal.title;
      formPersonal.surname = form.personal.surname;
      formPersonal.givenName = form.personal.givenName;
      formPersonal.contact = form.personal.contact;
      formPersonal.addressForLegalCorrespondence =
        form.personal.addressForLegalCorrespondence;
      formPersonal.dob = form.personal.dob;
    }

    const residenceLocationName = getFullName(
      getById(form.property.residenceId)!,
    );

    // property
    const formProperty = {
      residence: {
        id: form.property.residenceId,
        name: residenceLocationName,
      },
      address: '***',
      buildingNumber: '***' as string | number,
      apartmentNumber: '***' as string | number | undefined,
      selfAssessment: {
        scores: {
          physicalDamage: {
            externalWalls:
              form.property.selfAssessment.scores.physicalDamage.externalWalls,
            roof: form.property.selfAssessment.scores.physicalDamage.roof,
            windows: form.property.selfAssessment.scores.physicalDamage.windows,
            internalWalls:
              form.property.selfAssessment.scores.physicalDamage.internalWalls,
            engineeringSystems:
              form.property.selfAssessment.scores.physicalDamage
                .engineeringSystems,
          },
          safety: {
            explosives: form.property.selfAssessment.scores.safety.explosives,
            debris: form.property.selfAssessment.scores.safety.debris,
          },
          livingConditions: {
            habitability:
              form.property.selfAssessment.scores.livingConditions.habitability,
            repairability:
              form.property.selfAssessment.scores.livingConditions
                .repairability,
          },
        },
        formula: {
          result: form.property.selfAssessment.formula.result,
          howItWasCalculated:
            form.property.selfAssessment.formula.howItWasCalculated,
        },
        descriptionOfDamage: '***' as string | undefined,
      },
      future: form.property.future,
    };

    if (
      howToFormat.includes('for-inside-cluster') ||
      howToFormat.includes('owner')
    ) {
      formProperty.address = form.property.address;
      formProperty.buildingNumber = form.property.buildingNumber;
      formProperty.apartmentNumber = form.property.apartmentNumber;
      formProperty.selfAssessment.descriptionOfDamage =
        form.property.selfAssessment.descriptionOfDamage;
    }

    // docs
    const formDocs = {
      id: form.docs.id.map(
        (doc) =>
          ({
            key: doc.key,
            description: '***',
          }) as {
            key: string;
            description?: string;
            url?: string;
          },
      ),

      propertyId: form.docs.propertyId.map(
        (doc) =>
          ({
            key: doc.key,
            description: '***',
          }) as {
            key: string;
            description?: string;
            url?: string;
          },
      ),

      evidenceOfDamagedProperty: form.docs.evidenceOfDamagedProperty
        ? form.docs.evidenceOfDamagedProperty.map(
            (doc) =>
              ({
                key: doc.key,
                description: '***',
              }) as {
                key: string;
                description?: string;
                url?: string;
              },
          )
        : form.docs.evidenceOfDamagedProperty,
    };

    if (howToFormat.includes('with-docs-urls')) {
      formDocs.id = formDocs.id.map((doc) => ({
        ...doc,
        url: this.s3.getCloudfrontSignedUrl({
          key: doc.key,
        }),
      }));

      formDocs.propertyId = formDocs.propertyId.map((doc) => ({
        ...doc,
        url: this.s3.getCloudfrontSignedUrl({
          key: doc.key,
        }),
      }));

      formDocs.evidenceOfDamagedProperty = formDocs.evidenceOfDamagedProperty
        ? formDocs.evidenceOfDamagedProperty.map((doc) => ({
            ...doc,
            url: this.s3.getCloudfrontSignedUrl({
              key: doc.key,
            }),
          }))
        : formDocs.evidenceOfDamagedProperty;
    }

    if (
      howToFormat.includes('owner') ||
      howToFormat.includes('for-inside-cluster')
    ) {
      formDocs.id = formDocs.id.map((doc) => ({
        ...doc,
        description: form.docs.id.find((d) => d.key === doc.key)?.description,
      }));

      formDocs.propertyId = formDocs.propertyId.map((doc) => ({
        ...doc,
        description: form.docs.propertyId.find((d) => d.key === doc.key)
          ?.description,
      }));

      formDocs.evidenceOfDamagedProperty = formDocs.evidenceOfDamagedProperty
        ? formDocs.evidenceOfDamagedProperty.map((doc) => ({
            ...doc,
            description: form.docs?.evidenceOfDamagedProperty?.find(
              (d) => d.key === doc.key,
            )?.description,
          }))
        : formDocs.evidenceOfDamagedProperty;
    }

    // result
    return {
      status: entity.status,
      form: {
        personal: formPersonal,
        property: formProperty,
        docs: formDocs,
      },
    };
  }
}
