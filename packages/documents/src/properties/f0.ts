interface F0Properties {
  form: F0PropertiesForm;
  status: F0PropertiesStatus;
}

enum F0PropertiesStatus {
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
}

interface F0PropertiesForm {
  personal: F0PropertiesFormPersonal;
  property: F0PropertiesFormProperty;
  docs: F0PropertiesFormDocs;
}

interface F0PropertiesFormPersonal {
  title: (typeof F0PropertiesFormPersonalTitle)[number];
  surname: {
    uk: string;
    en: string;
  };
  givenName: {
    uk: string;
    en: string;
  };
  dob: Date;
  contact: {
    phone: string;
    email: string;
    preferred: (typeof F0PropertiesFormPersonalContactPreferred)[number];
  };
  addressForLegalCorrespondence: string;
}

const F0PropertiesFormPersonalTitle = ["mr", "ms", "none"] as const;
const F0PropertiesFormPersonalContactPreferred = ["phone", "email"] as const;

interface F0PropertiesFormProperty {
  residenceId: string;
  address: string;
  buildingNumber: number;
  apartmentNumber?: number;
  selfAssessment: {
    scores: {
      physicalDamage: {
        externalWalls: number;
        roof: number;
        windows: number;
        internalWalls: number;
        engineeringSystems: number;
      };
      safety: {
        explosives: boolean;
        debris: boolean;
      };
      livingConditions: {
        habitability: number;
        repairability: number;
      };
    };
    formula: {
      result: number;
      resultRounded: number;
      howItWasCalculated: string;
    };
    descriptionOfDamage?: string;
  };
  future: (typeof F0PropertiesFormPropertyFutureOptions)[number][];
}

const F0PropertiesFormPropertyFutureOptions = [
  "going-to-restore-living-here",
  "going-to-restore-will-be-living-here",
  "going-to-live-in-other-place-same-region",
  "going-to-live-in-other-region",
  "going-to-live-in-other-country",
  "going-to-transfer-property",
  "dont-know",
] as const;

interface F0PropertiesFormDocs {
  id: {
    key: string;
    description?: string;
  }[];
  propertyId: {
    key: string;
    description?: string;
  }[];
  evidenceOfDamagedProperty?: {
    key: string;
    description?: string;
  }[];
}

export {
  F0Properties,
  F0PropertiesStatus,
  F0PropertiesForm,
  F0PropertiesFormPersonal,
  F0PropertiesFormPersonalTitle,
  F0PropertiesFormPersonalContactPreferred,
  F0PropertiesFormProperty,
  F0PropertiesFormPropertyFutureOptions,
  F0PropertiesFormDocs,
};
