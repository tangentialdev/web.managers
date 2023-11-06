class xQueueLog {
  #oName; #frame; #loggingEnabled; #log;
  constructor(oName /*string*/) {
    this.#log = [];
    this.#oName = oName;
    this.#loggingEnabled = configuration.QUEUE_LOGGING_ENABLED;
    this.#frame = document.createElement("div");
    this.#frame.innerHTML =
      '<div class="accordion-item">' +
      '<div class="accordion-header">' +
      '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#' +
      this.#oName +
      '">' +
      '<div class="row"  style="font-size:12px">' +
      '<div class="col log-length">' +
      this.#log.length +
      "</div>" +
      '<div class="col source">' +
      this.#oName +
      "</div>" +
      '<div class="col id">' +
      this.#oName +
      "</div>" +
      "</div>" +
      "</button>" +
      "</div>" +
      '<div id="' +
      this.#oName +
      '" class="accordion-collapse collapse" data-bs-parent="#' +
      configuration.ERROR_LOG_DOCUMENT_ID +
      '">' +
      '<div class="accordion-body">' +
      '<table class="table table-striped" style="font-size:10px">' +
      "<thead>" +
      "<tr>" +
      '<th style="display:none;"> Time</th>' +
      "<th> Trace </th>" +
      "<th> Message </th>" +
      "</tr>" +
      "</thead>" +
      '<tbody class="error-table-body">' +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "</div>" +
      "</div>";
    this.#loggingEnabled
      ? document
          .getElementById(configuration.ERROR_LOG_DOCUMENT_ID)
          .appendChild(this.#frame)
      : "";
      console.log(this.#loggingEnabled);
  }
  get toJSON() {
    return JSON.stringify(this.#log, undefined, 2);
  }
  get frame() {
    //-> htmlElement
    return this.#frame;
  }
  get loggingEnabled() {
    //-> boolean
    return this.#loggingEnabled;
  }
  set loggingEnabled(value /*boolean*/) {
    //-> void
    this.#loggingEnabled = value;
  }
  async log(msg /*string || JSON*/) {//-> void
    if (this.#loggingEnabled) {
      this.#log.push(
        new xUITools().seconds +
          " | " +
          msg.stack
            .slice(msg.stack.lastIndexOf("/") + 1, msg.stack.length)
            .replace(")", "") +
          " | " +
          msg.message
      );
      let entry = document.createElement("tr");
      if (msg instanceof Error) {
        entry.innerHTML =
          '<td style="display:none">' +
          new xUITools().seconds +
          "</td>" +
          "<td>" +
          msg.stack
            .slice(msg.stack.lastIndexOf("/") + 1, msg.stack.length)
            .replace(")", "") +
          "</td>" +
          '<td style="overflow-y:scroll;display:block;">' +
          msg.message +
          "</div>";
      } else {
        entry.setAttribute("colspan", 3);
        entry.innerHTML = msg;
      }
      this.#frame.getElementsByClassName("log-length")[0].innerText =
        this.#log.length;
      this.#frame
        .getElementsByClassName("error-table-body")[0]
        .appendChild(entry);
    }
  }
}

class xQueue extends xQueueLog {
  #oName;
  #queue;
  #stage;
  #maxThreads;
  #startfunction;
  #promises;
  #onComplete;
  #complete;
  #values;
  constructor(oName = "xQueue" /*string*/) {
    super(oName);
    this.#oName = oName;
    this.#queue = [];
    this.#stage = [];
    this.#promises = [];
    this.#values = [];
    this.#maxThreads = 2;
    this.#complete = false;
    this.#startfunction = async () => {
      console.log(" no start function set");
    };
    super.log(new Error("xQueue class initialized"));
  }
  get promises() {
    //-> javascript promise object
    super.log(new Error("fetching property--promises: " + this.#promises));
    return this.#promises;
  }
  get name() {
    //-> string
    super.log(new Error("fetching property--name: " + this.#oName));
    return this.#oName;
  }
  get maxThreads() {
    //-> int
    super.log(new Error("fetching property--maxThreads: " + this.#maxThreads));
    return this.#maxThreads;
  }
  set onComplete(value /*function*/) {
    //->void
    this.#onComplete = value;
    super.log(new Error("property set--onComplete: " + value));
  }
  set maxThreads(value /*int*/) {
    //-> void
    this.#maxThreads = value;
    super.log(new Error("property set--maxThreads: " + value));
  }
  set startfunction(value /*function*/) {
    //-> void
    this.#startfunction = async () => {
      await value;
    };
    super.log(new Error("property set--startFunction: " + value));
  }
  add(func /*function*/) {
    //-> void
    this.#stage.push(func);
    super.log(new Error("added function to Queue: " + func));
  }
  async start() {
    //-> void
    this.#startfunction().then(() => {
      for (i=0; i < this.#maxThreads; i++){
        let f = this.#stage.shift();
        let p = f().then((output)=>{
          this.#queue.splice(this.#queue.indexOf(p), 1);
          if(this.#stage.length >0){
            this.#cycle();
          }else{
            if(!this.#complete){
              this.#awaitComplete();
            }
          }
          return output;
        })
        this.#promises.push(p);
      }
    });
  }
  async #cycle() {
    //- void
    for (i=this.#queue.length; i<this.#queue.length + Math.min(this.#maxThreads, this.#stage.length); i++){
      let f = this.#stage.shift();
        let p = f().then((output)=>{
          this.#queue.splice(this.#queue.indexOf(p), 1);
          if(this.#stage.length >0){
            console.log(this.#queue, this.#stage);
            this.#cycle();
          }else{
            if(!this.#complete){
              this.#awaitComplete();
            }
          }
          return output;
        });
        this.#promises.push(p);
    }
  }
  #awaitComplete(){
    this.#complete = true;
    Promise.allSettled(this.#promises).then((values)=>{
      this.#values = values;
      this.#onComplete();
    });
  }
}


/*DEMO ------------------------------------------------------------ */
let onComplete = () => {
  console.log("QUEUE COMPLETE " + counter);
}

let testFunction = async () => { //work on delaying response to prove they are true async
  var id = new xUITools().id;
  counter++;
  return id;
}
let counter = 0;
function testQueue(){
  let queue = new xQueue();
  for (i=0; i < 10; i ++ ){
    queue.add(testFunction);
  }
  queue.onComplete = onComplete;
  queue.start();
  for (i=0; i < 10; i ++ ){
    queue.add(testFunction);
    console.log("adding more functions");
  }
}

testQueue();