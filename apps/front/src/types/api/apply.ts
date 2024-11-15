export type CreateCase = {
  personal: {
    firstName: {
      ukr: string;
      eng: string;
    };
    lastName: {
      ukr: string;
      eng: string;
    };
    middleName?: {
      ukr: string;
      eng: string;
    };
    idDocument: {
      type: number;
      number: string;
      issuedBy: string;
      issueDate: Date;
      expirationDate?: Date;
      files: string[];
    };
    dob: Date;
    contact: {
      phone: string;
      email: string;
    };
    additionalCitizenshipCountry?: number;
    addressForCorrespondence?: string;
  };
  damagedProperty: {
    location: {
      region: number;
      district: number;
      city: number;
      street: string | number;
      house: number;
      apartment?: number;
    };
    whenApproximately: Date;
    doesItHasMultipleOwners: boolean;
  };
};
