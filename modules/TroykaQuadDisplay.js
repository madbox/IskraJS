/*
Модуль для работы с http://amperka.ru/product/troyka-rtc
Принцип работы со сдвиговым регистром через 1 сигнальный канал
описан тут: http://www.romanblack.com/shift1.htm
длительности импульсов отсюда https://github.com/amperka/QuadDisplay/blob/master/QuadDisplay.cpp 


Usage:

'''
var myQuad = require('TroykaQuadDisplay').connect(P8); // quad Display Pin
myQuad.displayDigits(1,2,3,4);
myQuad.displayTemperatureC(26);
'''
*/

var BITMAPS = {
  '0': 0b00000011, // 0
  '1': 0b10011111, // 1
  '2': 0b00100101, // 2
  '3': 0b00001101, // 3
  '4': 0b10011001, // 4
  '5': 0b01001001, // 5
  '6': 0b01000001, // 6
  '7': 0b00011111, // 7
  '8': 0b00000001, // 8
  '9': 0b00001001, // 9
  '-': 0b00001001,
  ' ': 0b11111111,
  '.': 0b11111110,
  '-': 0b11111101,
  '_': 0b11101111,
  'degree': 0b00111001,
  // Добавлены символя только для отображения hex значений, другие "буквы" не добавлены в целях экономии памяти.
  'A': 0b00010001,
  'B': 0b11000001,
  'C': 0b01100011,
  'D': 0b10000101,
  'E': 0b01100001,
  'F': 0b01110001
}

// Конструктор
function TroykaQuadDisplay(pin){
  this.pin = pin;
}

// Рекурсивно генерируем массив длинн импульсов
TroykaQuadDisplay.prototype.digitToPulseLengths = function(digit, deepness, arr) {
  if (typeof(arr)==='undefined') arr = Array();
  if (typeof(deepness)==='undefined') deepness = 8; // По умолчанию расчитываем на 8-ми битное число в digit, т.е. 0-255

  if ((digit & 0b1) == 1)
    { arr.push(0.001); arr.push(0.03); }
  else
    { arr.push(0.015); arr.push(0.06); }

  if (deepness > 1) return( this.digitToPulseLengths(digit >> 1, deepness - 1, arr) );
  return arr;
};

TroykaQuadDisplay.prototype.test = function(){
  var quad = this;
  var counter = 0;
  for (var i in BITMAPS) {
    if (BITMAPS.hasOwnProperty(i)) {
      setTimeout(function(k){
        print(k, ": ", BITMAPS[k]);
        quad.displayDigits(k,k,k,k);
      },counter * 1000, i);
    }
    counter++;
  }
};

TroykaQuadDisplay.prototype.clear = function() {
  this.displayDigits(' ',' ',' ',' ');
};

TroykaQuadDisplay.prototype.displayDigits = function(a, b, c, d){
  pin = this.pin;
  // склееваем массивы длительностей импульсов всех четырех цифр в один
  // и прибавляем импульс "защелки" (latch)
  lengths = this.digitToPulseLengths(BITMAPS[a]).concat(
            this.digitToPulseLengths(BITMAPS[b]),
            this.digitToPulseLengths(BITMAPS[c]),
            this.digitToPulseLengths(BITMAPS[d]),
            [0.06,0.3]
  );

  setTimeout(digitalPulse, 1, pin, 0, lengths);
};

/* TODO
TroykaQuadDisplay.prototype.displayInt = function(val, padZeros, dots){

}

TroykaQuadDisplay.prototype.displayFloat = function(val, precision, padZeros){

}
*/

TroykaQuadDisplay.prototype.displayTemperatureC = function(val){
  var v = Math.round(val);
  this.displayDigits( Math.floor(v/100)>0 ? Math.floor(v/100) : ' ',
                      Math.floor(v/10),
                      v % 10,
                      'degree');
}

// Create an instance of TroykaQuadDisplay 
exports.connect = function(pin) {
  return new TroykaQuadDisplay(pin);
};
