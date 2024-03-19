import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryDto } from '../../../../core/dtos/category.dto';
import { IconType } from '../../../../core/enums/icon-type';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-menu-aside-card',
  standalone: true,
  templateUrl: './menu-aside-card.component.html',
  styleUrl: './menu-aside-card.component.css',
  imports: [IconComponent],
})
export class MenuAsideCardComponent {
  @Input() categories: CategoryDto[] | null = null;
  @Output() onItemClick: EventEmitter<string> = new EventEmitter<string>();

  IconType: typeof IconType = IconType;

  action(category: CategoryDto) {
    if (category.hasChildren) {
      this.onItemClick.emit(category.id);
    }
  }
}
