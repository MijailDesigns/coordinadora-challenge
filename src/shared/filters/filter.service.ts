import { FindOptionsWhere } from 'typeorm';
import { FilterGroupDto, FilterDto } from './filter.dto';
import { getOperatorValue } from './filter.utils';

export class FilterService<T> {
  parseFilters(filterGroups: FilterGroupDto[]): FindOptionsWhere<T> {
    return filterGroups.reduce((where: FindOptionsWhere<T>, group) => {
      const conditions = group.filters
        .map((filter) => this.transformFilter(filter))
        .filter(
          (condition): condition is FindOptionsWhere<T> => condition !== null,
        );

      if (conditions.length === 0) return where;

      const combinedCondition =
        group.type === 'AND'
          ? Object.assign({}, ...conditions)
          : conditions.length > 1
            ? {
                where: conditions.map((cond) => ({ ...cond })),
              }
            : conditions[0];

      return { ...where, ...combinedCondition };
    }, {} as FindOptionsWhere<T>);
  }

  private transformFilter(
    filter: FilterDto | FilterGroupDto,
  ): FindOptionsWhere<T> | null {
    if ('filters' in filter) return this.parseFilters([filter]);
    if (!filter.field) return null;

    return {
      [filter.field]: getOperatorValue(filter.operator, filter.value),
    } as FindOptionsWhere<T>;
  }
}
