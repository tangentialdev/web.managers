//Intentionally JSON formated as string -- On server housing change this to a full JSON file by removing the variable declaration
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class xConfiguration {
  #UI_LOGGING_ENABLED;
  #QUEUE_LOGGING_ENABLED;
  #ERROR_LOG_DOCUMENT_ID;
  constructor() {
    this.#UI_LOGGING_ENABLED = true;
    this.#QUEUE_LOGGING_ENABLED = true;
    this.#ERROR_LOG_DOCUMENT_ID = "offcanvas-error-log";
  }
  get UI_LOGGING_ENABLED() {
    return this.#UI_LOGGING_ENABLED;
  }
  get QUEUE_LOGGING_ENABLED() {
    return this.#QUEUE_LOGGING_ENABLED;
  }
  get ERROR_LOG_DOCUMENT_ID() {
    return this.#ERROR_LOG_DOCUMENT_ID;
  }
}
