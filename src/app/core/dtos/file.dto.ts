export interface FileDto {
  id: string;
  name: string;
  size: string;
  type: string;
  file?: Blob;
}
