var noble = require('noble');

const HEART_RATE_SERVICE_UUID = '180d';
const HEART_RATE_CHARACTERISTICS_UUID = '2a37';

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  // My tickr, shhh
  // Will fix this at somepoint
  if (peripheral.id === 'd7046c50aa65') {
    console.log('peripheral ' + peripheral.advertisement.localName + ' found ' + peripheral.id);
    connect(peripheral);
  }
});

function connect(peripheral) {
  peripheral.connect(error => {
    console.log(error);
    peripheral.discoverSomeServicesAndCharacteristics([HEART_RATE_SERVICE_UUID], [HEART_RATE_CHARACTERISTICS_UUID], (error, services, characteristics) => {
        var hr = characteristics[0];

        hr.on('data', function(data, isNotification) {
          // 🤘
          console.log(parseHeartRateData(data));
        });

        hr.subscribe(function(error) {
          console.log('heart rate notification on');
        });
    })
  });
}

// CBA to write this, lifted from https://github.com/chbrown/BluetoothLE-HeartRate
function parseHeartRateData(data) {
  // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.characteristic.heart_rate_measurement.xml&u=org.bluetooth.characteristic.heart_rate_measurement.xml
  let cursor = 0
  function readNext(byteLength) {
    const value = (byteLength > 0) ? data.readUIntLE(cursor, byteLength) : undefined
    cursor += byteLength
    return value
  }
  // the first byte of data is the mandatory "Flags" value,
  // which indicates how to read the rest of the data buffer.
  const flags = readNext(1)
  // 0b00010110
  //          ^ 0 => Heart Rate Value Format is set to UINT8. Units: beats per minute (bpm)
  //            1 => Heart Rate Value Format is set to UINT16. Units: beats per minute (bpm)
  //        ^^ 00 or 01 => Sensor Contact feature is not supported in the current connection
  //           10       => Sensor Contact feature is supported, but contact is not detected
  //           11       => Sensor Contact feature is supported and contact is detected
  //       ^ 0 => Energy Expended field is not present
  //         1 => Energy Expended field is present (units are kilo Joules)
  //      ^ 0 => RR-Interval values are not present
  //        1 => One or more RR-Interval values are present
  //   ^^^ Reserved for future use
  const valueFormat =          (flags >> 0) & 0b01
  const sensorContactStatus =  (flags >> 1) & 0b11
  const energyExpendedStatus = (flags >> 3) & 0b01
  const rrIntervalStatus =     (flags >> 4) & 0b01

  const bpm = readNext(valueFormat === 0 ? 1 : 2)
  const sensor = (sensorContactStatus === 2) ? 'no contact' : ((sensorContactStatus === 3) ? 'contact' : 'N/A')
  const energyExpended = readNext(energyExpendedStatus === 1 ? 2 : 0)
  const rrSample = readNext(rrIntervalStatus === 1 ? 2 : 0)

  // https://help.elitehrv.com/article/67-what-are-r-r-intervals
  // RR-Interval is provided with "Resolution of 1/1024 second"
  const sampleCorrection = 1000.0 / 1024.0 // = 0.9765625
  const rr = rrSample && (rrSample * sampleCorrection) | 0
  return {bpm, sensor, energyExpended, rr}
}
