var TemperatureSensor = function() {
    this.nodeID="";
    this.providerID="";
    this.consumerID="";
    this.sensorID="";
    this.type = 'Temperature';
    this.value="";
    this.unit = 'C';
    this.tStamp = Date.now();

}

var PressureSensor = function() {
    this.nodeID="";
    this.providerID="";
    this.consumerID="";
    this.sensorID="";
    this.type='Pressure';
    this.value="";
    this.unit='PSI';
    this.tStamp = Date.now();
}

var HumiditySensor =function() {
    this.nodeID="";
    this.providerID="";
    this.consumerID="";
    this.sensorID="";
    this.type='Humidity';
    this.value="";
    this.unit='KgM3';
    this.tStamp = Date.now();

}

var LocationSensor = function() {
    this.nodeID="";
    this.providerID="";
    this.consumerID="";
    this.sensorID="";
    this.type='Location';
    this.value="";
    this.unit='Deg.Min.Sec';
    this.tStamp = Date.now();

}

exports.TemperatureSensor=TemperatureSensor;
exports.PressureSensor=PressureSensor;
exports.HumiditySensor=HumiditySensor;
exports.LocationSensor=LocationSensor;