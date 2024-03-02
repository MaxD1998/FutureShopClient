export interface TreeDto<TDto> {
  item: TDto;
  subItems: TreeDto<TDto>[];
}
