class FileOutputBase {
  ref: string;
  url: string;
  fields: Record<string, string>;
}

class PreUploadFilesOutputDto {
  id: FileOutputBase[];
  propertyId: FileOutputBase[];
  evidenceOfDamagedProperty?: FileOutputBase[];
}

export { PreUploadFilesOutputDto, FileOutputBase };
