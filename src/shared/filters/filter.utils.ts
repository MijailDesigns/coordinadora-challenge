import {
  Like,
  Not,
  In,
  IsNull,
  MoreThan,
  LessThan,
  FindOperator,
} from 'typeorm';
import { FilterOperator } from './filter.dto';

export function getOperatorValue(
  operator: FilterOperator,
  value?: any,
): FindOperator<any> | any {
  switch (operator) {
    case FilterOperator.EQUAL:
      return value;
    case FilterOperator.NOT_EQUAL:
      return Not(value);
    case FilterOperator.MORE_THAN:
      return MoreThan(value);
    case FilterOperator.LESS_THAN:
      return LessThan(value);
    case FilterOperator.LIKE:
      return Like(`%${value}%`); // 🔥 FIX
    case FilterOperator.NOT_LIKE:
      return Not(Like(`%${value}%`)); // 🔥 FIX
    case FilterOperator.IN:
      return In(value);
    case FilterOperator.NOT_IN:
      return Not(In(value));
    case FilterOperator.IS_NULL:
      return IsNull();
    case FilterOperator.IS_NOT_NULL:
      return Not(IsNull());
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}
