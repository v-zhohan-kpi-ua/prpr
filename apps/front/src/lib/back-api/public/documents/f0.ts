import { PersonalFormValues } from "@/app/[locale]/(registry)/apply/form/_components/steps/personal";
import { publicInstance } from "../public-axios";
import { PropertyFormValues } from "@/app/[locale]/(registry)/apply/form/_components/steps/property";
import { F0Document } from "@prpr/documents";
import { F0DocumentModifiedFromApi } from "@/types/api/f0";

type PreUploadFileTransform = {
  feedForApi: {
    ref: string;
    name: string;
    sizeInBytes: number;
    mimeType: string;
  };
  file: File;
};

type PreUploadFileResponse = {
  ref: string;
  url: string;
  fields: Record<string, string>;
};

const fileToPreUpload = (file: File) => {
  return {
    feedForApi: {
      ref: crypto.randomUUID(),
      name: file.name,
      sizeInBytes: file.size,
      mimeType: file.type,
    },
    file,
  } as PreUploadFileTransform;
};

function preUploadFiles(data: {
  id: File[];
  propertyId: File[];
  evidenceOfDamagedProperty?: File[];
}) {
  const docsPreUploadTransform = {
    id: data.id.map(fileToPreUpload),
    propertyId: data.propertyId.map(fileToPreUpload),
    evidenceOfDamagedProperty:
      data.evidenceOfDamagedProperty?.map(fileToPreUpload),
  };

  const docsPreUploadFeedForApi = {
    id: docsPreUploadTransform.id.map((x) => x.feedForApi),
    propertyId: docsPreUploadTransform.propertyId.map((x) => x.feedForApi),
    evidenceOfDamagedProperty:
      docsPreUploadTransform.evidenceOfDamagedProperty?.map(
        (x) => x.feedForApi
      ),
  };

  const req = publicInstance.post<{
    id: PreUploadFileResponse[];
    propertyId: PreUploadFileResponse[];
    evidenceOfDamagedProperty?: PreUploadFileResponse[];
  }>("/documents/f0/files/pre-upload", docsPreUploadFeedForApi);

  return { request: req, docsTransformedForPreUpload: docsPreUploadTransform };
}

function create(data: {
  personal: PersonalFormValues;
  property: PropertyFormValues;
  docs: {
    idKeys: string[];
    propertyIdKeys: string[];
    evidenceOfDamagedPropertyKeys?: string[];
  };
}) {
  const formForApi = {
    personal: {
      title: data.personal.title,
      surname: {
        uk: data.personal.surname.uk,
        en: data.personal.surname.en,
      },
      givenName: {
        uk: data.personal.givenName.uk,
        en: data.personal.givenName.en,
      },
      dob: data.personal.dob,
      contact: {
        phone: data.personal.contact.phone,
        email: data.personal.contact.email,
        preferred: data.personal.contact.preferableContactMethod,
      },
      addressForLegalCorrespondence:
        data.personal.addressForLegalCorrespondence,
    },
    property: {
      residenceId: data.property.residence.id,
      address: data.property.address,
      buildingNumber: data.property.buildingNumber,
      apartmentNumber: data.property.apartmentNumber,
      selfAssessment: {
        physicalDamage: {
          externalWalls:
            data.property.selfAssessment.physicalDamage.externalWalls,
          roof: data.property.selfAssessment.physicalDamage.roof,
          windows: data.property.selfAssessment.physicalDamage.windows,
          internalWalls:
            data.property.selfAssessment.physicalDamage.internalWalls,
          engineeringSystems:
            data.property.selfAssessment.physicalDamage.engineeringSystems,
        },
        safety: {
          explosives: data.property.selfAssessment.safety.explosives,
          debris: data.property.selfAssessment.safety.debris,
        },
        livingConditions: {
          habitability:
            data.property.selfAssessment.livingConditions.habitability,
          repairability:
            data.property.selfAssessment.livingConditions.repairability,
        },
        descriptionOfDamage: data.property.selfAssessment.descriptionOfDamage,
      },
      future: data.property.future,
    },
    docs: {
      id: data.docs.idKeys,
      propertyId: data.docs.propertyIdKeys,
      evidenceOfDamagedProperty: data.docs.evidenceOfDamagedPropertyKeys,
    },
  };

  return publicInstance.post<F0Document>("/documents/f0", formForApi);
}

function get({ year, id }: { year: number; id: string }) {
  type ReturnType = F0DocumentModifiedFromApi;

  return publicInstance.get<ReturnType>(`/documents/f0/${year}/${id}`);
}

export { preUploadFiles, create, get };
