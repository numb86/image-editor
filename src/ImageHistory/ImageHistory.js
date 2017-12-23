// @flow

export default class ImageHistory {
  constructor() {
    this.history = [];
    this.position = null;
  }
  history: string[];
  position: number | null;
  update(imageDataUrl: string) {
    if (this.position && this.position > 0) {
      this.history = this.history.filter(
        (e, index) => index >= ((this.position: any): number)
      );
    }
    this.history.unshift(imageDataUrl);
    this.position = 0;
  }
  get(): string | null {
    if (this.history.length === 0 || this.position === null) return null;
    return this.history[this.position];
  }
  back() {
    if (this.history.length === 0) return;
    if (this.position === this.history.length - 1) return;
    this.position = this.position + 1;
  }
  forward() {
    if (this.history.length === 0) return;
    if (this.position === 0 || !this.position) return;
    this.position = this.position - 1;
  }
}
