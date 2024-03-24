class xLocalStorage {
  #key;
  #baseObj;
  #workingObj;
  constructor(key, obj) { //->xLocalStorage
    this.#key = key;
    this.#baseObj = JSON.stringify(obj);
    localStorage.setItem(this.#key, this.#baseObj);
  }
  get workingObj() { //-> JSON
    this.#refresh();
    return this.#workingObj;
  }
  get keys() { //-> array
    this.#refresh();
    return Object.keys(this.#workingObj);
  }
  reset() { //->void
    localStorage.setItem(this.#key, this.#obj);
  }
  push() { //->void
    localStorage.setItem(this.#key, JSON.stringify(this.#workingObj));
    this.#refresh();
  }
  #refresh() {
    this.#workingObj = JSON.parse(localStorage.getItem(this.#key));
  }
}

exports.xLocalStorage = xLocalStorage;