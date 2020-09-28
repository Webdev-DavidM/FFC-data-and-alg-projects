/* palindrome checker*/

function palindrome(str) {
  let string = str.replace(/[^a-zA-Z0-9]/g, '');

  let reversedString = [...string];
  reversedString.reverse();
  let x = reversedString.join('');
  return string.toLowerCase() === x.toLowerCase();
  /*
  use regexp replace to get rid of special characters
  make the string into an array
  reverse the array
  */
}

console.log(palindrome('My age is 0, 0 si ega ym.'));

/* roman numeral converter

create two arrays, roman numerals and number equivalents

*/

function convertToRoman(num) {
  let numbers = [1, 5, 10, 50, 100, 500, 1000, 10000];
  let romanNumerals = ['I', 'V', 'X', 'L', 'C', 'D', 'M', 'TEST'];
  let numberCount = 0;
  let myRomanNumerals = '';

  while (numberCount < num) {
    let remainingNumbers = num - numberCount;

    let largerNumber = numbers.filter((number) => number > remainingNumbers);
    let arrayIndex = numbers.indexOf(largerNumber[0]);

    // this if statement below will make sure the index is lowered by 1 if it is the first or last number in the array or if the remaining number is one of the exact numbers in the array
    if (arrayIndex !== 0) {
      arrayIndex = arrayIndex - 1;
    }

    for (
      let i = numbers[arrayIndex]; //5
      i <= remainingNumbers; // true
      i += numbers[arrayIndex]
    ) {
      /*
        if
      */

      numberCount += numbers[arrayIndex];
      myRomanNumerals += `${romanNumerals[arrayIndex]}`;
    }
  }
  myRomanNumerals = myRomanNumerals.replace(/DCCCC/gi, 'CM');
  // resolve 400
  myRomanNumerals = myRomanNumerals.replace(/CCCC/gi, 'CD');
  // resolves 97
  myRomanNumerals = myRomanNumerals.replace(/LXXXX/gi, 'XC');

  //resolves 44
  myRomanNumerals = myRomanNumerals.replace(/XXXX/gi, 'XL');

  //resolves 9
  myRomanNumerals = myRomanNumerals.replace(/VIIII/gi, 'IX');

  // resolve 4, a string that starts with
  myRomanNumerals = myRomanNumerals.replace(/IIII/gi, 'IV');
  myRomanNumerals = myRomanNumerals.replace(/^IIII/gi, 'IV');

  return myRomanNumerals;
}

console.log(convertToRoman(3999));

/* Caesar cipher */

function rot13(str) {
  let caesarCipher = [];
  let alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  let strArray = str.split('');
  strArray.forEach((letter) => {
    if (alphabet.includes(letter)) {
      let IndexOfLetter = alphabet.findIndex(
        (alphabetLetter) => alphabetLetter == letter
      );
      if (IndexOfLetter + 13 < 26) {
        caesarCipher.push(alphabet[IndexOfLetter + 13]);
      } else {
        let No = 13 - (alphabet.length - IndexOfLetter);
        caesarCipher.push(alphabet[No]);
      }
    } else {
      caesarCipher.push(letter);
    }
  });
  return caesarCipher.join('');
}

console.log(rot13('SERR YBIR?'));

/* Final challenge cash register */

function checkCashRegister(price, cash, cid) {
  let changeKey = [
    ['PENNY', 1],
    ['NICKEL', 5],
    ['DIME', 10],
    ['QUARTER', 25],
    ['ONE', 100],
    ['FIVE', 500],
    ['TEN', 1000],
    ['TWENTY', 2000],
    ['ONE HUNDRED', 10000],
  ];

  //I have converted all the currency to removal decimal places so there are not
  // floating point inaccuracies, I will then change it back to a decimal number at the end

  // This variable below i will use to see if the register is the same as change needed
  let originalChangeDue = cash * 100 - price * 100;

  let convertedCash = cid.map((curr) => {
    return [curr[0], curr[1] * 100];
  });

  // this is the change I need to give
  let changeNeeded = cash * 100 - price * 100;

  // this is the object to return to the customer at the end
  let objectToReturn = { status: '', change: [] };

  // this for loop will loop through each note and see if it is less than the total vlaue in the if statement
  for (let i = 8; i >= 0; i--) {
    // this first if statement will iterate check if the currency is more than the change needed and add it to the change array as 0
    if (changeKey[i][1] > changeNeeded) {
      objectToReturn.change.push([changeKey[i][0], 0]);
    }

    // Here if the currency is less than the  changeNeeded we will work out how to give them.
    if (changeKey[i][1] <= changeNeeded) {
      // here i will create a variable with total value of the denomination
      let totalValue = convertedCash[i][1];

      // if the total value of the currency is more than the changeneeded, I need to work out how many currency is needed, and then change totalValue to reflect this.
      if (totalValue > changeNeeded) {
        totalValue = 0;
        let value = changeKey[i][1];

        while (value <= changeNeeded) {
          value += changeKey[i][1];
          totalValue += changeKey[i][1];
        }
      }

      // here i am pushing an array with the name and amount of currency to the object

      objectToReturn.change.push([changeKey[i][0], totalValue]);
      //Here I update the amount of change needed as we iterate down through the currency
      changeNeeded = changeNeeded - totalValue;
    }
  }

  //here i will work out the total in the register and if it is the same as the
  // change needed then I will close the register without issuing an change.
  let totalInRegister = convertedCash.reduce((acc, curr) => {
    return acc + curr[1];
  }, 0);
  console.log(totalInRegister);

  if (originalChangeDue === totalInRegister) {
    objectToReturn.status = 'CLOSED';
    objectToReturn.change.reverse();
  }

  if (originalChangeDue !== totalInRegister) {
    objectToReturn.status = 'OPEN';
    console.log(objectToReturn);
    let filterOutZeros = objectToReturn.change.filter((curr) => curr[1] !== 0);

    objectToReturn.change = filterOutZeros;
  }
  if (changeNeeded > 0) {
    objectToReturn.status = 'INSUFFICIENT_FUNDS';
    objectToReturn.change = [];
  }

  // convert back to decimal

  let convertedDecimal = objectToReturn.change.map((curr) => {
    return [curr[0], curr[1] / 100];
  });

  objectToReturn.change = convertedDecimal;

  return objectToReturn;
}

console.log(
  checkCashRegister(19.5, 20, [
    ['PENNY', 0.5],
    ['NICKEL', 0],
    ['DIME', 0],
    ['QUARTER', 0],
    ['ONE', 0],
    ['FIVE', 0],
    ['TEN', 0],
    ['TWENTY', 0],
    ['ONE HUNDRED', 0],
  ])
);
