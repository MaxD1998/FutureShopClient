import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryDto } from '../../../../core/dtos/category.dto';
import { IconType } from '../../../../core/enums/icon-type';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-aside-card',
  standalone: true,
  templateUrl: './aside-card.component.html',
  styleUrl: './aside-card.component.css',
  imports: [IconComponent],
})
export class AsideCardComponent {
  @Input() categories: CategoryDto[] | null = null;
  @Output() onItemClick: EventEmitter<string> = new EventEmitter<string>();

  IconType: typeof IconType = IconType;

  action(category: CategoryDto) {
    if (category.hasChildren) {
      this.onItemClick.emit(category.id);
    }
  }
}
