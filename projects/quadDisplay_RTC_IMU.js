var qDP = P8; // quad Display Pin

var myQuad = require('TroykaQuadDisplay').connect(qDP);

// Настраиваем светодиод, чтобы отмечал секунды

var myLed = require('@amperka/led').connect(P9);
myLed.blink(0.3, 0.7);

// Настраиваем шину I2C
PrimaryI2C.setup({sda: SDA, scl: SCL, bitrate: 100000});

// ----------------------
// Часы реального времени

// Создаем новый объект Rtc
var rtc = require('@amperka/rtc').connect(PrimaryI2C);
// Устанавливаем на часах текущее время контроллера
// rtc.setTime();

function updateTime() {
  date = rtc.getTime();

  minutes = date.getMinutes();
  hours = date.getHours();
  
  myQuad.displayDigits(Math.floor(hours/10), hours % 10,
                       Math.floor(minutes/10), minutes % 10);
}

setInterval(updateTime, 1000);

// ----------------------
// Барометр
print("Initializing barometer");

var baro = require('@amperka/barometer').connect(PrimaryI2C);

baro.init();
print(baro.read());
print(baro.read('Pa'));
print(baro.read('mmHg'));
 
print(baro.temperature());
print(baro.temperature('C'));

// ----------------------
// Акселерометр
print("Initializing accelerometer");

// Подключаем модуль
var accel = require('@amperka/accelerometer').connect(PrimaryI2C);
 
// Инициализируем модуль
accel.init();

//setInterval(function(){
  // Отображаем силы, действующие на акселерометр
  print(accel.read('G'));
//}, 500);

// шорткаты для вызова функций из консоли
Object.rtc = rtc;
Object.accel = accel;
Object.baro = baro;
Object.myQuad = myQuad;

interval1 = setInterval(function(){
  print("Repeat!");
  print(accel.read('G'));
},500);

setTimeout(function(){
  clearInterval(interval1);
  print("Stop!");
}, 5000);
