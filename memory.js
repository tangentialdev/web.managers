class xLocalStorage {
  #key;
  #baseObj;
  #workingObj;
  constructor(key, obj) {
    this.#key = key;
    this.#obj = JSON.stringify(obj);
    localStorage.setItem(this.#key, this.#obj);
  }
  get workingObj() {
    this.#refresh();
    return this.#workingObj;
  }
  get keys() {
    this.#refresh();
    return Object.keys
  }
  reset() {
    localStorage.setItem(this.#key, this.#obj);
  }
  #refresh(){
    this.#workingObj=JSON.parse(localStorage.getItem(this.#key));
  }
  
}
