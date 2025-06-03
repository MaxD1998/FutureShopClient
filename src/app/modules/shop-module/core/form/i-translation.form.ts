import { FormControl } from '@angular/forms';

export interface ITranslationForm {
  id: FormControl<string | null>;
  lang: FormControl<string>;
  translation: FormControl<string | null>;
}
