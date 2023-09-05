class xUITools{
    constructor(){
    }
    get id(){ //string
        return (new Date.getTime() + Math.random()*10000).toString(16);
    }
}

class xUILog {
    #source; #loggingEnabled; #frame; #id; #log;
    constructor(source/*string*/){ //->  #void
        this.#source = source;
        this.#log = [];
        this.#loggingEnabled = false; 
        this.#id = new xUITools().id;
        this.#frame = document.createElement('div');
        this.#frame.innerHTML = '<div class=\"error-wrapper\">' + //Need to add Bootstrap classes to this
                                    '<div class=\"log-header\">'
                                        '<div class=\"log-length\">'+ this.#log.length + 
                                        '</div>' +
                                        '<div class=\"source\">' + this.#source + 
                                        '</div>' +
                                        '<div class=\"id\">' + this.#id + 
                                        '</div>' +
                                    '</div>' +
                                    '<div class=\"log-body\">'+
                                        '<table class=\"table table-striped\">' +
                                            '<thead>' +
                                                '<tr>' +
                                                    '<th> L_Num </th>' +
                                                    '<th> message </th>' +
                                                    '<th> Raw Error </th>'+
                                                '</tr>' +
                                            '</thead>'+
                                            '<tbody class=\"error-table-body\">' +
                                            '</tbody>' +
                                        '</table>' +
                                    '</div>' +
                                '</div>';
        console.log(this.#frame);
    }
    get source(){ //-> htmlElement
        return this.#source;
    }
    get frame(){ //-> htmlElement
        return this.#frame;
    }
    get loggingEnabled(){ //-> boolean
        return this.#loggingEnabled;
    }
    set loggingEnabled(value /*boolean*/){ //-> void
        this.#loggingEnabled = value;
    }
    log(msg /*string || JSON*/){ //-> void
        this.#log.push(msg);
        let entry = document.createElement('tr');
        entry.innerHTML = '<td>' + msg.lNum + '</td>' +
                        '<td>' + msg.msg + '</div>';
        this.#frame.getElementsByClassName("error-table-body")[0].appendChild(entry);
    }
}

class xUIThread extends xUILog {
    #threadMain; #queue;
    constructor(){
        super('xUIThread');
        this.#threadMain = async () => {};
        this.#queue = [];
    }
    add(arg){ //-> anonymous function
        this.#queue.push(arg);
    }
    start(){ //-> void
        this.#threadMain().then(()=>{
            this.#queue.forEach((f) => {
                f();
            });
        }).catch((error)=>{
            super.log(error);
        })
    }

}

class xHttpRequest extends xUILog {
    #request; #requestType; #requestUrl; #responseBody; #data;
    constructor(requestType /*string*/, requestUrl /*string*/){ //-> void
        super('xHttpRequest');
        this.#requestType = requestType;
        this.#requestUrl = requestUrl;
        this.#data = '{}';
    }
    get requestType(){ //-> string
        return this.#requestType;
    }
    get requestUrl(){ //-> string
        return this.#requestUrl;
    }
    get responseBody(){ //-> anonymous function
        return this.#responseBody;
    }
    get data(){ //-> string
        return this.#data;
    }
    get promise(){  //-> promise
        return this.#request;
    }
    set responseBody(value /*function*/){ //-> void
        this.#responseBody = value;
    }
    set data(value /*JSON*/){ //-> void
        this.#data = JSON.stringify(value);
    }
    async send(){ //-> void
        this.#request = await new fetch(
            this.#requestUrl, 
                { Method: this.#requestType,
                    Headers: {
                    Accept: 'application.json',
                    'Content-Type': 'application/json'
                    },
                    Body: this.#data,
                    Cache: 'default'
                }).then((r)=> {
                    return r.json()
                }).then((data) =>{
                    this.#responseBody(data);
                }).catch((error)=>{
                    super.log(error);
                });
    }

}

class xExRef extends xUILog{
    #tagName; #src; #parent; #request; #element; #actionQueue;
    constructor(tagName /*string*/, src /*string*/, parent /*htmlElement*/){ //-> void
        super('xExref');
        this.#tagName = tagName;
        this.#src = src;
        this.#parent = parent;
        this.#element = document.createElement(this.#tagName);
        this.#request = new xHttpRequest('GET', this.#src);
        this.#actionQueue = [];
    }
    get tagName(){ //-> string
        return this.#tagName;
    }
    get src(){ //-> string
        return this.#src;
    }
    get parent(){ //-> htmlElement
        return this.#parent;
    }
    get element(){ //-> htmlElement
        return this.#element;
    }
    get actionQueue(){ //-> array
        return this.#actionQueue;
    }
    addAction(value /*anonymous function */){ //-> void
        this.#actionQueue.push(value);
    }
    async append(){ //-> void
        this.#request = this.#responseBody;
        this.#request.send().then(()=>{
            this.#action().catch((error)=>{
                super.log(error);
            });
        });
    }
    #responseBody(data /*string*/){ // -> void
        this.#element.innerHTML = data;
    }
    async #action(){
        if (this.#actionQueue.length >= 1){ // add in if something is async use then, otherwise use inline
            this.actionQueue[0]();
            this.#actionQueue.unshift();
            this.actionQueue.length > 1 ?  this.#action().catch((error)=>{
                super.log(error);
            }): '';
        }
    }
    
}

