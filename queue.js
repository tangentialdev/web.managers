class queue {
    #queue; #stagingQueue;
    constructor(){
        this.#queue = [];
        this.#stagingQueue = [];
        this.#maxThreads = 50;
    }
    get maxThreads(){ //-> int
        return this.#maxThreads;
    }
    set maxThreads(value){
        this.#maxThreads = value;
    }
    add(func /*function*/){//-> void
        (this.#queue.length < this.#maxThreads) ? this.#queue.push(func): this.#stagingQueue.push(func);
    }
    start(){
        this.#queue[0]().then(()=>{
            this.#queue.unshift();
            this.#cycle();
        })
    }
    #cycle(){
        for (i = this.#queue.length - 1; i < this.#maxThreads; i++) {
            this.#queue.push(this.#stagingQueue.unshift());
          let p =  this.#queue[i]().then(()=>{
              this.#queue.indexof(p).remove();
              (this.#queue.length >0 || this.#stagingQueque.length >0) ? this.#cycle(): '';
            })
        }
        
    }

}