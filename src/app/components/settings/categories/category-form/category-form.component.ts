import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, forkJoin, map, switchMap, takeUntil } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class CategoryFormComponent extends BaseFormComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  IconType: typeof IconType = IconType;

  id?: string = undefined;
  isAddCategoryButtonDisabled = signal<boolean>(true);
  isAddTranslationButtonDisabled = signal<boolean>(true);
  isDialogActive = signal<boolean>(false);
  header = signal<string>('');
  laguageItems = signal<SelectItemModel[]>([]);
  parentItems = signal<SelectItemModel[]>([]);
  subCategories = signal<FormArray>(this.form.controls['subCategories'] as FormArray);
  subCategoryItems = signal<SelectItemModel[]>([]);
  translations = signal<FormArray>(this.form.controls['translations'] as FormArray);

  constructor() {
    super();
    this.id = this._activatedRoute.snapshot.params['id'];
    this.header.set(this.id ? 'category-form-component.edit-category' : 'category-form-component.create-category');
    const form = this._activatedRoute.snapshot.data['form'];
    this.subCategoryItems.set(form.subCategoryItems);
    this.parentItems.set(form.parentItems);
    this.fillForm(form.category);
    this.setValueChangeEvent();

    afterNextRender(() => {
      setTimeout(() => {
        const array = this.subCategories().value as string[];
        this.subCategoryItems.set(this.subCategoryItems().filter(x => !array.includes(x.id as string)));
        this.setAddCategoryButtonDisabled();
        this.setAddTranslationButtonDisabled();
        this.setLaguageItems();
        this._changeDetectorRef.detectChanges();
      }, 0);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  addLanguage(id: string): void {
    this.translations.update(x => {
      x.push(
        this._formBuilder.group({
          lang: [id, [Validators.required]],
          translation: [null, [Validators.required]],
        }),
      );
      return x;
    });
    this.setLaguageItems();
    this.setAddTranslationButtonDisabled();
  }

  addSubCategory(event: Event): void {
    event.preventDefault();
    this.subCategories.update(x => {
      x.push(new FormControl(null));
      return x;
    });
  }

  openDialogWindow(event: Event): void {
    event.preventDefault();
    this.isDialogActive.set(true);
  }

  removeTranslation(event: Event, index: number): void {
    event.preventDefault();
    this.translations.update(x => {
      x.removeAt(index);
      return x;
    });

    this.setLaguageItems();
    this.setAddTranslationButtonDisabled();
  }

  removeSubCategory(event: Event, index: number): void {
    event.preventDefault();
    this.subCategories.update(x => {
      x.removeAt(index);
      return x;
    });
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

    category.subCategoryIds.forEach(x =>
      this.subCategories.update(y => {
        y.push(new FormControl(x));
        return y;
      }),
    );

    category.translations.forEach(x =>
      this.translations.update(y => {
        y.push(
          this._formBuilder.group({
            lang: [x.lang, [Validators.required]],
            translation: [x.translation, [Validators.required]],
          }),
        );
        return y;
      }),
    );
  }

  private mapToSelectItemModel(source: CategoryDto): SelectItemModel {
    return {
      id: source.id,
      value: source.name,
    };
  }

  private setAddCategoryButtonDisabled(): void {
    const subCategoriesLength = (this.subCategories().value as (string | null)[]).filter(x => x == null).length;
    const result = this.subCategoryItems().length <= subCategoriesLength;
    this.isAddCategoryButtonDisabled.set(result);
  }

  private setAddTranslationButtonDisabled(): void {
    const result = environment.availableLangs.length == (this.translations().value as FormGroup[]).length;
    this.isAddTranslationButtonDisabled.set(result);
  }

  private setLaguageItems(): void {
    const array = (this.translations().controls as FormGroup[]).map(x => x.controls['lang'].value);
    const results = environment.availableLangs
      .filter(x => !array.includes(x))
      .map(x => {
        return {
          id: x,
          value: `common.languages.${x}`,
        };
      });

    this.laguageItems.set(results);
  }

  private setValueChangeEvent(): void {
    const subCategories = (this.subCategories().value as (string | null)[]).filter(x => x != null) as string[];
    this.form.controls['parentCategory'].valueChanges
      .pipe(
        takeUntil(this._unsubscribe),
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
          this.subCategoryItems.set(response.childItems);
          this.parentItems.set(response.parentItems);
          this.setAddCategoryButtonDisabled();
        },
      });

    this.subCategories()
      .valueChanges.pipe(
        takeUntil(this._unsubscribe),
        map((response: (string | null)[]) => response.filter(x => x != null) as string[]),
        switchMap(response => {
          this.subCategoryItems.set(this.subCategoryItems().filter(x => !response.includes(x.id as string)));
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
          this.subCategoryItems.set(response.childItems);
          this.parentItems.set(response.parentItems);
          this.setAddCategoryButtonDisabled();
        },
      });
  }
}
