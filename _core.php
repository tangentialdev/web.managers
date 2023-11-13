<?php
    class xDB{
        //password_hash(PASSWORD_DEFAULT) -> used for hashing passwords. Want to see where I should best do this
        //create logging
        private $serverName; 
        private $username; 
        private $password; 
        private $databaseName; 
        private $conn;
        private $connSuccess;

        function __construct(){
            $this->serverName = 'placeholder';
            $this->username = 'placeholder';
            $this->password = 'placeholder';
            $this->databaseName = 'placeholder';
            $this->conn = new mysqli($this->serverName, $this->username,$this->password, $this->databaseName);
            $this->connSuccess = !$this->conn->connect_error ;
        }
        public function __get($name){
            switch($name){
                case 'serverName':
                    return $this->serverName();
                case 'username':
                    return $this->username();
                case 'password':
                    return $this->password();
                case 'databaseName':
                    return $this->databaseName();
                case 'conn':
                    return $this->conn();
                case 'connSuccess':
                    return $this->connSuccess();
            }
        }
        private function serverName(){
            return $this->serverName;
        }
        private function username(){
            return $this->username;
        }
        private function password(){
            return $this->password;
        }
        private function databaseName(){
            return $this->databaseName;
        }
        private function conn(){
            return $this->conn;
        }
        private function connSuccess(){
            return $this->connSuccess;
        }
    }
    
    class xRequest{
        private $requestType;
        function __construct(){
            $this->requestType = $_SERVER['REQUEST_METHOD'];
            if ($this->requestType === 'POST'){
                $_POST = json_decode(file_get_contents("php://input"), true);
            }
        }
        public function __get($name){
            switch($name){
                case 'requestType':
                    return $this->requestType();
            }
        }
        private function requestType(){
            return $this->requestType;
        }
    }
    
    
    class xResponse{
        private $response;
        private $debug;
        function __construct(){
            $this->debug = true;
            $this->response = array(
                'requestType'=> 'None',
                'status' => 900,
                'statusMessage' => 'None',
                'data' => '',
                'query' => 'None',
                'errorDetails' => 'None',
            );
            //Add in Cookie managing here ------------
        }
        public function __SET($name, $value){
            switch($name){
                case 'requestType':
                    $this->requestType($value);
                case 'status':
                    $this->status($value);
                case 'statusMessage':
                    $this->statusMessage($value);
                case 'data':
                    $this->data($value);
                case 'query':
                    $this->query($value);
                case 'errorDetails':
                    $this->errorDetails($value);
            }
        }
        public function __get($name){
            switch($name){
                case 'response':
                    return $this->response();
                case 'debug':
                    $this->debug();
            }
        }
        public function UpdateResponse($requestType, $status, $statusMessage, $data, $query, $errorDetails){
            $this->requestType = $requestType;
            $this->status = $status;
            $this->statusMessage = $statusMessage;
            $this->data = $data;
            if($this->debug){
                $this->query = $query;
            }else {
                $this->query = '';
            }
            $this->errorDetails = $errorDetails;
        }
        //Private Methods ------------------------------------------
        private function requestType($value){
            $this->response['requestType'] = $value;
        }
        private function status($value){
            $this->response['status'] = $value;
        }
        private function statusMessage($value){
            $this->response['statusMessage'] = $value;
        }
        private function data($value){
            $this->response['data'] = $value;
        }
        private function query($value){
            if ($this->debug){
                $this->response['query'] = $value;
            }else{
                $this->response['query'] = '';
            }
        }
        private function errorDetails($value){
            $this->response['errorDetails'] = $value;
        }
        private function response(){
            return $this->response;
        }
        private function debug(){
            return $this->debug;
        }
    }

    class xQuerries{
        private $login;
        function __construct(){
            $this->login = 'SELECT xPassword FROM xUsers WHERE xUsername=' . "'" . ($_POST['USERNAME'] ?? NULL). "';"; //Shorthand to handle null occurences in array
        }
        public function __get($name){  //Doesn't feel like the private functions are needed. Will have to test
            switch($name){
                case 'login':
                    return $this->login();
            }
        }
        private function login(){
            return $this->login;
        }
        
    }
?>