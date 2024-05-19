import { ChangeDetectorRef, Component, afterRender, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin, map, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BaseFormComponent } from '../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { CategoryDataService } from '../../../../core/data-services/category.data-service';
import { CategoryFormDto } from '../../../../core/dtos/category-form.dto';
import { CategoryDto } from '../../../../core/dtos/category.dto';
import { ButtonLayout } from '../../../../core/enums/button-layout';
import { IconType } from '../../../../core/enums/icon-type';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { InputSelectComponent } from '../../../shared/input-select/input-select.component';
import { InputComponent } from '../../../shared/input/input.component';
import { DialogWindowComponent } from '../../../shared/modals/dialog-window/dialog-window.component';
import { CategoryFormDialogWindowContentComponent } from './category-form-dialog-window-content/category-form-dialog-window-content.component';

@Component({
  selector: 'app-category-form',
  standalone: true,
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
  imports: [
    InputComponent,
    ButtonComponent,
    InputSelectComponent,
    IconComponent,
    DialogWindowComponent,
    CategoryFormDialogWindowContentComponent,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class CategoryFormComponent extends BaseFormComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);
  private readonly _router = inject(Router);
  private readonly _translateService = inject(TranslateService);

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  IconType: typeof IconType = IconType;

  id?: string;
  isDialogActive: boolean = false;
  parentItems: SelectItemModel[] = [];
  subCategoryItems: SelectItemModel[] = [];

  constructor() {
    super();
    this.id = this._activatedRoute.snapshot.params['id'];
    const form = this._activatedRoute.snapshot.data['form'];
    this.subCategoryItems = form.subCategoryItems;
    this.parentItems = form.parentItems;
    this.fillForm(form.category);
    this.setValueChangeEvent();
    afterRender(() => {
      setTimeout(() => {
        const array = this.subCategories.value as string[];
        this.subCategoryItems = this.subCategoryItems.filter(x => !array.includes(x.id as string));
        this._changeDetectorRef.detectChanges();
      }, 0);
    });
  }

  get header(): string {
    return this.id
      ? this._translateService.instant('category-form-component.edit-category')
      : this._translateService.instant('category-form-component.create-category');
  }

  get isAddCategoryButtonDisabled(): boolean {
    const subCategoriesLength = (this.subCategories.value as (string | null)[]).filter(x => x == null).length;
    const result = this.subCategoryItems.length <= subCategoriesLength;
    return result;
  }

  get isAddTranslationButtonDisabled(): boolean {
    return environment.availableLangs.length == (this.translations.value as FormGroup[]).length;
  }

  get laguageItems(): SelectItemModel[] {
    const array = (this.translations.controls as FormGroup[]).map(x => x.controls['lang'].value);
    const results = environment.availableLangs
      .filter(x => !array.includes(x))
      .map(x => {
        return {
          id: x,
          value: this._translateService.instant(`common.languages.${x}`),
        };
      });

    return results;
  }

  get subCategories(): FormArray {
    return this.form.controls['subCategories'] as FormArray;
  }

  get translations(): FormArray {
    return this.form.controls['translations'] as FormArray;
  }

  addLanguage(id: string): void {
    this.translations.push(
      this._formBuilder.group({
        lang: [id, [Validators.required]],
        translation: [null, [Validators.required]],
      }),
    );
  }

  addSubCategory(event: Event): void {
    event.preventDefault();
    this.subCategories.push(new FormControl(null));
  }

  openDialogWindow(event: Event): void {
    event.preventDefault();
    this.isDialogActive = true;
  }

  removeTranslation(event: Event, index: number): void {
    event.preventDefault();
    this.translations.removeAt(index);
  }

  removeSubCategory(event: Event, index: number): void {
    event.preventDefault();
    this.subCategories.removeAt(index);
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const form = this.form.controls;

    if (!this.id) {
      this._categoryDataService
        .add({
          name: form['name'].value,
          parentCategoryId: form['parentCategory'].value,
          subCategoryIds: form['subCategories'].value,
          translations: form['translations'].value,
        })
        .subscribe({
          next: () =>
            this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.categories}/${ClientRoute.list}`),
        });
    } else {
      console.log(form['translations'].value);
      this._categoryDataService
        .update(this.id, {
          name: form['name'].value,
          parentCategoryId: form['parentCategory'].value,
          subCategoryIds: form['subCategories'].value,
          translations: form['translations'].value,
        })
        .subscribe({
          next: () =>
            this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.categories}/${ClientRoute.list}`),
        });
    }
  }

  protected override setFormControls(): {} {
    return {
      name: [null, [Validators.required]],
      parentCategory: [null],
      subCategories: new FormArray([]),
      translations: new FormArray([]),
    };
  }

  private fillForm(category?: CategoryFormDto): void {
    if (!category) {
      return;
    }

    this.form.controls['name'].setValue(category.name);
    this.form.controls['parentCategory'].setValue(category.parentCategoryId);

    category.subCategoryIds.forEach(x => this.subCategories.push(new FormControl(x)));
    category.translations.forEach(x =>
      this.translations.push(
        this._formBuilder.group({
          lang: [x.lang, [Validators.required]],
          translation: [x.translation, [Validators.required]],
        }),
      ),
    );
  }

  private mapToSelectItemModel(source: CategoryDto): SelectItemModel {
    return {
      id: source.id,
      value: source.name,
    };
  }

  private setValueChangeEvent(): void {
    const subCategories = (this.subCategories.value as (string | null)[]).filter(x => x != null) as string[];
    this.form.controls['parentCategory'].valueChanges
      .pipe(
        switchMap(response => {
          return forkJoin({
            childItems: this._categoryDataService.getsAvailableToBeChild(subCategories, response, this.id),
            parentItems: this._categoryDataService.getsAvailableToBeParent(subCategories, this.id),
          }).pipe(
            map(response => {
              return {
                childItems: response.childItems.map(x => this.mapToSelectItemModel(x)),
                parentItems: response.parentItems.map(x => this.mapToSelectItemModel(x)),
              };
            }),
          );
        }),
      )
      .subscribe({
        next: response => {
          this.subCategoryItems = response.childItems;
          this.parentItems = response.parentItems;
        },
      });

    this.subCategories.valueChanges
      .pipe(
        map((response: (string | null)[]) => response.filter(x => x != null) as string[]),
        switchMap(response => {
          this.subCategoryItems = this.subCategoryItems.filter(x => !response.includes(x.id as string));
          return forkJoin({
            childItems: this._categoryDataService.getsAvailableToBeChild(
              response,
              this.form.controls['parentCategory'].value,
              this.id,
            ),
            parentItems: this._categoryDataService.getsAvailableToBeParent(response, this.id),
          }).pipe(
            map(response => {
              return {
                childItems: response.childItems.map(x => this.mapToSelectItemModel(x)),
                parentItems: response.parentItems.map(x => this.mapToSelectItemModel(x)),
              };
            }),
          );
        }),
      )
      .subscribe({
        next: response => {
          this.subCategoryItems = response.childItems;
          this.parentItems = response.parentItems;
        },
      });
  }
}
