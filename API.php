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
        $statusMessage = 'DB Connection Failure';
        $data = array();
        $query = '';
        $errorDetails = 'DB Connection Failed, please contact administrator';
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
}



?>