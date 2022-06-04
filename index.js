function isInteger(n) {
  return typeof n === 'number' && (n | 0) === n;
}

function isPositiveInteger(n) {
  return isInteger(n) && n > 0;
}

function isNonNegativeInteger(n) {
  return isInteger(n) && n >= 0;
}

function reduceToSum(a, b) {
  return a + b;
}

function toNumber(a) {
  return +a;
}

function fillSequentialArray(n) {
  if (!isNonNegativeInteger(n)) {
    throw Error(`Invalid argument: n must be a non-negative integer, ${n} was provided.`);
  }

  return [...Array(n)].map((_, i) => i);
}

function generateRandomIntegerBetween(n, m) {
  if (!isNonNegativeInteger(n)) {
    throw Error(`Invalid argument: n must be a non-negative integer, ${n} was provided.`);
  }

  if (!isNonNegativeInteger(m)) {
    throw Error(`Invalid argument: m must be a non-negative integer, ${m} was provided.`);
  }

  if (n === m) {
    throw Error(`Invalid argument: n and m cannot be equal, ${n} and ${m} were provided.`);
  }

  return Math.floor(Math.random() * m) + n;
}

function generateRandomPermutation(n) {
  if (!isNonNegativeInteger(n)) {
    throw Error(`Invalid argument: n must be a non-negative integer, ${n} was provided.`);
  }

  const numbers = fillSequentialArray(n);
  const permutation = [];

  for (let i = numbers.length - 1; i >= 0; --i) {
    const randomNumber = generateRandomIntegerBetween(0, n);
    permutation.push(numbers[randomNumber]);
    numbers.splice(randomNumber, 1);
  }

  return permutation;
}

const generateNextPermutationInvalidArgumentPreText = 'Invalid argument: permutation must be an array of non-negative, non gapping, sequential integers beginning from 0,';
const cachedPermutations = {};

function verifyPermutation(permutation) {
  if (!Array.isArray(permutation)) {
    throw Error(`${generateNextPermutationInvalidArgumentPreText} value of type: ${typeof permutation} was provided.`);
  }

  const existenceMap = {};

  for (let i = 0; i < permutation.length; ++i) {
    if (!isNonNegativeInteger(permutation[i])) {
      throw Error(`${generateNextPermutationInvalidArgumentPreText} index at ${i} has value ${permutation[i]}.`);
    }

    if (existenceMap[permutation[i]] === undefined) {
      existenceMap[permutation[i]] = i;
    } else {
      throw Error(`${generateNextPermutationInvalidArgumentPreText} duplicate value of ${permutation[i]} found at indices ${existenceMap[permutation[i]]} and ${i}.`);
    }
  }

  for (let i = 0; i < permutation.length; ++i) {
    if (existenceMap[i] === undefined) {
      throw Error(`${generateNextPermutationInvalidArgumentPreText} missing value: ${i}.`);
    }
  }
}

function generateNextPermutation(permutation, skipVerification = false) {
  if (!skipVerification) {
    verifyPermutation(permutation);
  }
  
  const base = permutation.length - 1;

  if (base === -1 || base === 0) {
    return undefined;
  }

  if (permutation[base] === base) {
    return permutation.slice(0, base - 1).concat([permutation[base], permutation[base - 1]]);
  }

  for (let i = base; i > 0; --i) {
    const currentDigit = permutation[i];
    const nextDigit = permutation[i - 1];

    if (currentDigit < nextDigit) {
      continue;
    }
    
    const precedingDigits = permutation.slice(0, i - 1);

    let newDigit = nextDigit + 1;

    while (precedingDigits.indexOf(newDigit) > -1) {
      ++newDigit;
    };

    let followingDigit = 0;
    const digitMap = {};
    const nextPermutation = precedingDigits.concat([newDigit]);

    nextPermutation.forEach((d) => digitMap[d] = true);

    while (followingDigit <= base) {
      if (!digitMap[followingDigit]) {
        digitMap[followingDigit] = true;

        nextPermutation.push(followingDigit);
      }

      ++followingDigit;
    }

    return nextPermutation;
  }

  return undefined;
}

