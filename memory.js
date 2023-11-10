class xLocalStorage {
  #key;
  #baseObj;
  #workingObj;
  constructor(key, obj) {
    this.#key = key;
    this.#baseObj = JSON.stringify(obj);
    localStorage.setItem(this.#key, this.#baseObj);
  }
  get workingObj() {
    this.#refresh();
    return this.#workingObj;
  }
  get keys() {
    this.#refresh();
    return Object.keys(this.#workingObj);
  }
  reset() {
    localStorage.setItem(this.#key, this.#obj);
  }
  push() {
    localStorage.setItem(this.#key, JSON.stringify(this.#workingObj));
    this.#refresh();
  }
  #refresh() {
    this.#workingObj = JSON.parse(localStorage.getItem(this.#key));
  }
}
