class queue {
  #queue;
  #stagingQueue;
  #maxThreads;
  #startfunction;
  constructor() {
    this.#queue = [];
    this.#stagingQueue = [];
    this.#maxThreads = 50;
  }
  get maxThreads() {
    //-> int
    return this.#maxThreads;
  }
  set maxThreads(value) {
    this.#maxThreads = value;
  }
  set startfunction(value){
    this.#startfunction = value;
  }
  add(func /*function*/) {
    //-> void
    this.#queue.length < this.#maxThreads
      ? this.#queue.push(func)
      : this.#stagingQueue.push(func);
  }
  startUnique() {
    this.#queue[0]().then(() => {
      this.#queue.unshift();
      this.#cycle();
    });
  }
  start() {
    this.#cycle().catch((error) => {
      super.log(error);
    });
  }
  #cycle() {
    for (
      i = this.#queue.length - 1;
      i < Math.min(this.#maxThreads, this.#stagingQueue.length);
      i++
    ) {
      this.#queue.push(this.#stagingQueue.unshift());
      let p = this.#queue[i]().then(() => {
        this.#queue.indexof(p).remove();
        this.#queue.length > 0 || this.#stagingQueque.length > 0
          ? this.#cycle()
          : "";
      });
    }
  }
}
