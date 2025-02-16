import { ChangeDetectionStrategy, Component, inject, Injector, input, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { ButtonComponent } from '../../../../../components/shared/button/button.component';
import { InputComponent } from '../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';

@Component({
  selector: 'app-add-purchase-list',
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent],
  templateUrl: './add-purchase-list.component.html',
  styleUrl: './add-purchase-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPurchaseListComponent extends BaseFormComponent {
  private readonly _injector = inject(Injector);

  isDialogActive = input.required<boolean>();

  onSubmit = output<string>();

  constructor() {
    super();

    toObservable(this.isDialogActive, { injector: this._injector }).pipe(
      tap(value => {
        if (!value) {
          this.form.reset();
        }
      }),
    );
  }

  submit(): void {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.controls['name'].value);
    }
  }

  protected override setFormControls(): {} {
    return {
      name: [null, Validators.required],
    };
  }
}
