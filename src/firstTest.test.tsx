import { describe, it, expect } from 'vitest'

describe('First Test', () => {
  it('sum of two numbers', () => {
    const sum = (a: number, b: number) => a + b;
    const result = sum(2, 3);
    expect(result).toBe(5);
  });

  it('two texts are equal', () => {
    const text1 = 'Meggie Sanchez';
    const text2 = 'Meggie Sanchez';
    expect(text1).toBe(text2);
  })

  it('list of numbers returns only even numbers', () => {
    const numbersArray = [1, 2, 3, 4, 5, 6];
    const evenNumbers = (numbers: number[]) => numbers.filter(num => num % 2 === 0);
    expect(evenNumbers(numbersArray)).toEqual([2, 4, 6]);
  })

  it('reverse a string', () => {
    const string = 'Hello World';
    const reversedString = 'dlroW olleH';
    const reverseString = (str: string) => str.split('').reverse().join('');
    expect(reverseString(string)).toBe(reversedString);
  });
});