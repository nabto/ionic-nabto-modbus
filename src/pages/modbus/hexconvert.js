
var hexconvert = function() {

  bin2hex = function(str) {
    return parseInt(str, 2).toString(16).toUpperCase();
  };
    
  bin2dec = function(str) {
    return parseInt(str, 2).toString(10);
  };
  
  bin2float = function(str, precision) {
    return this.hex2float(this.bin2hex(str), precision);
  };

  hex2bin = function(str) {
    
    return parseInt(str, 16).toString(2);
  };

  hex2dec = function(str, signed) {
    var number = str;
    
    if (signed === undefined) {
      return parseInt(number,16);
    }
    if (number.substring(0,2) !== "0x") {
      number = "0x" + number;
    }
    if (signed === 16 && number > 32768) {
      number -= 65536;
    }
    else {
      if (signed === 32 && number > 2147483648) {
        number -= 4294967296;
      }
      else {
        number = parseInt(number,16);
      }
    }
    
    return number;
  };
  
    
  hex2float = function(str, precision) {
    var number = 0, sign, order, mantiss, exp, i;
    
    if (str.length <= 6) {
      exp = parseInt(str,16);
      sign = (exp >> 16)? -1:1;
      mantiss = (exp >> 12 & 255) - 127;
      order = ((exp & 2047) + 2048).toString(2);
      for (i = 0; i < order.length; i += 1) {
        number += parseInt(order[i],10)? Math.pow(2,mantiss):0;
        mantiss--;
      }
    }
    else if (str.length <= 10) {
      exp = parseInt(str,16);
      sign = (exp >> 31)? -1:1;
      mantiss = (exp >> 23 & 255) - 127;
      order = ((exp & 8388607) + 8388608).toString(2);
      for (i = 0; i < order.length; i += 1) {
        number += parseInt(order[i],10)? Math.pow(2,mantiss):0;
        mantiss--;
      }
    }
    
    if (precision === 0 || precision) {
      return (number * sign).toFixed(precision).toString(10);
    }
    return (number * sign).toString(10);
  };
    
  dec2bin = function(str) {
    return parseInt(str, 10).toString(2);
  };
  
  dec2hex = function(str, signed) {
    var number = str;
    
    
    if (number[0] === "-") {
      number = parseInt(number.substring(1),10);
      if (signed === 16) {
        number -= 65536;
      }
      else {
        if (signed === 32) {
          number -= 4294967296;
        }
      }
      number =- number;
    }
    else {
      number = parseInt(number,10);
    }
    if (signed) {
      return this.pad(number.toString(16).toUpperCase(), signed / 4);
    }
    return number.toString(16).toUpperCase();
  },
  
  dec2float = function(str) {
    return str + ".0";
  };
  
  
  float2bin = function(str) {
    var text = str, no, noa = [0], tmp, i, j, k, l, obj = {};
    
    no = parseFloat(text);
    text = text.toString().toLowerCase();
    
    
    obj.TEXT = text;
    obj.sign = ( text.indexOf('-') >= 0 ) ? '-' : '+';
    obj.e = ( text.indexOf('e') >= 0 ) ? 'e' + obj.sign : '';
    obj.TEXT_FLOAT = (obj.e) ? text.split(obj.e)[0] : text;
    obj.TEXT_EXP = (obj.e) ? text.split(obj.e)[1] : '0';
    text = obj.TEXT_FLOAT;
    tmp = text.split('.');
    obj.Num = Math.abs(tmp[0]);
    obj.Dec = (+( '0.' + ((tmp[1]) ? tmp[1] : '0' )));
    obj.Exp = (obj.e) ? parseInt( obj.TEXT.split( obj.e )[1], 10) : 127;
    obj.Exp += (obj.e && obj.sign === "+") ? 127 : 0;
    text = (obj.e) ? text.split(obj.e)[0] : text;
    
    noa[0] = ( obj.sign === '-' ) ? 1 : 0;
    tmp = obj.Num;
    obj.Num = (obj.Num);
    no = obj.Dec;
    tmp = tmp.toString(2) + '.';
    for ( i = tmp.length; (i < 32 && no > 0); i++ ) {
      no *= 2;
      text = ('' + no).split('.')[0];
      no -= (+text);
      tmp += text;
    }
    j = 0;
    i = tmp.indexOf('.');
    text = tmp;
    l = i;
    if (obj.Num > 0) {
      for (i--, k = i; i > -1; i--) {
        if (tmp[i] === '1') {
          k = i;
        }
      }
      j = (l - 1) - k;
    }
    else {
      for (i++, k = i; i < tmp.length; i++) {
        if (tmp[i] === '1') {
          k = i - 1;
          j = i - l;
          i = tmp.length;
        }
      }
      j = -j;
    }
    
    no = (obj.e) ? 0 : j;
    obj.Exp += no;
    tmp = obj.Exp.toString(2);
    for ( i = 8, j = (tmp.length - 1); i > 0; i--, j-- ) {
      noa[ i ] = ( tmp[ j ] ) ? tmp[j] : '0';
    }
    
    tmp = text.replace('.', '');
    for ( i = 9, j = k + 1; i < 32; i++, j++ ) {
      noa[i] = (tmp[j]) ? tmp[j] : '0';
    }
    return noa.join("");
  };

  float2hex = function(str) {
    return this.bin2hex(this.float2bin(str));
  };
  
  float2dec = function(str) {
    return str.split(".")[0];
  };

  hex2ascii = function(str, shift) {
    var out = "", i;
    
    if (shift) {
      for (i = 0; i < str.length; i += 4) {
        if (str[i + 2]) {
          out += String.fromCharCode(parseInt(str.substr(i + 2, 2), 16));
        }
        out += String.fromCharCode(parseInt(str.substr(i, 2), 16));
      }
    }
    
    else {
      for (i = 0; i < str.length; i += 2) {
        out += String.fromCharCode(parseInt(str.substr(i, 2), 16));
      }
    }
    return out;
  };
  
  ascii2hex = function(str, shift) {
    var out = "", i;
    if (shift) {
      for (i = 0; i < str.length; i += 2) {
        if (str[i + 1]) {
          out += this.dec2hex(str.charCodeAt(i + 1).toString());
        }
        out += this.dec2hex(str.charCodeAt(i).toString());
      }
    }
    
    else {
      for (i = 0; i < str.length; i++) {
        out += this.dec2hex(str.charCodeAt(i).toString());
      }
    }
    return out;
  };
  
  ascii2dec = function(str, shift) {
    var out = "", i;
    if (shift) {
      for (i = 0; i < str.length; i += 2) {
        if (str[i + 1]) {
          out += str.charCodeAt(i + 1).toString();
        }
        out += str.charCodeAt(i).toString();
      }
    }
    
    else {
      for (i = 0; i < str.length; i++) {
        out += str.charCodeAt(i).toString();
      }
    }
    return out;
  };
  
  bool = function(str) {
    return (/^true|1$/i).test(str);
  };
  
  decimal = function(str, position) {
    if (isNaN(str)) {
      return [str.slice(0, str.length - position), ".", str.slice(str.length - position, str.length)].join("");
    }
    else {
      if (str.indexOf(".") !== -1) {
        var pos = str.indexOf(".");
        if (str.indexOf("-") !== -1) {
          pos--;
        }
        return (str / Math.pow(10, position)).toFixed(position + pos).toString(10);
      }
      return (str / Math.pow(10, position)).toFixed(position).toString(10);
    }
  };

  pad = function(str, length, padStr, left) {
    padStr = padStr || "0";
    while (str.length < length) {
      if (left) {
        str = str + padStr;
      }
      else {
        str = padStr + str;
      }
    }
    return str;
  };
  return {
    "bin2hex" : bin2hex,
    "bin2dec" : bin2dec,
    "bin2float" : bin2float,
    "hex2bin" : hex2bin,
    "hex2dec" : hex2dec,
    "hex2float" : hex2float,
    "dec2bin" : dec2bin,
    "dec2hex" : dec2hex,
    "dec2float" : dec2float,
    "float2bin" : float2bin,
    "float2hex" : float2hex,
    "float2dec" : float2dec,
    "hex2ascii" : hex2ascii,
    "ascii2hex" : ascii2hex,
    "ascii2dec" : ascii2dec,
    "pad" : pad
  }
  

}();

