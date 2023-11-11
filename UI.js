/* eslint-disable no-case-declarations */
/* eslint-disable valid-typeof */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
//Elements Missing -- queue error log, marquee effect, key logging
class xUITools {
  constructor() {}
  get id() {
    //->string
    return "x_" + (new Date().getTime() + parseInt(Math.random() * 10000)).toString(16);
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
    this.#loggingEnabled ? document.getElementById(configuration.ERROR_LOG_DOCUMENT_ID).appendChild(this.#frame) : "";
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
      this.#log.push([
        new xUITools().seconds,
        msg.stack.slice(msg.stack.lastIndexOf("/") + 1, msg.stack.length).replace(")", ""),
        msg.message,
      ]);
      let entry = document.createElement("tr");
      if (msg instanceof Error) {
        entry.innerHTML =
          '<td style="display:none">' +
          new xUITools().seconds +
          "</td>" +
          "<td>" +
          msg.stack.slice(msg.stack.lastIndexOf("/") + 1, msg.stack.length).replace(")", "") +
          "</td>" +
          '<td style="overflow-y:scroll;display:block;">' +
          msg.message +
          "</div>";
      } else {
        entry.setAttribute("colspan", 3);
        entry.innerHTML = msg;
      }
      this.#frame.getElementsByClassName("log-length")[0].innerText = this.#log.length;
      this.#frame.getElementsByClassName("error-table-body")[0].appendChild(entry);
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
    this.#onComplete = () => super.log(new Error("thread complete, no onComplete function set"));
    this.#queue = [];
    super.log(new Error("Thread: " + this.#id + " Initialized"));
  }
  get id() {
    //-> string
    super.log(new Error("fetching property--id: " + this.#id));
    return this.#id;
  }
  get onComplete() {
    //-> function
    super.log(new Error("fetching property--onComplete: " + this.#onComplete));
    return this.#onComplete;
  }
  set onComplete(value /*function*/) {
    //-> void
    this.#onComplete = value;
    super.log(new Error("setting property--onComplete: " + this.#onComplete));
  }
  async add(arg /*function*/) {
    //-> void
    this.#queue.push(arg);
    super.log(new Error("Adding argument: " + arg));
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
        typeof error == "string" ? super.log(new Error(error)) : super.log(error);
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
  constructor(requestType /*string*/, requestUrl /*string*/, id = new xUITools().id /*string*/) {
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
    super.log(new Error("property fetched--id: " + this.#id));
    return this.#id;
  }
  get requestType() {
    //-> string
    super.log(new Error("property fetched--requestType: " + this.#requestType));
    return this.#requestType;
  }
  get requestUrl() {
    //-> string
    super.log(new Error("property fetched--requestUrl: " + this.#requestUrl));
    return this.#requestUrl;
  }
  get responseBody() {
    //-> function
    super.log(new Error("property fetched--responseBody: " + this.#responseBody));
    return this.#responseBody;
  }
  get data() {
    //-> string
    super.log(new Error("property fetched--data: " + this.#data));
    return this.#data;
  }
  get promise() {
    //-> promise
    super.log(new Error("property fetched--promise: " + this.#data));
    return this.#request;
  }
  set responseBody(value /*function*/) {
    //-> void
    this.#responseBody = value;
    super.log(new Error("property set--responseBody: " + this.#responseBody));
  }
  set data(value /*JSON*/) {
    //-> void
    this.#data = JSON.stringify(value);
    super.log(new Error("property set--data: " + this.#data));
  }
  async send() {
    //-> void
    super.log(
      new Error(
        "sending request to: " + this.#requestUrl + " of type: " + this.#requestType + " with data: " + this.#data
      )
    );
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
        this.#responseBody(data);
        super.log(new Error("response recieved: " + this.#data));
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
  constructor(tagName /*string*/, src /*string*/, parent /*htmlElement*/, id = new xUITools().id /*string*/) {
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
    super.log(new Error("property fetched--id: " + this.#id));
    return this.#id;
  }
  get tagName() {
    //-> string
    super.log(new Error("property fetched--tagName: " + this.#tagName));
    return this.#tagName;
  }
  get src() {
    //-> string
    super.log(new Error("property fetched--src: " + this.#src));
    return this.#src;
  }
  get parent() {
    //-> htmlElement
    super.log(new Error("property fetched--parent: " + this.#parent.tagName));
    return this.#parent;
  }
  get element() {
    //-> htmlElement
    super.log(new Error("property fetched--element: " + this.#element.tagName));
    return this.#element;
  }
  get actionQueue() {
    //-> array
    super.log(new Error("property fetched--actionQueue: " + this.#actionQueue));
    return this.#actionQueue;
  }
  async addAction(value /*anonymous function */) {
    //-> void
    super.log(new Error("added to action queue: " + value));
    this.#actionQueue.push(value);
  }
  async append() {
    //-> void
    super.log(new Error("fetching external reference... "));
    this.#request.responseBody = () => this.#responseBody(this.#request.data);
    this.#request.send().then(() => {
      this.#action()
        .then(() => {
          super.log(new Error("External reference fetch complete"));
        })
        .catch((error) => {
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
        this.#actionQueue[0] instanceof this.#asyncFunction ? resolve(true) : resolve(false);
      });
      Promise.all([test])
        .then(([value]) => {
          if (value) {
            super.log(new Error("firing async function: " + this.#actionQueue[0]));
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
            super.log(new Error("firing synchronous function: " + this.#actionQueue[0]));
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
  constructor(element /*htmlElement*/, override = "" /*string*/, id = new xUITools().id /*string*/) {
    //-> void
    super("xFormElement", id);
    this.#element = element;
    this.#tagName = override != "" ? override : this.#element.tagName;
    this.#visible = !(this.#element.parentNode.style.display == "none");
    this.#display = this.#element.parentNode.style.display;
    this.#id = id;
    super.log(new Error("xFormElement class initialized"));
  }
  get id() {
    //-> string
    super.log(new Error("fetching property--id: " + this.#id));
    return this.#id;
  }
  get visible() {
    //-> boolean
    super.log(new Error("fetching property--visible: " + this.#visible));
    return this.#visible;
  }
  get element() {
    //-> htmlElement
    super.log(new Error("fetching property--element: " + this.#element));
    return this.#element;
  }
  get tagName() {
    //-> string
    super.log(new Error("fetching property--tagName:" + this.#tagName));
    return this.#tagName;
  }
  get value() {
    //-> string
    super.log(new Error("fetching property--value: " + this.#getValue()));
    return this.#getValue();
  }
  get disabled() {
    //-> boolean
    super.log(new Error("fetching property--disabled: " + this.#element.disabled));
    return this.#element.disabled;
  }
  set disabled(value /*boolean*/) {
    //-> void
    this.#element.disabled = value;
    super.log(new Error("property set--disabled: " + value));
  }
  set value(value /*string*/) {
    //-> void
    this.#setValue(value);
    super.log(new Error("property set--value: " + value));
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
      case "INPUT":
        if (this.#element.type == "checkbox") {
          return this.#element.checked;
        } else {
          return this.#element.value;
        }
      case "BUTTON":
        return this.#element.innerText;
      default:
        return this.#element.innerText;
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
  constructor(wrapper /*htmlElement*/, id = new xUITools().id /*string*/) {
    //-> void
    super("xForm", id);
    this.#wrapper = wrapper;
    this.#visible = !(this.wrapper.style.display == "none");
    this.#catalog = {};
    this.#id = id;
    super.log(new Error("xForm_Manager class initialized"));
  }
  get id() {
    //-> string
    super.log(new Error("fetching property--id: " + this.#id));
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
    super.log(new Error("fetching property--data: " + JSON.stringify(lData)));
    return JSON.stringify(lData, undefined, 2);
  }
  get wrapper() {
    //-> htmlElement
    super.log(new Error("fetching property--wrapper: " + this.#wrapper));
    return this.#wrapper;
  }
  get visible() {
    //-> boolean
    super.log(new Error("fetching property--visible: " + this.#visible));
    return this.#visible;
  }
  set visible(value /*boolean*/) {
    //-> void
    value ? (this.#wrapper.style.display = "none") : (this.#wrapper.style.display = "");
    this.#visible = value;
    super.log(new Error("property set--visible: " + value));
  }
  async toggle() {
    //-> void
    this.#visible ? (this.#wrapper.style.display = "none") : (this.#wrapper.style.display = "");
    this.#visible = this.#visible ? false : true;
    super.log(new Error("pane visiblity toggled--visible?: " + this.#visible));
  }
  async addElement(id /*string*/, formElement /*xForm_Element*/) {
    //-> void
    this.#catalog[id] = formElement;
    super.log(new Error("xFormElement added with id: " + id));
  }
  getElement(id /*string*/) {
    //-> xForm_Element
    let nullElement = document.createElement("div");
    nullElement.innerText = "ID Not Found, blank Form Element Generated";
    if (id in this.#catalog) {
      super.log(new Error("fetching xFormElement--id: " + id));
      return this.#catalog[id];
    } else {
      super.log(new Error("returning null element, xFormElement not found with id: " + id));
      return new xForm_Element(nullElement);
    }
  }
}

class xHTMLPane extends xUILog {
  #visible;
  #element;
  #display;
  #id;
  constructor(element /*htmlElement*/, id = new xUITools().id /*string*/) {
    //-> void
    super("xHTMLPane", id);
    this.#element = element;
    this.#display = this.#element.style.display;
    this.#element.style.display = "none";
    this.#visible = false;
    this.#id = id;
    super.log(new Error("xHTMLPane class initialized"));
  }
  get id() {
    //-> string
    super.log(new Error("fetching property--id: " + this.#id));
    return this.#id;
  }
  get visible() {
    //-> boolean
    super.log(new Error("fetching property--visible: " + this.#visible));
    return this.#visible;
  }
  set visible(value /*boolean*/) {
    //-> void
    this.#visible = value;
    value ? (this.#element.style.display = this.#display) : (this.#element.style.display = "none");
    super.log(new Error("property set--visible: " + value));
  }
  async activate() {
    //-> void
    this.#visible = true;
    this.#element.style.display = this.#display;
    super.log(new Error("pane activated--id: " + this.#id));
  }
  async hide() {
    //-> void
    this.#visible = false;
    this.#element.style.display = "none";
    super.log(new Error("pane hidden--id: " + this.#id));
  }
}

class xHTMLPane_Trigger extends xUILog {
  #element;
  #event;
  #id;
  constructor(element /*htmlElement*/, id = new xUITools().id /*string*/) {
    //-> void
    super("xHTMLPane_Trigger", id);
    this.#element = element;
    this.#event;
    this.#id = id;
    super.log(new Error("xHTMLPane_Trigger"));
  }
  get id() {
    //-> string
    super.log(new Error("fetching property--id: " + this.#id));
    return this.#id;
  }
  get element() {
    //-> htmlElement
    super.log(new Error("fetching property--element: " + this.#element));
    return this.#element;
  }
  get event() {
    //-> xEventListener
    super.log(new Error("fetching property--event: " + this.#event));
    return this.#event;
  }
  set event(value /*xEventListener*/) {
    //-> void
    this.#event = value;
    super.log(new Error("property set--event: " + value));
  }
}

class xHTMLPane_Manager extends xUILog {
  #catalog;
  #activePane;
  #id;
  constructor(id = new xUITools().id /*string*/) {
    //-> xHTMLPane_Manager
    super("xHTMLPane_Manger", id);
    this.#catalog = {};
    this.#activePane;
    this.#id = id;
    super.log(new Error("xHTMLPane_Manager class initialized"));
  }
  get id() {
    //-> string
    super.log(new Error("fetchting property--id: " + this.#id));
    return this.#id;
  }
  get activePane() {
    //->xHTMLPane
    super.log(new Error("fetching property--activePane: " + this.#activePane));
    return this.#activePane;
  }
  get catalog() {
    //-> JSON
    super.log(new Error("fetching property--cataloag: " + JSON.stringify(this.#catalog)));
    return this.#catalog;
  }
  getItem(key /*string*/) {
    //-> xHTMLPane
    super.log(new Error("fetching item--id: " + key));
    return this.#catalog[key];
  }
  async setItem(key /*string*/, trigger /*xHTMLPane_Trigger*/, pane /*xHTMLPane*/) {
    //-> void
    this.#catalog[key] = {
      trigger: trigger,
      pane: pane,
    };
    this.#catalog[key]["trigger"].element.addEventListener("click", () => {
      this.activate(key);
    });
    super.log(new Error("item added--id: " + key));
  }
  async activate(key /*string*/) {
    //-> void
    this.#activePane != null ? this.#activePane["pane"].hide() : "";
    this.#catalog[key]["pane"].activate();
    this.#activePane = this.#catalog[key];
    super.log(new Error("xHTMLPane activated with id:" + key));
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
  #visible;
  constructor(
    wrapper /*htmlElement*/,
    dismiss /*htmlElement*/,
    trigger /*htmlElement*/,
    id = new xUITools().id /*string*/
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
    this.#drag != null ? this.#allowResizing() : super.log(new Error("Resizing not possible, resize bar not found"));
    this.#dragging = false;
    this.#resizeLimit = 250;
    this.#startX;
    this.#endX;
    this.#visible = this.#wrapper.style.display != "none" && this.#wrapper.style.display != "hidden";
    super.log(new Error("xOffCanvas class initialized"));
  }
  get visible() {
    //-> boolean
    this.#visible = this.#wrapper.style.display != "none" && this.#wrapper.style.display != "hidden";
    super.log(new Error("fetching property--visible: " + this.#visible));
    return this.#visible;
  }
  get id() {
    //-> string
    super.log(new Error("fetching property--id: " + this.#id));
    return this.#id;
  }
  get wrapper() {
    //-> htmlElement
    super.log(new Error("fetching property--wrapper: " + this.#wrapper));
    return this.#wrapper;
  }
  get dismisses() {
    //-> array
    super.log(new Error("fetching property--dismisses: " + this.#dismisses));
    return this.#dismisses;
  }
  get triggers() {
    //-> array
    super.log(new Error("fetching property--triggers: " + this.#triggers));
    return this.#triggers;
  }
  get body() {
    //->htmlElement
    super.log(new Error("fetching property--body: " + this.#body));
    return this.#body;
  }
  set body(value /*htmlElement*/) {
    //-> void
    this.#body = value;
    super.log(new Error("property set--body: " + value));
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
        case parseInt(this.#wrapper.style.width) > parseInt(screen.width) - this.#resizeLimit &&
          this.#endX - this.#startX < 0:
          this.#wrapper.style.width = parseInt(screen.width) - this.#resizeLimit + "px";
          break;
        case parseInt(this.#wrapper.style.height) > parseInt(screen.height) - this.#resizeLimit:
          this.#wrapper.style.height = parseInt(screen.height) - this.#resizeLimit + "px";
          break;
        case parseInt(this.#wrapper.style.width) < this.#resizeLimit && this.#endX - this.#startX > 0:
          this.#wrapper.style.width = this.#resizeLimit + "px";
          break;
        case parseInt(this.#wrapper.style.height) < this.#resizeLimit:
          this.#wrapper.style.height = this.#resizeLimit + "px";
          break;
        default:
          this.#wrapper.style.width = parseInt(this.#wrapper.style.width) - (this.#endX - this.#startX) + "px";
      }
    }
  }
  #up(e) {
    if (this.#dragging) {
      this.#dragging = false;
      super.log(new Error("Pane Resize: " + -(this.#endX - this.#startX) + "px"));
    }
  }
}

class xEventListener extends xUILog {
  #element;
  #type;
  #event;
  #eventAction;
  #id;
  constructor(element /*htmlElement*/, type /*string*/, id = new xUITools().id /*string*/) {
    //-> void
    super("xEventListener", id);
    this.#element = element;
    this.#type = type;
    this.#eventAction = () => {};
    this.#event;
    this.#id = id;
    super.log(new Error("xEventListener class Initialized"));
  }
  get id() {
    //-> string
    super.log(new Error("fetching property--id: " + this.#id));
    return this.#id;
  }
  get element() {
    //-> htmlElement
    super.log(new Error("fetching property--element: " + this.#element));
    return this.#element;
  }
  get type() {
    //-> string
    super.log(new Error("fetching property--type: " + this.#type));
    return this.#type;
  }
  get eventAction() {
    //-> function
    super.log(new Error("fetching property--eventAction: " + this.#eventAction));
    return this.#eventAction;
  }
  set eventAction(value /*function*/) {
    //-> void
    this.#eventAction = value;
    super.log(new Error("property set--eventAction: " + value));
  }
  async setEvent() {
    //-> void
    this.#event = this.#element.addEventListener(this.#type, this.#eventAction);
    super.log(new Error("event set"));
  }
  async removeEvent() {
    //-> void
    this.#element.removeEventListener(this.#type, this.#event);
    super.log(new Error("event removed"));
  }
}

class xModal extends xUILog {
  #wrapper;
  #triggers;
  #body;
  #id;
  #dismisses;
  #visible;
  constructor(
    wrapper /*htmlElement*/,
    dismiss /*htmlElement*/,
    trigger /*htmlElement*/,
    id = new xUITools().id /*string*/
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
    this.#visible = this.#wrapper.style.display != "none" && this.#wrapper.style.display != "hidden";
    super.log(new Error("xModal class Initialized"));
  }
  get visible() {
    //-> boolean
    this.#visible = this.#wrapper.style.display != "none" && this.#wrapper.style.display != "hidden";
    super.log(new Error("fetching property--visible: " + this.#visible));
    return this.#visible;
  }
  get id() {
    //-> string
    super.log(new Error("fetching property--id: " + this.#id));
    return this.#id;
  }
  get wrapper() {
    //-> htmlElement
    super.log(new Error("fetching property--wrapper: " + this.#wrapper));
    return this.#wrapper;
  }
  get dismisses() {
    //-> array
    super.log(new Error("fetching property--dismisses: " + this.#dismisses));
    return this.#dismisses;
  }
  get triggers() {
    //-> array
    super.log(new Error("fetching property--triggers: " + this.#triggers));
    return this.#triggers;
  }
  get body() {
    //->htmlElement
    super.log(new Error("fetching property--body: " + this.#body));
    return this.#body;
  }
  set body(value /*htmlElement*/) {
    //-> void
    this.#body = value;
    super.log(new Error("property set--body: " + value));
  }
  async addtrigger(trigger /*hmtlElement*/) {
    //-> void
    trigger.setAttribute("data-bs-toggle", this.#id);
    this.#triggers.push(trigger);
    super.log(new Error("added new trigger: " + trigger));
  }
  async addDismiss(dismiss /*htmlElement*/) {
    //-> void
    dismiss.setAttribute("data-bs-dismiss", "modal");
    this.#dismisses.push(dismiss);
    super.log(new Error("added new dismiss: " + dismiss));
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
  constructor(carouselWrapper /*htmlElement*/, id = new xUITools().id /*string*/) {
    //-> xCarousel
    super("xCarousel", id);
    this.#id = id;
    this.#carouselWrapper = carouselWrapper;
    this.#carouselBody = this.#carouselWrapper.getElementsByClassName("carousel-inner")[0] || null;
    this.#carouselNavigators = this.#carouselWrapper.getElementsByClassName("carousel-indicators")[0] || null;
    this.#indexBackward = this.#carouselWrapper.getElementsByClassName("carousel-control-prev")[0];
    this.#indexForward = this.#carouselWrapper.getElementsByClassName("carousel-control-next")[0];
    this.#frameworkPresent = this.#carouselBody != null && this.#carouselNavigators != null;
    if (this.#frameworkPresent) {
      this.#id = this.#carouselWrapper.id || new xUITools().id;
      this.#carousel = bootstrap.Carousel.getOrCreateInstance(this.#carouselWrapper);
      this.#slides = [...Array(document.getElementsByClassName("carousel-item").length).keys()];
      this.#indexForward.setAttribute("data-bs-target", "#" + this.#id);
      this.#indexBackward.setAttribute("data-bs-target", "#" + this.#id);
      super.log(new Error("xCarousel class Initialized"));
    } else {
      super.log(new Error("Carousel Framework Not found, carousel not initialized"));
    }
  }
  get id() {
    //->string
    super.log(new Error("fetching property--id: " + this.#id));
    return this.#id;
  }
  get activeSlide() {
    let activeSlide = this.#carouselBody.getElementsByClassName("active")[0] || null;
    activeSlide != null
      ? super.log(new Error("fetching property--activeSlide: " + activeSlide))
      : super.log(new Error("active Slide not found"));
    return activeSlide;
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
      super.log(new Error("Carousel Slide Added with innerHTML: " + slideInner));
    } else {
      super.log(new Error("Carousel Framework Not Present, slide not added"));
    }
  }
}

class xKeyLog extends xUILog {
  #catalog;
  constructor(id = new xUITools().id /*(optional) string*/) {
    //-> xKeyLog
    super("xKeyLog", id);
    this.#catalog = {};
    super.log(new Error("xKeyLog class initialized"));
  }
  get catalog() {
    //-> JSON
    super.log(new Error("fetching property--catalog: " + JSON.stringify(this.#catalog)));
    return this.#catalog;
  }
  get toJSON() {
    //-> string
    let xPort = {};
    Object.keys(this.#catalog).forEach((key) => {
      xPort[key] = this.#catalog[key].log;
    });
    super.log(new Error("fetchgin property--toJSON: " + JSON.stringify(xPort)));
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
    super.log(new Error("xKeyListener class initialized"));
  }
  get logAllKeys() {
    //-> boolean
    super.log(new Error("fetching property--logAllKeys: " + this.#logAllKeys));
    return this.#logAllKeys;
  }
  get id() {
    //-> string
    super.log(new Error("fetching property--id: " + this.#id));
    return this.#id;
  }
  get log() {
    // -> array
    super.log(new Error("fetching property--log: " + this.#log));
    return this.#log;
  }
  set logAllKeys(value /*boolean*/) {
    //-> void
    this.#logAllKeys = value;
    super.log(new Error("property set--logAllKeys: " + value));
  }

  set action(value /*function*/) {
    //-> void
    this.#action = value;
    super.log(new Error("property set--action: " + value));
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
        this.#log.push(new xUITools().seconds + "|" + source + "|" + String.fromCharCode(key));
        this.#catalog = {};
        super.log(new Error("event detected--action fired based on keys: " + String.fromCharCode(null, this.#keys)));
      }
      if (this.#logAllKeys) {
        this.#log.push(new xUITools().seconds + "|" + source + "|" + String.fromCharCode(key));
      }
    };
    this.#listenerUp.setEvent();
    this.#listenerDown.setEvent();
    super.log(new Error("xKeyListener set: " + this.#id));
  }
}

class xExport extends xUILog {
  #type;
  #data;
  #element;
  #url;
  #fileName;
  constructor(data /*array, JSON*/, type /*string*/, fileName /*string*/, id = new xUITools().id /*string*/) {
    super("xExport", id);
    this.#data = data;
    this.#type = type;
    this.#fileName = fileName;
    this.#url = "No Url Set";
    this.#element = document.createElement("a");
    this.#element.style.display = "none";
  }
  get data() {
    //-> JSON
    super.log(new Error("fetching property --data: " + data));
    return this.#data;
  }
  get type() {
    //->string
    super.log(new Error("fetching property --type: " + this.#type));
    return this.#type;
  }
  get element() {
    //-> htmlElement
    super.log(new Error("fetching property --element: " + this.#element.tagName));
    return this.#element;
  }
  set element(value /*htmlElement*/) {
    this.#element = value;
    super.log(new Error("property set --element: " + this.#element.tagName));
  }
  prepare() {
    super.log(new Error("preparing file type: " + this.#type));
    switch (this.#type) {
      case "json":
        this.#prepare(JSON.stringify(this.#data), "application/json");
        break;
      case "text":
        typeof this.#data == "array"
          ? this.#prepare(this.#data.join("\n"), "text/csv")
          : this.#prepare(this.#data.toString());
        break;
      case "csv":
        let between = [...this.#data].join(",");
        this.#prepare(between.join("\n"), "text/csv");
        break;
      default:
        super.log(new Error("Type not recognized --type: " + this.#type));
    }
  }
  download() {
    this.#element.click();
    super.log(new Error("file download link clicked"));
  }
  #prepare(sData, sType) {
    let blob = new Blob([sData], { type: sType });
    this.#url = URL.createObjectURL(blob);
    this.#element.href = this.#url;
    this.#element.download = this.#fileName;
    super.log(new Error("file perpared --ready for download"));
  }
}
