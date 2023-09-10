class xQueueLog {
  #oName;
  #framework;
  constructor(oName /*string*/) {
    this.#name = oName;
    this.#loggingEnabled = false;
    this.#framework = document.createElement('div');
    this.#framework.innerHTML = '<div class=\"card-header\">'+
                                    '<div class=\"d-flex justify-content-between\">'+
                                    '</div>'
                                "</div>" +
                                '<div class=\"card-body\">'+
                                    '<ul class=\"list-group\">' +
                                        '<li class=\"list-group-item\">' +
                                        '</li>' +
                                    '</ul>' +
                                '</div>';
    (this.#loggingEnabled) ? console.log(this.#framework): '';
  }
  get name(){ //-> string
    return this.#oName;
  }
  log(msg /*string || JSON*/){
    
  }
}

class xQueue extends xQueueLog {
  #oName;
  #queue;
  #stagingQueue;
  #maxThreads;
  #startfunction;
  constructor(oName = "xQueue" /*string*/) {
    super(oName);
    this.#oName = oName;
    this.#queue = [];
    this.#stagingQueue = [];
    this.#maxThreads = 50;
    this.#startfunction = async () => {
      console.log(" no start function set");
    };
  }
  get name(){ //-> string
    return this.#oName;
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