// Run with:  node -e 'require("./hexconvert.js").unittest()'
module.exports.unittest = function () {
  var test_dec1 = 11111;
  var test_dec2 = 111;
  var test_float1 = 1111198765.12345;
  var test_float2 = 98765.12345;
  console.log("dec2hex hex2dec test 1:" + ((hexconvert.hex2dec(hexconvert.dec2hex(test_dec1)) == test_dec1)?"pass":"fail"));
  console.log("dec2hex hex2dec test 2:" + ((hexconvert.hex2dec(hexconvert.dec2hex(test_dec2)) == test_dec2)?"pass":"fail"));
  console.log("float2hex hex2float test 1:" + test_float1 + "=~" + hexconvert.hex2float(hexconvert.float2hex(test_float1)));
  console.log("float2hex hex2float test 1:" + (((hexconvert.hex2float(hexconvert.float2hex(test_float1)) - test_float1) < test_float1/10000000)?"pass":"fail"));
  console.log("float2hex hex2float test 2:" + test_float2 + "=~" + hexconvert.hex2float(hexconvert.float2hex(test_float2)));
  console.log("float2hex hex2float test 2:" + (((hexconvert.hex2float(hexconvert.float2hex(test_float2)) - test_float2) < test_float2/10000000)?"pass":"fail"));
  console.log("dec2hex hex2dec test:" + hexconvert.dec2hex(11111));
  console.log("dec2hex hex2dec test:" + hexconvert.pad(hexconvert.dec2hex(111),4));
  console.log("dec2hex hex2dec test:" + hexconvert.float2hex(test_float1));
};  

module.exports.hexconvert = hexconvert;

