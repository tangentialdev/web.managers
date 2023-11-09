class xLocalStorage{
  #key; #obj;
  constructor(key, obj) {
    this.#key=key;
    this.#obj = obj;
    localStorage.add(this.#key, this.#obj);
  }
  get obj(){
    return localStorage.getItem(this.#key);
  }
  get keys(){
    
  }
  reset(){
    localStorage.add(this.#key, this.#obj);
  }
}