import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserAsideComponent } from './user-aside/user-aside.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule, UserAsideComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {}
