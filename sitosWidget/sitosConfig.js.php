<?php
include_once( dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/include/inforum.inc' );
$eexcess_config = array('INFORUMROOT' => INFORUMROOT);
header("Content-type: application/javascript");
$json_config = json_encode($eexcess_config);
?>

var EEXCESS = EEXCESS || {};

EEXCESS.sitosWidget = {config:<?=$json_config;?>};