class queue {
  #queue;
  #stagingQueue;
  #maxThreads;
  #startfunction;
  constructor() {
    this.#queue = [];
    this.#stagingQueue = [];
    this.#maxThreads = 50;
    this.#startfunction = async () => {
      console.log(" no start function set");
    };
  }
  get maxThreads() {
    //-> int
    return this.#maxThreads;
  }
  set maxThreads(value /*int*/) {
    //-> void
    this.#maxThreads = value;
  }
  set startfunction(value /*function*/) {
    //-> void
    this.#startfunction = value;
  }
  add(func /*function*/) {
    //-> void
    this.#queue.length < this.#maxThreads
      ? this.#queue.push(func)
      : this.#stagingQueue.push(func);
  }
  startUnique() {
    //-> void
    this.#startfunction().then(() => {
      this.#cycle();
    });
  }
  start() {
    //-> void
    this.#cycle().catch((error) => {
      super.log(error);
    });
  }
  #cycle() {
    //- void
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
