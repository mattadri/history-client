export class Sleep {
  static wait(ms): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
