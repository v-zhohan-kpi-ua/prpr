import { F0Document } from "@prpr/documents";
import {
  F0PropertiesFormDocs,
  F0PropertiesFormProperty,
} from "@prpr/documents/properties";
import { ValuesType } from "utility-types";

export type F0DocumentModifiedFromApi = Omit<F0Document, "properties"> & {
  properties: F0PropertiesModifiedFromApi;
};

export type F0PropertiesModifiedFromApi = Omit<
  F0Document["properties"],
  "form"
> & {
  form: Omit<F0Document["properties"]["form"], "property" | "docs"> & {
    property: Omit<F0PropertiesFormProperty, "residenceId"> & {
      residence: { id: string; name: { uk: string; en: string } };
    };
    docs: {
      id: (ValuesType<F0PropertiesFormDocs["id"]> & { url?: string })[];
      propertyId: (ValuesType<F0PropertiesFormDocs["propertyId"]> & {
        url?: string;
      })[];
      evidenceOfDamagedProperty?: (ValuesType<
        Required<F0PropertiesFormDocs>["evidenceOfDamagedProperty"]
      > & { url?: string })[];
    };
  };
};
