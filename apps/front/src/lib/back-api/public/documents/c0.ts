import { C0Document } from "@prpr/documents";
import { publicInstance } from "../public-axios";
import { F0PropertiesModifiedFromApi } from "@/types/api/f0";

function get({ year, id }: { year: number; id: string }) {
  type ReturnType = Omit<C0Document, "properties"> & {
    properties: Omit<C0Document["properties"], "f0Form"> & {
      f0Form: F0PropertiesModifiedFromApi['form'];
    };
  };

  return publicInstance.get<ReturnType>(`/documents/c0/${year}/${id}`);
}

export { get };
