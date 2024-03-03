import { Observable, Subject } from 'rxjs';

const langChange: Subject<void> = new Subject<void>();

export function LangNext(): void {
  langChange.next();
}

export function onLangChange(): Observable<void> {
  return langChange.asObservable();
}