class xFormElement extends xUILog{
    #element; #tagName; #visible;
    constructor(element /*htmlElement*/, override='' /*string*/){ //-> void
        super('xFormElement');
        this.#element = element;
        this.#tagName = (override != '') ? override : this.#element.tagName;
        this.#visible = !(this.#element.style.display == 'none');
    }
    get element(){ //-> htmlElement
        return this.element;
    }
    get tagName(){ //-> string
        return this.#tagName;
    }
    get value(){ //-> string
        return this.#getValue();
    }
    set value (value /*string*/){ //-> void
        this.#setValue(value);
    }
    toggle(){
        (this.#visible) ? this.#element.style.display = 'none': this.#element.style.display = '';
    }
    #getValue(){ //Need to Finish
        switch(this.#tagName){
            case 'SELECT':
                return this.#element.value;
                break;
            case 'input':
                return this.#element.value;
                break;
            case 'button':
                return this.#element.innerText;
                break;
            default:
                return this.#element.innerText;
                break;
        }
    }
    #setValue(value /*string*/){ //Need to Finish
        switch(this.#tagName){
            case 'select':
                this.#element.value = value;
                break;
            case 'input':
                this.#element.value = value;
                break;
            case 'button':
                this.#element.innerText = value;
                break;
            default:
                this.#element.innerText = value;
                break;
        }
    }
}

class xForm extends xUILog{
    #wrapper; #visible; #catalog;
    constructor(wrapper /*htmlElement*/){ //-> void
        super('xForm');
        this.#wrapper = wrapper;
        this.#visible = !(this.wrapper.style.display == 'None');
        this.#catalog = {};
    }
    get wrapper(){ //-> htmlElement
        return this.#wrapper;
    }
    get visible(){ //-> boolean
        return this.#visible;
    }
    set visible(value/*boolean*/){ //-> void
        (value) ? this.#wrapper.style.display = 'none': this.#wrapper.style.display ='';
        this.#visible = value;
    }
    toggle(){ //-> void
        (this.#visible) ? this.#wrapper.style.display = 'none': this.#wrapper.style.display ='';
        this.#visible = (this.#visible) ? false: true; 
    }
    addElement(id /*string*/, formElement /*xFormElement*/){ //-> void DO I WANT THIS TO BE HTML ELEMENT OR FOR ELEMENT
        this.#catalog[id] = formElement;
    }
    getElement(id /*string*/) { //-> xFormElement
        let nullElement = document.createElement('div');
        nullElement.innerText = 'ID Not Found, blank Form Element Generated';
        return (id in this.#catalog) ? this.#catalog[id] : new xFormElement(nullElement);
    }
}

class xHTMLPane extends xUILog{
    #visible; #element;
    constructor(element /*htmlElement*/){ //-> void
        super('xHTMLPane');
        this.#element = element;
        this.#visible = !(this.#element.style.display == 'none');
    }
    get visible(){ //-> boolean
        return this.#visible;
    }
    set visible(value /*boolean*/){ //-> void
        this.#visible = value;
        (value) ? this.#element.style.display = '' : this.#element.style.display = 'None';
    }
    activate(){ //-> void
        this.#visible = true;
        this.#element.style.display = '';
    }
    hide(){ //-> void
        this.#visible = false;
        this.#element.style.display = 'none';
    }
}

class xHTMLPane_Trigger extends xUILog{
    #element; #event;
    constructor(element){ //-> void
        super('xHTMLPane_Trigger');
        this.#element = element;
        this.#event;
    }
    get element(){ //-> htmlElement
        return this.#element;
    }
    get event(){//-> xEventListener
        return this.#event;
    }
    set event(value /*xEventListener*/){//-> void
        this.#event = value;
    }


}

class xHTMLPane_Manager extends xUILog{
    #catalog; #activePane;
    constructor(){ //-> void
        super('xHTMLPane_Manger');
        this.#catalog = {};
        this.#activePane;
    }
    get catalog(){ //-> JSON
        return this.#catalog;
    }
    getItem(key /*string*/){ //-> xHTMLPane
        return this.#catalog[key];
    }
    setItem(key /*string*/, value /*xHTMLPane*/){ //-> void
        this.#catalog[key] = value;
    }
    activate(key /*string*/){ //-> void
        this.#activePane.hide();
        this.#catalog[key].activate();
        this.#activePane = this.#catalog[key];
    }
    
}

class xEventListener extends xUILog{
    #element; #type; #event;
    constructor(element /*htmlElement*/, type /*string*/){ //-> void
        super('xEventListener');
        this.#element = element;
        this.#type = type;
        this.#eventAction = () => {};
        this.#event;
    }
    get element(){ //-> htmlElement;
        return this.#element;
    }
    get type(){ //-> string;
        return this.#type;
    }
    get eventAction(){ //-> function
        return this.#eventAction;
    }
    set eventAction(value /*function*/){
        this.#eventAction = value;
    }
    setEvent(){ //-> void
        this.#event = this.#element.addEventListener(this.#type, this.#eventAction);
    }
    removeEvent(){ //-> void
        this.#element.removeEventListener(this.#type, this.#event);
    }
}