function generatePermutations(n) {
  if (!isNonNegativeInteger(n)) {
    throw Error(`Invalid argument: n must be a non-negative integer, ${n} was provided.`);
  }

  const startingPermutation = fillSequentialArray(n);
  const permutations = [startingPermutation];
  let nextPermutation = generateNextPermutation(startingPermutation, true);

  while (nextPermutation) {
    permutations.push(nextPermutation);
    nextPermutation = generateNextPermutation(nextPermutation, true);
  }

  return permutations;
}

function generatePermutationsUpTo(n) {
  if (!isNonNegativeInteger(n)) {
    throw Error(`Invalid argument: n must be a non-negative integer, ${n} was provided.`);
  }

  const permutations = [];

  for (let i = 0; i < n; ++i) {
    permutations.push(generatePermutations(i));
  }

  return permutations;
}

const applyPermutationInvalidArgumentPreText = 'Invalid argument: alphabet must be an array of uniquely serializeable values,';

function verifyAlphabet(alphabet, allowDuplicates = false) {
  if (!Array.isArray(alphabet)) {
    throw Error(`${refactorIntegerInvalidArgumentPreText} alue of type: ${typeof alphabet} was provided.`);
  }

  const existenceMap = {};

  alphabet.forEach((letter, i) => {
    try {
      const serializedLetter = JSON.stringify(letter);

      if (!allowDuplicates && typeof existenceMap[serializedLetter] === 'number') {
        throw Error(`${refactorIntegerInvalidArgumentPreText} duplicate value of ${letter} serialized to ${serializedLetter} found at indices ${existenceMap[serializedLetter]} and ${i}.`);
      } else {
        existenceMap[serializedLetter] = i;
      }
    } catch {
      throw Error(`${refactorIntegerInvalidArgumentPreText} value at index ${i} can not be serialized.`);
    }
  });
}

function applyPermutationToAlphabet(permutation, alphabet, allowDuplicates = false, skipVerification = false) {
  if (!skipVerification) {
    verifyPermutation(permutation);
    verifyAlphabet(alphabet, allowDuplicates);
  }
  
  return permutation.map((p) => alphabet[p]);
}

function factorInteger(n, includeOne = false) {
  if (typeof n !== 'number' || (n | 0) !== n || n < 1) {
    throw Error(`Invalid argument: n must be a positive integer, ${n} was provided.`);
  }

  const upperBound = Math.ceil(Math.sqrt(n));
  const factors = [];
  let remainder = n;

  if (includeOne) {
    factors.push(1);
  }

  for (let i = 2; i < upperBound; ++i) {
    while (remainder > 0 && (remainder % i === 0)) {
      remainder /= i;
      factors.push(i);
    }
  }

  if (remainder > 0) {
    factors.push(remainder);
  }

  if (
    (factors.length === 0 && !includeOne) ||
    (factors.length === 1 && includeOne)
  ) {
    factors.push(n);
  }

  return factors;
}

const refactorIntegerInvalidArgumentPreText = 'Invalid argument: factors must be an array of positive integers,';

function verifyIntegerFactors(n, factors) {
  if (!Array.isArray(factors)) {
    throw Error(`${refactorIntegerInvalidArgumentPreText} value of type: ${typeof factors} was provided.`);
  }

  let product = 1;

  for(let i = 0; i < factors.length; ++i) {
    const factor = factors[i];

    if (!isPositiveInteger(factor)) {
      throw Error(`${refactorIntegerInvalidArgumentPreText} value of ${factor} at index ${i} with type ${typeof factor} was provided.`);
    }

    product *= factor;
  }

  if (product !== n) {
    throw Error(`${refactorIntegerInvalidArgumentPreText} factors provided [${factors.join(',')}] do not multiply to produce ${n}.`);
  }

  return factors;
}

