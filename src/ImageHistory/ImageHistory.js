// @flow

type ImageHistoryElem = {
  originalData: string,
  editedData: string,
};

export default class ImageHistory {
  constructor() {
    this.history = [];
    this.position = null;
  }
  history: ImageHistoryElem[];
  position: number | null;
  update(updateData: ImageHistoryElem) {
    if (this.position && this.position > 0) {
      this.history = this.history.filter(
        (e, index) => index >= ((this.position: any): number)
      );
    }
    this.history.unshift(updateData);
    this.position = 0;
  }
  get(): ImageHistoryElem | null {
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
    if (!this.position) return;
    this.position = this.position - 1;
  }
}
