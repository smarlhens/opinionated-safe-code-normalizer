# Opinionated safe code normalizer

TypeScript opinionated safe code normalizer using ts-morph & ESLint.

[![GitHub CI](https://github.com/smarlhens/opinionated-safe-code-normalizer/workflows/CI/badge.svg)](https://github.com/smarlhens/opinionated-safe-code-normalizer/actions/workflows/ci.yml)
![node-current (scoped)](https://img.shields.io/node/v/@smarlhens/opinionated-safe-code-normalizer)
[![GitHub license](https://img.shields.io/github/license/smarlhens/opinionated-safe-code-normalizer)](https://github.com/smarlhens/opinionated-safe-code-normalizer)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

**This tool helps you to add `public` keyword to your code `methods`, `properties`, `getters` & `setters` to be compliant with [`@typescript-eslint/explicit-member-accessibility`](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/explicit-member-accessibility.md) rule.**

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)

---

## Prerequisites

- [Node.JS](https://nodejs.org/en/download/) **version ^14.17.0 || >=16.0.0**

---

## Installation

Install globally:

```sh
npm install -g @smarlhens/opinionated-safe-code-normalizer
```

---

## Usage

Use inside a directory which contain an `.eslintrc.js` configuration file and `**/*.ts` files (_can be in subdirectories of the working directory_).  
Using ts-morph & ESLint, your code will be updated adding `public` keyword to `methods`, `properties`, `getters` & `setters`.

```sh
$ oscn
```

---

## Example

```diff
class Foo {
  private propA: string;
  protected propB: string;
  public propC?: string;
- propD?: string;
+ public propD?: string;

  private _propE?: string;

- get propE(): string | undefined {
* public get propE(): string | undefined {
    return this._propE;
  }

- set propE(value: string | undefined) {
+ public set propE(value: string | undefined) {
    this._propE = value;
  }

  constructor() {
    this.propA = 'lorem';
    this.propB = 'ispum';
  }

- methodA(): void {}
+ public methodA(): void {}
}
```

---
