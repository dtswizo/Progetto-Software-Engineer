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
|        URR1, URR2, URR3, URR4, URR5   |  Review, Routes  | API     |     BB         |
|        URC1, URC2, URC3, URC4, URC5   |  Review, Controller  | Unit     |     WB         |
|        URD1, URD2, URD3, URD4, URD5, URD6   |  Review, DAO  | Unit     |     WB         |
|        IRD1, IRD2, IRD3, IRD4, IRD5   |  Review, DAO-DB  | Integration     |     BB         |
|        IRC1, IRC2, IRC3, IRC4, IRC5   |  Review, CONTROLLER-DAO-DB  | Integration     |     BB         |
|        IRR1, IRR2, IRR3, IRR4, IRR5, IRR6   |  Review, ROUTE-CONTROLLER-DAO-DB  | Integration     |     BB         |
| UCD1, UCD2, UCD3, UCD4, UCD5, UCD6, UCD7, UCD8 UCD9, UCD10, UCD11, UCD12, UCD13, UCD14, UCD15, UCD16| Cart, CartDAO, CartError | unit | WB |
| UCC1, UCC2, UCC3, UCC4, UCC5, UCC6, UCC7, UCC8 | Cart, CartController, CartError | unit | WB |
| UCR1, UCR2, UCR3, UCR4, UCR5, UCR6, UCR7, UCR8 | Cart, CartRoutes, CartError | unit | WB |
| ICD1, ICD2, ICD3, ICD4, ICD5, ICD6, ICD7,ICD8, ICD9, ICD10, ICD11, ICD12, ICD13, ICD14, ICD15 | Cart, CartDAO, CartError, Database | integration | BB |
| ICC1, ICC2, ICC3, ICC4, ICC5, ICC6, ICC7,ICC8 | Cart, CartDAO, CartError, Database, CartController | integration | BB |
| ICR1, ICR2, ICR3, ICR4, ICR5, ICR6, ICR7,ICR8 | Cart, CartDAO, CartError, Database, CartController, CartRoutes | integration/API ?????? | BB |
| UPD1, UPD2, UPD3, UPD4, UPD5, UPD6, UPD7, UPD8 | Product, ProductDAO, ProductError | Unit | WB |
| UPC1, UPC2, UPC3, UPC4, UPC5, UPC6, UPC7 | Product, ProductController, ProductError | Unit | WB |
| UPR1, UPR2, UPR3, UPR4, UPR5, UPR6, UPR7 | Product, ProductRoutes, ProductError | Unit | BB |
| IPD1, IPD2, IPD3, IPD4, IPD5, IPD6, IPD7,IPD8 | Product, ProductDAO, ProductError, Database | Integration | BB |
| IPC1, IPC2, IPC3, IPC4, IPC5, IPC6, IPC7,IPC8 | Product, ProductDAO, ProductError, Database, ProductController | Integration | BB |
| ICR1, ICR2, ICR3, ICR4, ICR5, ICR6, ICR7,ICR8 | Product, ProductDAO, ProductError, Database, ProductController, ProductRoutes | Integration | BB |
# Coverage

## Coverage of FR

<Report in the following table the coverage of functional requirements and scenarios(from official requirements) >

| Functional Requirement or scenario | Test(s) |
| :--------------------------------: | :-----: |
|                FR1                 |         |
|                FR2                 |         |
|                FR3                 | UPD,UPC,UPR,IPD,IPC,IPR        |
|                FR4                 |    URR, URC, URD, IRD, IRC, IRR     |
|                FR5                 | UCD, UCC, UCR, ICD, ICC, ICR |

## Coverage white box

Report here the screenshot of coverage values obtained with jest-- coverage
![Coverage](./resources/Coverage.jpg)