class Foo {
  private propA: string;
  protected propB: string;
  public propC?: string;
  propD?: string;

  private _propE?: string;

  get propE(): string | undefined {
    return this._propE;
  }

  set propE(value: string | undefined) {
    this._propE = value;
  }

  constructor() {
    this.propA = 'lorem';
    this.propB = 'ispum';
  }

  methodA(): void {}
}
