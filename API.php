<?php
require '_core.php';

//parent::__construct($o, $m);
class xBase {
    function __construct(){
        session_start();
        $this->request = new xRequest();
        $this->database = new xDB();
        $this->querries = new xQuerries();
        $this->response = new xResponse();
        $this->result = '';
    }
    public function connectionFailure(){
        $requestType = $this->request->requestType;
        $status = 504;
        $statusMessage = $this->database->databaseName . " Connection Failure";
        $data = array();
        $query = '';
        $errorDetails = $this->database->databaseName . " Connection Failed, please contact administrator";
        $this->response->updateResponse($requestType, $status, $statusMessage, $data, $query, $errorDetails);
        return $this->response->response;
    }
    public function tableToArray(){
        $xReturn = array();
        while($row = $this->result->fetch_assoc()) {
            $xReturn[] = $row;
        }
        return $xReturn;
    }
    public function __get($name){
        switch($name){
            case 'request':
                return $this->request();
            case 'database':
                return $this->database();
            case 'querries':
                return $this->querries();
            case 'response':
                return $this->response();
            case 'result':
                return $this->result();
        }
    }
    private function request(){
        return $this->request;
    }
    private function database(){
        return $this->database;
    }
    private function querries(){
        return $this->querries;
    }
    private function response(){
        return $this->response;
    }
    private function result(){
        return $this->result;
    }
}



?>