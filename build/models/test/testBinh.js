"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var concatArr = function (a) {
    return __spreadArray([], a, true);
};
console.log(concatArr([1, 2, 3]));
// const addArr = (arr: number[]): number => {
//   let total = 0;
//   arr.forEach((x) => {
//     total += x;
//   });
//   return total;
// };
// const lgNum = (arr: (string | number)[]): number => {
//   let largest = 0 as number;
//   arr.forEach((x) => {
//     if ((x as number) > largest) {
//       largest = x as number;
//     }
//   });
//   return largest;
// };
// const cut3 = (arr: (string | number)[]): (string | number)[] => {
//   arr.splice(2, 1);
//   return arr;
// };
// export default {
//   concatArr,
//   addArr,
//   lgNum,
//   cut3,
// };
