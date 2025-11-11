import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleComponent } from '../../../../../../../components/shared/toggle/toggle.component';
import { PermissionListModel } from '../../../../../core/models/permission-list.model';

@Component({
  selector: 'app-permission-group-section',
  imports: [TranslateModule, ToggleComponent],
  templateUrl: './permission-group-section.component.html',
  styleUrl: './permission-group-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionGroupSectionComponent {
  header = input.required<string>();
  permissionList = input.required<PermissionListModel[]>();
}
