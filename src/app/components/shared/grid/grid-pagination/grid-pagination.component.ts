import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PaginationModel } from '../../../../core/models/pagination.model';

@Component({
  selector: 'app-grid-pagination',
  standalone: true,
  imports: [],
  templateUrl: './grid-pagination.component.html',
  styleUrl: './grid-pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridPaginationComponent {
  model = input.required<PaginationModel>();

  onPageClick = output<number>();

  items = computed<{ name: string; isDisabled: boolean }[]>(() => this.transform(this.model()));

  action(value: string): void {
    const result = parseInt(value);
    if (result) {
      this.onPageClick.emit(result);
    }
  }

  private transform(model: PaginationModel): { name: string; isDisabled: boolean }[] {
    if (model.totalPages <= 7) {
      return this.smallPagination(model);
    } else if (model.currentPage < 4) {
      return this.beginPagination(model);
    } else if (model.currentPage > model.totalPages - 3) {
      return this.endPagination(model);
    } else {
      return this.middlePagination(model);
    }
  }

  private beginPagination(model: PaginationModel): { name: string; isDisabled: boolean }[] {
    const results: { name: string; isDisabled: boolean }[] = [];
    for (let index = 1; index <= 4; index++) {
      results.push({
        name: `${index}`,
        isDisabled: false,
      });
    }

    results.push({
      name: '...',
      isDisabled: true,
    });

    for (let index = model.totalPages - 1; index <= model.totalPages; index++) {
      results.push({
        name: `${index}`,
        isDisabled: false,
      });
    }

    return results;
  }

  private endPagination(model: PaginationModel): { name: string; isDisabled: boolean }[] {
    const results: { name: string; isDisabled: boolean }[] = [];
    for (let index = 1; index <= 2; index++) {
      results.push({
        name: `${index}`,
        isDisabled: false,
      });
    }

    results.push({
      name: '...',
      isDisabled: true,
    });

    for (let index = model.totalPages - 3; index <= model.totalPages; index++) {
      results.push({
        name: `${index}`,
        isDisabled: false,
      });
    }

    return results;
  }

  private middlePagination(model: PaginationModel): { name: string; isDisabled: boolean }[] {
    const results: { name: string; isDisabled: boolean }[] = [];

    results.push({
      name: '1',
      isDisabled: false,
    });

    results.push({
      name: '...',
      isDisabled: true,
    });

    for (let index = model.currentPage - 1; index <= model.currentPage + 1; index++) {
      results.push({
        name: `${index}`,
        isDisabled: false,
      });
    }

    results.push({
      name: '...',
      isDisabled: true,
    });

    results.push({
      name: `${model.totalPages}`,
      isDisabled: false,
    });

    return results;
  }

  private smallPagination(model: PaginationModel): { name: string; isDisabled: boolean }[] {
    const results: { name: string; isDisabled: boolean }[] = [];
    for (let index = 1; index <= model.totalPages; index++) {
      results.push({
        name: `${index}`,
        isDisabled: false,
      });
    }

    return results;
  }
}
