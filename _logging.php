<?php
    class xlogging {
        private $source;
        function __construct($source /*string*/){
            $this->source = $source;

        }
       
        public function __get($name){
            switch($name){
                case 'toJSON':
                
            }
        }

        public function log($msg){

        }
    }


?>