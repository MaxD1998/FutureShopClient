import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../../environments/environment';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { ButtonLayout } from '../../../../../../core/enums/button-layout';
import { IconType } from '../../../../../../core/enums/icon-type';
import { TableHeaderFloat } from '../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { SelectItemModel } from '../../../../../../core/models/select-item.model';
import { CategoryDataService } from '../../../../core/data-services/category.data-service';
import { CategoryFormDto } from '../../../../core/dtos/category.form-dto';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputComponent,
    ButtonComponent,
    InputSelectComponent,
    ReactiveFormsModule,
    TranslateModule,
    TableComponent,
  ],
})
export class CategoryFormComponent extends BaseFormComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _resolverData = this._activatedRoute.snapshot.data['form'];
  private readonly _router = inject(Router);

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  IconType: typeof IconType = IconType;

  category = this._resolverData['category'] as CategoryFormDto;
  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.category-form-component.table-columns.name',
      template: TableTemplate.text,
    },
  ];
  parentCategoryItems = this._resolverData['parentCategoryItems'] as SelectItemModel[];
  subCategories = this.category.subCategories;
  translations = this.form.controls['translations'] as FormArray;

  constructor() {
    super();

    const controls = this.form.controls;
    controls['name'].setValue(this.category.name);
    controls['parentCategoryId'].setValue(this.category.parentCategoryId);

    environment.availableLangs.forEach(x => {
      const translation = this.category.translations.find(y => y.lang == x);
      this.translations.push(
        this._formBuilder.group({
          id: [translation?.id],
          lang: [x, [Validators.required]],
          translation: [translation?.translation],
        }),
      );
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as CategoryFormDto;
    value.translations = value.translations.filter(x => x.translation);

    this._categoryDataService.update(this._activatedRoute.snapshot.params['id'], value).subscribe({
      next: () =>
        this._router.navigateByUrl(
          `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.category}/${ClientRoute.list}`,
        ),
    });
  }

  protected override setFormControls(): {} {
    return {
      name: [null, [Validators.required]],
      parentCategoryId: [null],
      subCategories: new FormArray([]),
      translations: new FormArray([]),
    };
  }
}
