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

import { number2long, long2number } from "./helper";

/**
 * UUID class
 */
export class UUID {
  private _id: Uint8Array;

  constructor(id: Uint8Array | Array<number>) {
    this._id = new Uint8Array(id);
  }

  buffer(): Uint8Array {
    return this._id;
  }
}


/**
 * ObjectId class (for mongoDB usage)
 */
export class ObjectId {
  private _id: Uint8Array;

  constructor(id: Uint8Array | Array<number>) {
    this._id = new Uint8Array(id);
  }

  buffer(): Uint8Array {
    return this._id;
  }
}


/**
 * The UTC class contains the milliseconds since the Unix epoch (1.1.1970 00:00:00 UTC)
 */
export class UTC {
  private _time: Uint8Array;

  constructor(time?: Uint8Array | Array<number> | string) {
    this._time = (typeof time !== 'string') ? new Uint8Array(time || number2long(Date.now())) : number2long(+new Date(time));
  }

  buffer(): Uint8Array {
    return this._time;
  }

  /**
   * Convert an (ISO) date string
   * @param {String} date (ISO) Date string
   */
  fromString(date: string): void {
    this._time = number2long(+new Date(date));
  }

  /**
   * Returns the milliseconds since the Unix epoch (UTC)
   */
  toNumber(): number {
    return long2number(this._time);
  }

  toDate(): Date {
    return new Date(long2number(this._time));
  }
}
