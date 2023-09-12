class xQueueLog {
  #oName;
  #frame;
  #loggingEnabled;
  constructor(oName /*string*/) {
    this.#oName = oName;
    this.#loggingEnabled = configuration.QUEUE_LOGGING_ENABLED;
    this.#frame = document.createElement('div');
    this.#frame.innerHTML = '<div class=\"card-header\">'+
                                    '<div class=\"d-flex justify-content-between\">'+
                                    '</div>'
                                "</div>" +
                                '<div class=\"card-body\">'+
                                    '<ul class=\"list-group\">' +
                                        '<li class=\"list-group-item\">' +
                                        '</li>' +
                                    '</ul>' +
                                '</div>';
    (this.#loggingEnabled) ? document.getElementById(configuration.ERROR_LOG_DOCUMENT_ID).appendChild(this.#frame): '';
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
  #stage;
  #maxThreads;
  #startfunction;
  constructor(oName = "xQueue" /*string*/) {
    super(oName);
    this.#oName = oName;
    this.#queue = [];
    this.#stage = [];
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
      : this.#stage.push(func);
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
      i < Math.min(this.#maxThreads, this.#stage.length);
      i++
    ) {
      this.#queue.push(this.#stage.unshift());
      let p = this.#queue[i]().then(() => {
        this.#queue.indexof(p).remove();
        this.#queue.length > 0 || this.#stage.length > 0
          ? this.#cycle()
          : "";
      });
    }
  }
}
