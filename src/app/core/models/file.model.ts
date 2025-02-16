export interface FileModel {
  id: string;
  name: string;
  size: string;
  type: string;
  file?: Blob;
}
