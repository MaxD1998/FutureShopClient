import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthorizeDto } from '../../../../core/dtos/authorize.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly user$: BehaviorSubject<AuthorizeDto | undefined> = new BehaviorSubject<AuthorizeDto | undefined>(undefined);
}
