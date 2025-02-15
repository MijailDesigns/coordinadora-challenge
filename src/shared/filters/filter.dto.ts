export enum FilterOperator {
  LESS_THAN = 'lessThan',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  MORE_THAN = 'moreThan',
  MORE_THAN_OR_EQUAL = 'moreThanOrEqual',
  EQUAL = 'equal',
  NOT_EQUAL = 'notEqual',
  LIKE = 'like',
  ILIKE = 'ilike',
  NOT_LIKE = 'notLike',
  IN = 'in',
  NOT_IN = 'notIn',
  IS_NULL = 'isNull',
  IS_NOT_NULL = 'isNotNull',
}

export class FilterDto {
  field: string;
  operator: FilterOperator;
  value?: any;
}

export class FilterGroupDto {
  type?: 'AND' | 'OR';
  filters: (FilterDto | FilterGroupDto)[];
}
