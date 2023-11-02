//Elements Missing -- queue error log, marquee effect, key logging
class xUITools {
  constructor() {}
  get id() {
    //->string
    return (
      "x_" +
      (new Date().getTime() + parseInt(Math.random() * 10000)).toString(16)
    );
  }
  get seconds() {
    //-> long
    return new Date().getTime();
  }
  get timestamp() {
    //-> string
    return this.#timestamp();
  }
  #timestamp() {
    //-> string
    let d = new Date();
    let day = d.getDay().pad(1);
    let month = d.getMonth().pad(1);
    let year = d.getYear();
    let hour = d.getHour().pad(1);
    let min = d.getMinutes().pad(1);
    let sec = d.getSeconds().pad(1);
    return day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
  }
}

class xUILog {
  #source;
  #loggingEnabled;
  #frame;
  #id;
  #log;
  #altID;
  constructor(source /*string*/, id /*string*/) {
    //->  #void
    this.#source = source;
    this.#log = [];
    this.#loggingEnabled = configuration.UI_LOGGING_ENABLED;
    this.#id = new xUITools().id;
    this.#altID = id;
    this.#frame = document.createElement("div");
    this.#frame.innerHTML =
      '<div class="accordion-item">' +
      '<div class="accordion-header">' +
      '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#' +
      this.#id +
      '">' +
      '<div class="row"  style="font-size:12px">' +
      '<div class="col log-length">' +
      this.#log.length +
      "</div>" +
      '<div class="col source">' +
      this.#source +
      "</div>" +
      '<div class="col id">' +
      this.#altID +
      "</div>" +
      "</div>" +
      "</button>" +
      "</div>" +
      '<div id="' +
      this.#id +
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
  }
  get toJSON() {
    return JSON.stringify(this.#log, undefined, 2);
  }
  get source() {
    //-> htmlElement
    return this.#source;
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
  async log(msg /*string || JSON*/) {
    //-> void
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

class xUIThread extends xUILog {
  #threadMain;
  #queue;
  #id;
  #onComplete;
  constructor(id = new xUITools().id /*string*/) {
    //-> xUIThread
    super("xUIThread", id);
    this.#id = id;
    this.#threadMain = async () => {};
    this.#onComplete = () =>
      super.log(new Error("thread complete, no onComplete function set"));
    this.#queue = [];
    super.log(new Error("Thread: " + this.#id + " Initialized"));
  }
  get id() {
    //-> string
    super.log(new Error("fetching property id: "+ this.#id))
    return this.#id;
  }
  get onComplete() {
    //-> function
    super.log(new Error("fetching property on complete: " + this.#onComplete))
    return this.#onComplete;
  }
  set onComplete(value /*function*/) {
    this.#onComplete = value;
    super.log(new Error("setting property onComplete: " + this.#onComplete));
  }
  async add(arg /*function*/) {
    //-> void
    this.#queue.push(arg);
    super.log(new Error("Argument " + arg + " added to thread"));
  }
  async start() {
    //-> void
    super.log(new Error("Starting Thread: " + this.#id));
    this.#threadMain()
      .then(() => {
        this.#queue.forEach((f) => {
          super.log(new Error("Running Function" + f));
          f();
        });
      })
      .catch((error) => {
        typeof error == "string"
          ? super.log(new Error(error))
          : super.log(error);
      });
  }
}

class xHttpRequest extends xUILog {
  #request;
  #requestType;
  #requestUrl;
  #responseBody;
  #data;
  #id;
  constructor(
    requestType /*string*/,
    requestUrl /*string*/,
    id = new xUITools().id
  ) {
    //-> xHttpRequest
    super("xHttpRequest", id);
    this.#requestType = requestType;
    this.#requestUrl = requestUrl;
    this.#data = "{}";
    this.#id = id;
    super.log(new Error("xHttpRequest Object Initialized"));
  }
  get id() {
    //-> string
    super.log(new Error("id fetched " + this.#id));
    return this.#id;
  }
  get requestType() {
    //-> string
    super.log(new Error("request type fetched: " + this.#requestType));
    return this.#requestType;
  }
  get requestUrl() {
    //-> string
    super.log(new Error("request url fetched: " + this.#requestUrl));
    return this.#requestUrl;
  }
  get responseBody() {
    //-> function
    super.log(new Error("response body fetched: " + this.#responseBody));
    return this.#responseBody;
  }
  get data() {
    //-> string
    super.log(new Error("data fetched: " + this.#data));
    return this.#data;
  }
  get promise() {
    //-> promise
    super.log(new Error("promise fetched"));
    return this.#request;
  }
  set responseBody(value /*function*/) {
    //-> void
    this.#responseBody = value;
    super.log(new Error("responseBody set"));
  }
  set data(value /*JSON*/) {
    //-> void
    this.#data = JSON.stringify(value);
    super.log(new Error("Data Set: " + this.#data));
  }
  async send() {
    //-> void
    super.log(new Error("sending request to: " + this.#requestUrl + "of type: " + this.#requestType +" with data: "+ this.#data));
    return (this.#request = await fetch(this.#requestUrl, {
      Method: this.#requestType,
      Headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      Body: this.#data,
      Cache: "default",
    })
      .then((r) => {
        return r.text();
      })
      .then((data) => {
        this.#data = data;
        this.#responseBody(data)
        super.log(new Error("response recieved: "+ this.#data))
        return data;
      })
      .catch((error) => {
        super.log(error);
      }));
  }
}

class xExRef extends xUILog {
  #tagName;
  #src;
  #parent;
  #request;
  #element;
  #actionQueue;
  #asyncFunction;
  #id;
  constructor(
    tagName /*string*/,
    src /*string*/,
    parent /*htmlElement*/,
    id = new xUITools().id
  ) {
    //-> xExref
    super("xExRef", id);
    this.#tagName = tagName;
    this.#src = src;
    this.#parent = parent;
    this.#element = document.createElement(this.#tagName);
    this.#request = new xHttpRequest("GET", this.#src);
    this.#actionQueue = [];
    this.#asyncFunction = (async () => {}).constructor;
    this.#id = id;
    super.log(new Error("xExEef class initialized"));
  }
  get id() {
    //-> string
    super.log(new Error("id fetched: " + this.#id));
    return this.#id;
  }
  get tagName() {
    //-> string
    super.log(new Error("tagName fetched: " + this.#tagName));
    return this.#tagName;
  }
  get src() {
    //-> string
    super.log(new Error("src fetched: "+ this.#src));
    return this.#src;
  }
  get parent() {
    //-> htmlElement
    super.log(new Error("parent fetched: " + this.#parent.tagName))
    return this.#parent;
  }
  get element() {
    //-> htmlElement
    super.log(new Error("element fetched: "+ this.#element.tagName));
    return this.#element;
  }
  get actionQueue() {
    //-> array
    super.log(new Error("action queue fetched: "+ this.#actionQueue));
    return this.#actionQueue;
  }
  async addAction(value /*anonymous function */) {
    //-> void
    super.log(new Error("added to action queue: "+ value))
    this.#actionQueue.push(value);
  }
  async append() {
    //-> void
    super.log(new Error("fetching external refernce... "));
    this.#request.responseBody = () => this.#responseBody(this.#request.data);
    this.#request.send().then(() => {
      this.#action().then(() => {super.log(new Error("external reference complete"));
      }).catch((error) => {
        super.log(new Error(error));
      });
    });
  }
  #responseBody(data /*string*/) {
    // -> void
    this.#element.innerHTML = data;
    this.#parent.appendChild(this.#element);
    super.log(new Error("external reference action complete"));
  }
  async #action() {
    if (this.#actionQueue.length >= 1) {
      let test = new Promise((resolve) => {
        this.#actionQueue[0] instanceof this.#asyncFunction
          ? resolve(true)
          : resolve(false);
      });
      Promise.all([test])
        .then(([value]) => {
          if (value) {
            super.log(new Error("firing async function: " + this.#actionQueue[0]))
            this.#actionQueue[0]().then(() => {
              super.log(new Error("async function complete: " + this.#actionQueue[0]));
              this.#actionQueue.shift();
              super.log(new Error("incrementing queue"));
              if (this.#actionQueue.length >= 1) {
                this.#action().catch((error) => {
                  super.log(new Error(error));
                });
              }
            });
          } else {
            super.log(new Error("firing synchronous function: " + this.#actionQueue[0]))
            this.#actionQueue[0]();
            super.log(new Error("async function complete: " + this.#actionQueue[0]));
            this.#actionQueue.shift();
             super.log(new Error("incrementing queue"));
            if (this.#actionQueue.length >= 1) {
              this.#action().catch((error) => {
                super.log(new Error(error));
              });
            }
          }
        })
        .catch((error) => {
          super.log(new Error(error));
        });
    }
  }
}

class xForm_Element extends xUILog {
  #element;
  #tagName;
  #visible;
  #display;
  #id;
  constructor(
    element /*htmlElement*/,
    override = "" /*string*/,
    id = new xUITools().id
  ) {
    //-> void
    super("xFormElement", id);
    this.#element = element;
    this.#tagName = override != "" ? override : this.#element.tagName;
    this.#visible = !(this.#element.parentNode.style.display == "none");
    this.#display = this.#element.parentNode.style.display;
    this.#id = id;
    super.log(new Error("xFormElement class initialized"));
  }
  get id() {//-> string
    super.log(new Error("fetching property id: "+ this.#id));
    return this.#id;
  }
  get visible() { //-> boolean
  super.log(new Error("fetching property visible: "+ this.#visible))
    return this.#visible;
  }
  get element() {
    //-> htmlElement
    return this.#element;
  }
  get tagName() {
    //-> string
    return this.#tagName;
  }
  get value() {
    //-> string
    return this.#getValue();
  }
  get disabled() {
    //-> boolean
    return this.#element.disabled;
  }
  set disabled(value /*boolean*/) {
    //-> void
    this.#element.disabled = value;
  }
  set value(value /*string*/) {
    //-> void
    this.#setValue(value);
  }
  async toggle() {
    this.#visible
      ? (this.#element.parentNode.style.display = "none")
      : (this.#element.parentNode.style.display = this.#display);
    this.#visible = !(this.#element.parentNode.style.display == "none");
  }
  #getValue() {
    //Need to Finish
    switch (this.#tagName) {
      case "SELECT":
        return this.#element.value;
        break;
      case "INPUT":
        if (this.#element.type == "checkbox") {
          return this.#element.checked;
        } else {
          return this.#element.value;
        }
        break;
      case "BUTTON":
        return this.#element.innerText;
        break;
      default:
        return this.#element.innerText;
        break;
    }
  }
  #setValue(value /*string*/) {
    //Need to Finish
    switch (this.#tagName) {
      case "select":
        this.#element.value = value;
        break;
      case "input":
        this.#element.value = value;
        break;
      case "button":
        this.#element.innerText = value;
        break;
      default:
        this.#element.innerText = value;
        break;
    }
  }
}

class xForm_Manager extends xUILog {
  #wrapper;
  #visible;
  #catalog;
  #id;
  constructor(wrapper /*htmlElement*/, id = new xUITools().id) {
    //-> void
    super("xForm", id);
    this.#wrapper = wrapper;
    this.#visible = !(this.wrapper.style.display == "none");
    this.#catalog = {};
    this.#id = id;
  }
  get id() {
    //-> string
    return this.#id;
  }
  get data() {
    //->String
    let lData = {};
    for (var key in this.#catalog) {
      let obj = this.#catalog[key];
      if (obj.visible && !obj.disabled) {
        lData[key] = obj.value;
      }
    }
    return JSON.stringify(lData, undefined, 2);
  }
  get wrapper() {
    //-> htmlElement
    return this.#wrapper;
  }
  get visible() {
    //-> boolean
    return this.#visible;
  }
  set visible(value /*boolean*/) {
    //-> void
    value
      ? (this.#wrapper.style.display = "none")
      : (this.#wrapper.style.display = "");
    this.#visible = value;
  }
  async toggle() {
    //-> void
    this.#visible
      ? (this.#wrapper.style.display = "none")
      : (this.#wrapper.style.display = "");
    this.#visible = this.#visible ? false : true;
  }
  async addElement(id /*string*/, formElement /*xForm_Element*/) {
    //-> void
    this.#catalog[id] = formElement;
  }
  getElement(id /*string*/) {
    //-> xForm_Element
    let nullElement = document.createElement("div");
    nullElement.innerText = "ID Not Found, blank Form Element Generated";
    return id in this.#catalog
      ? this.#catalog[id]
      : new xForm_Element(nullElement);
  }
}

class xHTMLPane extends xUILog {
  #visible;
  #element;
  #display;
  #id;
  constructor(element /*htmlElement*/, id = new xUITools().id) {
    //-> void
    super("xHTMLPane", id);
    this.#element = element;
    this.#display = this.#element.style.display;
    this.#element.style.display = "none";
    this.#visible = false;
    this.#id = id;
  }
  get id() {
    //-> string
    return this.#id;
  }
  get visible() {
    //-> boolean
    return this.#visible;
  }
  set visible(value /*boolean*/) {
    //-> void
    this.#visible = value;
    value
      ? (this.#element.style.display = this.#display)
      : (this.#element.style.display = "none");
  }
  async activate() {
    //-> void
    this.#visible = true;
    this.#element.style.display = this.#display;
  }
  async hide() {
    //-> void
    this.#visible = false;
    this.#element.style.display = "none";
  }
}

class xHTMLPane_Trigger extends xUILog {
  #element;
  #event;
  #id;
  constructor(element /*htmlElement*/, id = new xUITools().id) {
    //-> void
    super("xHTMLPane_Trigger", id);
    this.#element = element;
    this.#event;
    this.#id = id;
  }
  get id() {
    return this.#id;
  }
  get element() {
    //-> htmlElement
    return this.#element;
  }
  get event() {
    //-> xEventListener
    return this.#event;
  }
  set event(value /*xEventListener*/) {
    //-> void
    this.#event = value;
  }
}

class xHTMLPane_Manager extends xUILog {
  #catalog;
  #activePane;
  #id;
  constructor(id = new xUITools().id) {
    //-> xHTMLPane_Manager
    super("xHTMLPane_Manger", id);
    this.#catalog = {};
    this.#activePane;
    this.#id = id;
  }
  get id() {
    return this.#id;
  }
  get activePane() {
    return this.#activePane;
  }
  get catalog() {
    //-> JSON
    return this.#catalog;
  }
  getItem(key /*string*/) {
    //-> xHTMLPane
    return this.#catalog[key];
  }
  async setItem(key /*string*/, value /*JSON*/) {
    //-> void
    this.#catalog[key] = value;
    this.#catalog[key]["Trigger"].element.addEventListener("click", () => {
      this.activate(key);
    });
  }
  async activate(key /*string*/) {
    //-> void
    this.#activePane != null ? this.#activePane["Pane"].hide() : "";
    this.#catalog[key]["Pane"].activate();
    this.#activePane = this.#catalog[key];
    super.log(new Error("Active Pane: " + key));
  }
}

class xOffCanvas extends xUILog {
  #wrapper;
  #triggers;
  #body;
  #id;
  #dismisses;
  #drag;
  #startX;
  #endX;
  #dragging;
  #resizeLimit;
  constructor(
    wrapper /*htmlElement*/,
    dismiss /*htmlElement*/,
    trigger /*htmlElement*/,
    id = new xUITools().id
  ) {
    //->xHTMLOffCanvas;
    super("xHTMLOffCanvas", id);
    this.#wrapper = wrapper;
    this.#dismisses = [dismiss];
    this.#triggers = [trigger];
    this.#body = this.#wrapper;
    this.#id = id;
    this.#drag =
      this.#wrapper.getElementsByClassName("offcanvas-resize").length > 0
        ? this.#wrapper.getElementsByClassName("offcanvas-resize")[0]
        : null;
    this.#triggers[0].setAttribute("data-bs-toggle", "offcanvas");
    this.#triggers[0].setAttribute("data-bs-target", "#" + this.#id);
    this.#dismisses[0].getAttribute("data-bs-dismiss") == null
      ? this.#dismisses[0].setAttribute("data-bs-dismiss", "offcanvas")
      : "";
    this.#drag != null
      ? this.#allowResizing()
      : super.log(new Error("Resizing not possible, resize bar not found"));
    this.#dragging = false;
    this.#resizeLimit = 250;
    this.#startX;
    this.#endX;
    super.log(new Error("OffCanvas window initialized: " + this.#id));
  }
  get visible() {
    //-> boolean
    return (
      this.#wrapper.style.display != "none" &&
      this.#wrapper.style.display != "hidden"
    );
  }
  get id() {
    return this.#id;
  }
  get wrapper() {
    //-> htmlElement
    return this.#wrapper;
  }
  get dismisses() {
    //-> array
    return this.#dismisses;
  }
  get triggers() {
    //-> array
    return this.#triggers;
  }
  get body() {
    //->htmlElement
    return this.#body;
  }
  set body(value /*htmlElement*/) {
    //-> void
    this.#body = value;
  }
  async addtrigger(trigger /*hmtlElement*/) {
    //-> void
    trigger.setAttribute("data-bs-toggle", this.#id);
    this.#triggers.push(trigger);
    super.log(new Error("Trigger added to: " + this.#id));
  }
  async addDismiss(dismiss /*htmlElement*/) {
    //-> void
    dismiss.setAttribute("data-bs-dismiss", "offcanvas");
    this.#dismisses.push(dismiss);
    super.log(new Error("Dismiss added to: " + this.#id));
  }
  #allowResizing() {
    this.#wrapper.style.width = this.#wrapper.offsetWidth;
    this.#drag.addEventListener("mousedown", (e) => this.#down(e));
    window.addEventListener("mousemove", (e) => this.#move(e));
    window.addEventListener("mouseup", (e) => this.#up(e));
    super.log(new Error("Resizing Initialized to: " + this.#id));
  }
  #down(e) {
    e.preventDefault();
    if (e.target == this.#drag) {
      this.#dragging = true;
      this.#startX = e.screenX;
    }
  }
  #move(e) {
    if (this.#dragging) {
      e.preventDefault();
      this.#endX = e.screenX;
      switch (true) {
        case parseInt(this.#wrapper.style.width) >
          parseInt(screen.width) - this.#resizeLimit &&
          this.#endX - this.#startX < 0:
          this.#wrapper.style.width =
            parseInt(screen.width) - this.#resizeLimit + "px";
          break;
        case parseInt(this.#wrapper.style.height) >
          parseInt(screen.height) - this.#resizeLimit:
          this.#wrapper.style.height =
            parseInt(screen.height) - this.#resizeLimit + "px";
          break;
        case parseInt(this.#wrapper.style.width) < this.#resizeLimit &&
          this.#endX - this.#startX > 0:
          this.#wrapper.style.width = this.#resizeLimit + "px";
          break;
        case parseInt(this.#wrapper.style.height) < this.#resizeLimit:
          this.#wrapper.style.height = this.#resizeLimit + "px";
          break;
        default:
          this.#wrapper.style.width =
            parseInt(this.#wrapper.style.width) -
            (this.#endX - this.#startX) +
            "px";
      }
    }
  }
  #up(e) {
    if (this.#dragging) {
      this.#dragging = false;
      super.log(
        new Error("Pane Resize: " + -(this.#endX - this.#startX) + "px")
      );
    }
  }
}

class xEventListener extends xUILog {
  #element;
  #type;
  #event;
  #eventAction;
  #id;
  constructor(
    element /*htmlElement*/,
    type /*string*/,
    id = new xUITools().id
  ) {
    //-> void
    super("xEventListener", id);
    this.#element = element;
    this.#type = type;
    this.#eventAction = () => {};
    this.#event;
    this.#id = id;
  }
  get id() {
    return this.#id;
  }
  get element() {
    //-> htmlElement;
    return this.#element;
  }
  get type() {
    //-> string;
    return this.#type;
  }
  get eventAction() {
    //-> function
    return this.#eventAction;
  }
  set eventAction(value /*function*/) {
    this.#eventAction = value;
  }
  async setEvent() {
    //-> void
    this.#event = this.#element.addEventListener(this.#type, this.#eventAction);
  }
  async removeEvent() {
    //-> void
    this.#element.removeEventListener(this.#type, this.#event);
  }
}

class xModal extends xUILog {
  #wrapper;
  #triggers;
  #body;
  #id;
  #dismisses;
  constructor(
    wrapper /*htmlElement*/,
    dismiss /*htmlElement*/,
    trigger /*htmlElement*/,
    id = new xUITools().id
  ) {
    //->xModalCanvas;
    super("xModal", id);
    this.#wrapper = wrapper;
    this.#dismisses = [dismiss];
    this.#triggers = [trigger];
    this.#body = this.#wrapper;
    this.#id = id;
    this.#triggers[0].setAttribute("data-bs-toggle", "modal");
    this.#triggers[0].setAttribute("data-bs-target", "#" + this.#id);
    this.#dismisses[0].getAttribute("data-bs-dismiss") == null
      ? this.#dismisses[0].setAttribute("data-bs-dismiss", "modal")
      : "";
  }
  get visible() {
    //-> boolean
    return (
      this.#wrapper.style.display != "none" &&
      this.#wrapper.style.display != "hidden"
    );
  }
  get id() {
    return this.#id;
  }
  get wrapper() {
    //-> htmlElement
    return this.#wrapper;
  }
  get dismisses() {
    //-> array
    return this.#dismisses;
  }
  get triggers() {
    //-> array
    return this.#triggers;
  }
  get body() {
    //->htmlElement
    return this.#body;
  }
  set body(value /*htmlElement*/) {
    //-> void
    this.#body = value;
  }
  async addtrigger(trigger /*hmtlElement*/) {
    //-> void
    trigger.setAttribute("data-bs-toggle", this.#id);
    this.#triggers.push(trigger);
  }
  async addDismiss(dismiss /*htmlElement*/) {
    //-> void
    dismiss.setAttribute("data-bs-dismiss", "modal");
    this.#dismisses.push(dismiss);
  }
}

class xCarousel extends xUILog {
  #carousel;
  #carouselWrapper;
  #carouselNavigators;
  #carouselBody;
  #id;
  #frameworkPresent;
  #slides;
  #indexForward;
  #indexBackward;
  constructor(carouselWrapper /*htmlElement*/, id = new xUITools().id) {
    //-> xCarousel
    super("xCarousel", id);
    this.#id = id;
    this.#carouselWrapper = carouselWrapper;
    this.#carouselBody =
      this.#carouselWrapper.getElementsByClassName("carousel-inner")[0] || null;
    this.#carouselNavigators =
      this.#carouselWrapper.getElementsByClassName("carousel-indicators")[0] ||
      null;
    this.#indexBackward = this.#carouselWrapper.getElementsByClassName(
      "carousel-control-prev"
    )[0];
    this.#indexForward = this.#carouselWrapper.getElementsByClassName(
      "carousel-control-next"
    )[0];
    this.#frameworkPresent =
      this.#carouselBody != null && this.#carouselNavigators != null;
    if (this.#frameworkPresent) {
      this.#id = this.#carouselWrapper.id || new xUITools().id;
      this.#carousel = bootstrap.Carousel.getOrCreateInstance(
        this.#carouselWrapper
      );
      this.#slides = [
        ...Array(
          document.getElementsByClassName("carousel-item").length
        ).keys(),
      ];
      this.#indexForward.setAttribute("data-bs-target", "#" + this.#id);
      this.#indexBackward.setAttribute("data-bs-target", "#" + this.#id);
    } else {
      super.log(
        new Error("Carousel Framework Not found, carousel not initialized")
      );
    }
  }
  get id() {
    return this.#id;
  }
  get activeSlide() {
    return this.#carouselBody.getElementsByClassName("active")[0] || null;
  }
  addSlide(slideInner /*htmlElment*/, label = "" /*string*/) {
    //-> void
    if (this.#frameworkPresent) {
      let slide = document.createElement("div");
      slide.className = "carousel-item";
      slide.style.height = "500px";
      slide.append(slideInner);
      let navigator =
        '<button type="button" data-bs-target="#' +
        this.#id +
        '" data-bs-slide-to="' +
        this.#slides.length +
        '" aria-label="' +
        label +
        '"></button>';
      this.#carouselBody.appendChild(slide);
      this.#carouselNavigators.innerHTML += navigator;
      this.#slides.push(this.#slides.length);
      this.#carousel.dispose();
      this.#carousel = new bootstrap.Carousel(this.#carouselWrapper);
    } else {
      super.log(new Error("Carousel Framework Not Present, slide not added"));
    }
  }
}

class xKeyLog extends xUILog {
  #catalog;
  constructor(id = new xUITools().id /*(optional) string*/) {
    //xKeyLog
    super("xKeyLog", id);
    this.#catalog = {};
  }
  get catalog() {
    //-> JSON
    return this.#catalog;
  }
  get toJSON() {
    //-> string
    let xPort = {};
    Object.keys(this.#catalog).forEach((key) => {
      xPort[key] = this.#catalog[key].log;
    });
    return JSON.stringify(xPort, undefined, 2);
  }
  addListener(key /*string*/, listener /*xKeyListener*/) {
    //-> Void
    this.#catalog[key] = listener;
  }
}

class xKeyListener extends xUILog {
  //Citation: https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript
  //Protions of this were taken conceptually from this answer on stack overflow
  #target;
  #keys;
  #listenerDown;
  #listenerUp;
  #action;
  #log;
  #id;
  #catalog;
  #logAllKeys;
  constructor(
    keyCodes = [] /*array*/,
    target = document /*htmlInputElement*/,
    id = new xUITools().id /*(optional) string*/
  ) {
    //-> xKeyListener
    super("xKeyListener", id);
    this.#target = target;
    this.#keys = keyCodes;
    this.#logAllKeys = false;
    this.#listenerDown = new xEventListener(target, "keydown");
    this.#listenerUp = new xEventListener(target, "keyup");
    this.#action = () => {};
    this.#catalog = {};
    this.#log = [];
    this.#id = id;
  }
  get logAllKeys() {
    return this.#logAllKeys;
  }
  get id() {
    return this.#id;
  }
  get log() {
    // -> array
    return this.#log;
  }
  set logAllKeys(value /*boolean*/) {
    //-> void
    this.#logAllKeys = value;
  }

  set action(value /*function*/) {
    //-> void
    this.#action = value;
  }
  setListener() {
    //-> void
    this.#listenerUp.eventAction = this.#listenerDown.eventAction = (e) => {
      let source = this.#target.id || this.#target.tagName || this.#id;
      let key = e.keyCode || e.which;
      let keysPressed = 0;
      this.#catalog[key] = e.type == "keydown";
      this.#keys.forEach((cKey) => {
        this.#catalog[cKey] == true ? keysPressed++ : "";
      });
      if (this.#keys.length == keysPressed) {
        this.#action();
        this.#log.push(
          new xUITools().seconds + " " + source + " " + String.fromCharCode(key)
        );
        this.#catalog = {};
      } else {
        if (this.#logAllKeys) {
          this.#log.push(
            new xUITools().seconds +
              " " +
              source +
              " " +
              String.fromCharCode(key)
          );
        }
      }
    };
    this.#listenerUp.setEvent();
    this.#listenerDown.setEvent();
  }
}
