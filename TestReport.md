# Test Report

<The goal of this document is to explain how the application was tested, detailing how the test cases were defined and what they cover>

# Contents

- [Test Report](#test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Tests](#tests)
- [Coverage](#coverage)
  - [Coverage of FR](#coverage-of-fr)
  - [Coverage white box](#coverage-white-box)

# Dependency graph

     <report the here the dependency graph of EzElectronics>

# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence

    (ex: step1: unit A, step 2: unit A+B, step 3: unit A+B+C, etc)>

    <Some steps may  correspond to unit testing (ex step1 in ex above)>

    <One step will  correspond to API testing, or testing unit route.js>

# Tests

<in the table below list the test cases defined For each test report the object tested, the test level (API, integration, unit) and the technique used to define the test case (BB/ eq partitioning, BB/ boundary, WB/ statement coverage, etc)> <split the table if needed>

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|        UUR 1   |  User, Routes    | Unit/API?  |     BB?        |
|        UUR 2   |  User, Routes    | Unit/API?  |     BB?        |
|        UUR 3   |  User, Routes    | Unit/API?  |     BB?        |
|        UUR 4   |  User, Routes    | Unit/API?  |     BB?        |
|        UUR 5   |  User, Routes    | Unit/API?  |     BB?        |
|        UUR 6   |  User, Routes    | Unit/API?  |     BB?        |
|        UUR 7   |  User, Routes    | Unit/API?  |     BB?        |
|        UUR 8   |  User, Routes    | Unit/API?  |     BB?        |
|        UUR 9   |  User, Routes    | Unit/API?  |     BB?        |
|        UUR 10   |  User, Routes    | Unit/API?  |     BB?        |
|        UUC 1   |  User, Controller  | Unit     |     WB         |
|        UUC 2   |  User, Controller  | Unit     |     WB         |
|        UUC 3   |  User, Controller  | Unit     |     WB         |
|        UUC 4   |  User, Controller  | Unit     |     WB         |
|        UUC 5   |  User, Controller  | Unit     |     WB         |
|        UUC 6   |  User, Controller  | Unit     |     WB         |
|        UUC 7   |  User, Controller  | Unit     |     WB         |
|        UUD 1   |  User, DAO  | Unit     |     WB         |
|        UUD 2   |  User, DAO  | Unit     |     WB         |
|        UUD 3   |  User, DAO  | Unit     |     WB         |
|        UUD 4   |  User, DAO  | Unit     |     WB         |
|        UUD 5   |  User, DAO  | Unit     |     WB         |
|        UUD 6   |  User, DAO  | Unit     |     WB         |
|        UUD 7   |  User, DAO  | Unit     |     WB         |
|        IUD 1   |  User, DAO  | Integration     |     WB         |
|        IUD 2   |  User, DAO  | Integration     |     WB         |
|        IUD 3   |  User, DAO  | Integration     |     WB         |
|        IUD 4   |  User, DAO  | Integration     |     WB         |
|        IUD 5   |  User, DAO  | Integration     |     WB         |
|        IUD 6   |  User, DAO  | Integration     |     WB         |
|        IUD 7   |  User, DAO  | Integration     |     WB         |
|        IUC 1   |  User, DAO  | Integration     |     WB         |
|        IUC 2   |  User, DAO  | Integration     |     WB         |
|        IUC 3   |  User, DAO  | Integration     |     WB         |
|        IUC 4   |  User, DAO  | Integration     |     WB         |
|        IUC 5   |  User, DAO  | Integration     |     WB         |
|        IUC 6   |  User, DAO  | Integration     |     WB         |
|        IUC 7   |  User, DAO  | Integration     |     WB         |
|        URR 1   |  Review, Routes  | API     |     BB         |
|        URR 2   |  Review, Routes  | API     |     BB         |
|        URR 3   |  Review, Routes  | API     |     BB         |
|        URR 4   |  Review, Routes  | API     |     BB         |
|        URR 5   |  Review, Routes  | API     |     BB         |
|        URC 1   |  Review, Controller  | Unit     |     WB         |
|        URC 2   |  Review, Controller  | Unit     |     WB         |
|        URC 3   |  Review, Controller  | Unit     |     WB         |
|        URC 4   |  Review, Controller  | Unit     |     WB         |
|        URC 5   |  Review, Controller  | Unit     |     WB         |
|        URD 1   |  Review, DAO  | Unit     |     WB         |
|        URD 2   |  Review, DAO  | Unit     |     WB         |
|        URD 3   |  Review, DAO  | Unit     |     WB         |
|        URD 4   |  Review, DAO  | Unit     |     WB         |
|        URD 5   |  Review, DAO  | Unit     |     WB         |
|        URD 6   |  Review, DAO  | Unit     |     WB         |
|        IRD 1   |  Review, DAO-DB  | Integration     |     BB         |
|        IRD 2   |  Review, DAO-DB  | Integration     |     BB         |
|        IRD 3   |  Review, DAO-DB  | Integration     |     BB         |
|        IRD 4   |  Review, DAO-DB  | Integration     |     BB         |
|        IRD 5   |  Review, DAO-DB  | Integration     |     BB         |
|        IRC 1   |  Review, CONTROLLER-DAO-DB  | Integration     |     BB         |
|        IRC 2   |  Review, CONTROLLER-DAO-DB  | Integration     |     BB         |
|        IRC 3   |  Review, CONTROLLER-DAO-DB  | Integration     |     BB         |
|        IRC 4   |  Review, CONTROLLER-DAO-DB  | Integration     |     BB         |
|        IRC 5   |  Review, CONTROLLER-DAO-DB  | Integration     |     BB         |
|        IRR 1   |  Review, ROUTE-CONTROLLER-DAO-DB  | Integration     |     BB         |
|        IRR 2   |  Review, ROUTE-CONTROLLER-DAO-DB  | Integration     |     BB         |
|        IRR 3   |  Review, ROUTE-CONTROLLER-DAO-DB  | Integration     |     BB         |
|        IRR 4   |  Review, ROUTE-CONTROLLER-DAO-DB  | Integration     |     BB         |
|        IRR 5   |  Review, ROUTE-CONTROLLER-DAO-DB  | Integration     |     BB         |
|        IRR 6   |  Review, ROUTE-CONTROLLER-DAO-DB  | Integration     |     BB         |

# Coverage

## Coverage of FR

<Report in the following table the coverage of functional requirements and scenarios(from official requirements) >

| Functional Requirement or scenario | Test(s) |
| :--------------------------------: | :-----: |
|                FR1                 |         |
|                FR2                 |         |
|                FR3                 |         |
|                FR4                 |    URR, URC, URD, IRD, IRC, IRR     |
|                FR5                 |         |

## Coverage white box

Report here the screenshot of coverage values obtained with jest-- coverage
