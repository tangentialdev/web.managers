class xLocalStorage{
  #key; #obj;
  constructor(key, obj) {
    this.#key=key;
    this.#obj = obj;
    localStorage.setItem(this.#key, this.#obj);
  }
  get obj(){
    return localStorage.getItem(this.#key);
  }
  get keys(){
    
  }
  reset(){
    localStorage.setItem(this.#key, this.#obj);
  }
}