function generateUniqueIntegerDigitPermutations(n) {
  if (!isPositiveInteger(n)) {
    throw Error(`Invalid argument: n must be a positive integer, ${n} was provided.`);
  }

  const digits = String(n).split('').map(toNumber);

  if (!cachedPermutations[digits.length]) {
    cachedPermutations[digits.length] = generatePermutations(digits.length);
  }

  const uniqueDigitPermutations = {};
  const digitPermutations = cachedPermutations[digits.length].map((p) => applyPermutationToAlphabet(p, digits, true, true));

  for (let i = 0; i < digitPermutations.length; ++i) {
    const integer = +digitPermutations[i].join('');

    if (uniqueDigitPermutations[integer]) {
      continue;
    }

    uniqueDigitPermutations[integer] = true;
  }

  return Object.keys(uniqueDigitPermutations).map(toNumber);
}

function updateAbacusBeadPosition(abacus, beadPosition) {
  for (let i = 0; i < beadPosition.length; ++i) {
    if (beadPosition[i] + 1 < abacus[i].length) {
      ++beadPosition[i];

      return;
    } else if (beadPosition[i] + 1 === abacus[i].length) {
      beadPosition[i] = 0;
    }
  }
}

function refactorInteger(n, factors = undefined, skipVerification = false) {
  if (!isPositiveInteger(n)) {
    throw Error(`Invalid argument: n must be a positive integer, ${n} was provided.`);
  }

  if (!skipVerification) {
    verifyIntegerFactors(n, factors);
  }

  const integerFactors = !Array.isArray(factors) ? factorInteger(n) : factors;

  if (n < 10 || integerFactors.length === 1) {
    return [n];
  }

  const refactors = {};
  const factorPermutations = {};

  for (let i = 0; i < integerFactors.length; ++i) {
    if (factorPermutations[integerFactors[i]]) {
      continue;
    }
    
    factorPermutations[integerFactors[i]] = integerFactors[i] < 10
      ? [integerFactors[i]]
      : generateUniqueIntegerDigitPermutations(integerFactors[i]);
  }

  const abacus = Object.values(factorPermutations);
  const beadPosition = abacus.map(() => 0);
  let refactor = 1;

  do {
    refactor = 1;

    for (let i = 0; i < beadPosition.length; ++i) {
      refactor *= abacus[i][beadPosition[i]];
    }

    updateAbacusBeadPosition(abacus, beadPosition);

    refactors[refactor] = true;
  } while (beadPosition.reduce(reduceToSum, 0) > 0);

  return Object.keys(refactors).map(toNumber);
}

function aggregateInteger(n) {
  if (!isNonNegativeInteger(n)) {
    throw Error(`Invalid argument: n must be a non-negative integer, ${n} was provided.`);
  }

  let aggregate = n;

  while (aggregate >= 10) {
    aggregate = String(aggregate).split('').map(toNumber).reduce(reduceToSum, 0);
  }

  return aggregate;
}

function verifyRefactorAggregates(refactorAggregates, aggregate, refactors, n) {
  refactorAggregates.forEach((r, i) => {
    if (r !== aggregate) {
      throw Error(`Refactored integer aggregate of ${r} for refactor ${refactors[i]} does not equal provided integer aggregate of ${aggregate} for ${n}`);
    }
  });
}

function aggregateIntegerRefactors(n, skipVerification = false) {
  if (!isPositiveInteger(n)) {
    throw Error(`Invalid argument: n must be a positive integer, ${n} was provided.`);
  }

  const aggregate = aggregateInteger(n);
  const refactors = refactorInteger(n, factorInteger(n), true);
  const refactorAggregates = refactors.map((r) => aggregateInteger(r));

  if (!skipVerification) {
    verifyRefactorAggregates(refactorAggregates, aggregate, refactors, n);
  }
  
  return {
    integer: n,
    refactors,
    aggregate,
    refactorAggregates
  };
}

function aggregateRandomIntegerRefactors(n, m, skipVerification = false) {
  return aggregateIntegerRefactors(generateRandomIntegerBetween(n, m), skipVerification);
}
