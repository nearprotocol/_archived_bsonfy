///////////////////////////////////////////////////////////////////////////////
// \author (c) Marco Paland (marco@paland.com)
//             2016-2018, PALANDesign Hannover, Germany
//
// \license The MIT License (MIT)
//
// This file is part of the bsonfy library.
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORTtort  OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
///////////////////////////////////////////////////////////////////////////////


/**
 * Private, assemble BSON cstring element
 * @param name
 * @param buffer
 * @param offset
 * @return Element length in bytes
 */
export function cstring(name: string, buffer: Uint8Array, offset: number): number {
  let cstring = str2bin(name);
  let clen = cstring.length;
  buffer.set(cstring, offset);
  buffer[offset + clen++] = 0;
  return clen;
}


/**
 * Private, assemble BSON int32 element
 * @param size
 * @param buffer
 * @param offset
 * @return Element length in bytes
 */
export function int32(size: number, buffer: Uint8Array, offset: number): number {
  buffer[offset++] = (size)        & 0xff;
  buffer[offset++] = (size >>>  8) & 0xff;
  buffer[offset++] = (size >>> 16) & 0xff;
  buffer[offset++] = (size >>> 24) & 0xff;
  return 4;
}


/////////////////////////////////////////////////////////////////////////////
// H E L P E R

/**
 * Convert a number to a 64 bit integer representation
 * @param {Number} value Number to convert
 * @return {Uint8Array} Converted number
 */
export function number2long(value: number): Uint8Array {
  let buf = new Uint8Array(8);
  if (Math.floor(value) === value) {
    const TWO_PWR_32 = 4294967296;
    let lo = (value % TWO_PWR_32) | 0, hi = (value / TWO_PWR_32) | 0;
    if (value < 0) {
      lo = ~(-value % TWO_PWR_32) | 0, hi = ~(-value / TWO_PWR_32) | 0;
      lo = (lo + 1) & 0xffffffff;
      if (!lo) hi++;
    }
    let i = 0;
    buf[i++] = (lo & 0xff); buf[i++] = (lo >>> 8) & 0xff; buf[i++] = (lo >>> 16) & 0xff; buf[i++] = (lo >>> 24) & 0xff;
    buf[i++] = (hi & 0xff); buf[i++] = (hi >>> 8) & 0xff; buf[i++] = (hi >>> 16) & 0xff; buf[i]   = (hi >>> 24) & 0xff;
  }
  else {    // it's a float / double
    let f = new Float64Array([value]);
    let d = new Uint8Array(f.buffer);
    buf.set(d);
  }
  return buf;
}


/**
 * Convert 64 bit integer to Number
 * @param {Uint8Array} buffer Buffer containing a 64 bit integer as typed array at offset position. LSB is [0], MSB is [7]
 * @param {Number} offset Offset in buffer, where the integer starts
 * @return {Number} Converted number
 */
export function long2number(buffer: Uint8Array, offset: number = 0): number {
  const TWO_PWR_32 = 4294967296;
  let lo = buffer[offset++] | buffer[offset++] << 8 | buffer[offset++] << 16 | buffer[offset++] << 24;
  let hi = buffer[offset++] | buffer[offset++] << 8 | buffer[offset++] << 16 | buffer[offset]   << 24;
  return hi * TWO_PWR_32 + ((lo >= 0) ? lo : TWO_PWR_32 + lo);
}


/**
 * Convert a string (UTF-8 encoded) to a byte array
 * @param {String} str UTF-8 encoded string
 * @return {Uint8Array} Byte array
 */
export function str2bin(str: string): Uint8Array {
  str = str.replace(/\r\n/g, '\n');
  let bin = [], p = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      bin[p++] = c;
    } else if (c < 2048) {
      bin[p++] = (c >>> 6) | 192;
      bin[p++] = (c & 63) | 128;
    } else {
      bin[p++] = (c >>> 12) | 224;
      bin[p++] = ((c >>> 6) & 63) | 128;
      bin[p++] = (c & 63) | 128;
    }
  }
  return new Uint8Array(bin);
}


/**
 * Convert a byte array to an UTF-8 string
 * @param {Uint8Array} bin UTF-8 text given as array of bytes
 * @return {String} UTF-8 Text string
 */
export function bin2str(bin: Uint8Array): string {
  let str = '', len = bin.length, i = 0, c, c2, c3;

  while (i < len) {
    c = bin[i];
    if (c < 128) {
      str += String.fromCharCode(c);
      i++;
    }
    else if ((c > 191) && (c < 224)) {
      c2 = bin[i + 1];
      str += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    }
    else {
      c2 = bin[i + 1];
      c3 = bin[i + 2];
      str += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return str;
}


/**
 * Returns the UTF-8 string length in bytes
 * @param {String} Input string
 * @return {Number} Stringlength in bytes (not in chars)
 */
export function strlen(str: string): number {
  return encodeURI(str).split(/%..|./).length - 1;
}
