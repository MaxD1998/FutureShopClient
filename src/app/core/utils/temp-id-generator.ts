export class TempIdGenerator {
  private _assignedIdCount = 0;

  assingId(): string {
    const result = `temp_${this._assignedIdCount}`;
    this._assignedIdCount++;
    return result;
  }
}
