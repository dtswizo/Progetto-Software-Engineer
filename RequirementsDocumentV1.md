# Requirements Document - current EZElectronics

Date:

Version: V1 - description of EZElectronics in CURRENT form (as received by teachers)

| Version number | Change |
| :------------: | :----: |
|                |        |

# Contents

- [Requirements Document - current EZElectronics](#requirements-document---current-ezelectronics)
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
  - [Context Diagram](#context-diagram)
  - [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
  - [Functional Requirements](#functional-requirements)
  - [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
  - [Use case diagram](#use-case-diagram)
    - [Use case 1, Gestione Carrello](#use-case-1-gestione-carrello)
        - [Scenario 1.1.1](#scenario-111)
        - [Scenario 1.1.2](#scenario-112)
        - [Scenario 1.1.3](#scenario-113)
        - [Scenario 1.2.1](#scenario-121)
        - [Scenario 1.2.2](#scenario-122)
        - [Scenario 1.2.3](#scenario-123)
        - [Scenario 1.3.1](#scenario-131)
        - [Scenario 1.3.2](#scenario-132)
        - [Scenario 1.4 DA RIVEDERE PENSO SIA IN GESTIONE ORDINI/STORICO](#scenario-14-da-rivedere-penso-sia-in-gestione-ordinistorico)
    - [Use case 2, Checkout Carrello](#use-case-2-checkout-carrello)
        - [Scenario 2.1](#scenario-21)
        - [Scenario 2.2](#scenario-22)
    - [Use case x, UCx](#use-case-x-ucx)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description

EZElectronics (read EaSy Electronics) is a software application designed to help managers of electronics stores to manage their products and offer them to customers through a dedicated website. Managers can assess the available products, record new ones, and confirm purchases. Customers can see available products, add them to a cart and see the history of their past purchases.

# Stakeholders

| Stakeholder name | Description |
| :--------------: | :---------: |
| Customer  |  Utente che acquista i prodotti     |
| Store Manager  | Utente che gestisce l'inventario e conferma gli ordini           |
| Payment service  | Utilizzato per gestire le transazioni            |
| Software Factory  |  Programmatori e manutentori del sistema          |

# Context Diagram and interfaces

## Context Diagram

\<Define here Context diagram using UML use case diagram>

![alt text](resources/Context_Diagram.png)

\<actors are a subset of stakeholders>

## Interfaces

\<describe here each interface in the context diagram>

\<GUIs will be described graphically in a separate document>

|   Actor   | Logical Interface | Physical Interface |
| :-------: | :---------------: | :----------------: |
| Customer  |      GUI          |     PC /  Smartphone|
| Store Manager | GUI | PC / Smartphone|
| Payment Service | https://developer.paypal.com/docs/payouts/standard/integrate-api/ | Internet |

# Stories and personas

\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>

\<stories will be formalized later as scenarios in use cases>

# Functional and non functional requirements

## Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

|  ID   | Description |
| :---: | :---------: |
|  FR1  | Gestione Transazione |
|  FR1.1  |   Richiesta pagamento |
| FR1.2 | Gestione dati di pagamento|
| FR2 | Gestione carrello |
| FR2.1 | Aggiungi/Rimuovi prodotto |
| FR2.2 | Svuota carrello |
| FR2.3 | Checkout carrello |
| FR2.4 | Mostra carrello |
| FR3 | Gestione prodotti| 
| FR3.1 | Ricerca prodotti| 
| FR3.2 | Filtra prodotti (categoria, modello, sold)|
| FR3.3 | Mostra prodotti | 
| FR3.4 | Registro prodotti |
| FR3.5 | Conferma vendita prodotti |
| FR3.6 | Rimozione prodotti |
| FR3| Gestione Account |
| FR4.1| Registrazione account|
| FR4.2| Eliminazione account|
| FR4.3| Login/Logout utenti|
| FR4.4| Filtra utenti|
| FR4.5| Mostra utenti|
| FR5| Gestione ordini |
| FR5.1| Storico ordini|
| FR5.2| Rimozione ordini |
| FR6| Gestione privacy|
| FR6.1 | Mostra cookie policy|
| FR6.2 | GDPR privacy policy requirements|







## Non Functional Requirements

\<Describe constraints on functional requirements>

|   ID    | Type (efficiency, reliability, ..) | Description | Refers to |
| :-----: | :--------------------------------: | :---------: | :-------: |
|  NFR1   | Usabilità                               | Utenti non hanno bisogno di training            |           |
|  NFR2   | Efficienza                                    | Tempo di risposta del server inferiore a 0.2s            |           |
|  NFR3   | Affidabilità                                   | Sito non deve essere offline per più di 7gg all'anno           |           |
| NFR4  | Usabilità                                   | La sessione deve essere mantenuta attiva almeno 5 ore          |           |
| NFR5  |   Correttezza                                 | Test Coverage >= 80%  |           |
| NFR6  |   Portabilità                             | Chrome: 97.0.4692.99, Firefox:  96.0.1, Safari: 15.1|           |
| NFR7  |  Portabilità                           | Il sito deve essere responsive per schermi che vanno da 360x720 pixels a 3840x2160 pixels |           |
| NFR8  |  Manutenibilità | 8 ore/persona necessarie per sistemare un malfunzionamento |           |
| NFR9 |  Manutenibilità | 20 ore/persona necessarie per tempistiche di deploy per una nuova versione|           |
| NFR10 |  Sicurezza | La password deve rispettare le seguenti caratteristiche: lunghezza minima 8 caratteri, carattere speciale, carattere maiuscolo, numero |           |
| NFR11 |  Sicurezza | Le password devono essere salvate sul database con un algoritmo di hashing salted (?)|           |
| NFR12 |  Sicurezza | Utilizzo del protocollo https (?)|           |




# Use case diagram and use cases

## Use case diagram

\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>

\<next describe here each use case in the UCD>


### Use case 1, Gestione Carrello

| Actors Involved  |         Utente                                                             |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Utente loggato come cliente |
|  Post condition  |  Carrello modificato rispetto alla condizione iniziale   |
| Nominal Scenario |         Azioni di gestione del carrello         |
|     Variants     |                      \<other normal executions>                      |
|    Exceptions    |                       Errori 404,409                       |

##### Scenario 1.1.1

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

|  Scenario 1.1.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente autenticato come cliente |
| Post condition |  Aggiunta elemento al carrello, Mostra carrello|
|     Step#      |                                Description                                 |
|       1        |      Il sito mostra la lista dei prodotti                                                                   |
|       2        |        L'utente inserisce un prodotto nel carrello                                                                    |
|      3       |            Il sistema aggiorna il carrello                                                        |
|      4       |            L'utente apre il carrello                                                                |
|      5       |            Il sistema mostra il carrello                                                    |

##### Scenario 1.1.2


|  Scenario 1.1.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente autenticato come cliente |
| Post condition |  Lancio errore 404|
|     Step#      |                                Description                                 |
|       1        |      Il sito mostra la lista dei prodotti                                                                   |
|       2        |        L'utente inserisce un prodotto nel carrello                                                                    |
|      3       |            Il sistema ritorna un messaggio 404 perchè il prodotto non esiste                                                       |

##### Scenario 1.1.3


|  Scenario 1.1.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente autenticato come cliente |
| Post condition |  Lancio errore 409 |
|     Step#      |                                Description                                 |
|       1        |      Il sito mostra la lista dei prodotti                                                                   |
|       2        |        L'utente inserisce un prodotto nel carrello                                                                    |
|      3       |            Il sistema ritorna un messaggio 409 perchè il prodotto non è disponibile (venduto o in un altro carrello)                                                       |

##### Scenario 1.2.1

|  Scenario 1.2.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Carrello con almeno un elemento, Utente autenticato come cliente |
| Post condition |  Rimozioni elemento al carrello|
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente rimuove un elemento                                                                    |
|      4       |            Il sistema aggiorna il carrello                                                         |

##### Scenario 1.2.2

|  Scenario 1.2.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente autenticato come cliente |
| Post condition |  Lancio Errore 404 |
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente rimuove un elemento                                                                    |
|      4       |            Il sistema lancia l'errore 404 (prodotto non nel carrello, prodotto e/o carrello non esistente)                                                         |

##### Scenario 1.2.3

|  Scenario 1.2.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Carrello con almeno un elemento, Utente autenticato come cliente |
| Post condition |  Lancio Errore 409|
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente rimuove un elemento                                                                    |
|      4       |            Il sistema lancia l'errore 409 (prodotto già venduto)                                                         |

##### Scenario 1.3.1

|  Scenario 1.3.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente possiede un carrello, Utente autenticato come cliente|
| Post condition |  Carrello vuoto |
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente richiede eliminazione del carrello                                                               |
|      4       |            Il sistema aggiorna il carrello                                                         |

##### Scenario 1.3.2

|  Scenario 1.3.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente non possiede un carrello, Utente autenticato come cliente|
| Post condition |  Errore 404 |
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente richiede eliminazione del carrello                                                               |
|      4       |            Il sistema lancia l'errore 404                                                        |

##### Scenario 1.4 DA RIVEDERE PENSO SIA IN GESTIONE ORDINI/STORICO

|  Scenario 1.4  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente autenticato come manager|
| Post condition |  Eliminazione di tutti i carrelli esistenti |
|     Step#      |                                Description                                 |
|       1        |      L'utente richiede l'eliminazione del carrello                                                           |
|       2        |      Il sistema elimina tutti i carrelli esistenti                                         |

### Use case 2, Checkout Carrello
| Actors Involved  |         Cliente                                                             |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Utente autenticato come Cliente|
|  Post condition  |  Checkout effettuato   |
| Nominal Scenario |         \<Textual description of actions executed by the UC>         |
|     Variants     |                      \<other normal executions>                      |
|    Exceptions    |                        Errore 404 e 409                        |

##### Scenario 2.1

|  Scenario 2.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Carrello con almeno un elemento, Utente autenticato come cliente|
| Post condition |  Checkout effettuato con successo|
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente richiede checkout del carrello                                                               |
|      4       |            Il sistema effettua il checkout del carrello con successo                                             |

##### Scenario 2.2

|  Scenario 2.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Carrello vuoto, Utente autenticato come cliente|
| Post condition |  Checkout non riuscito|
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente richiede checkout del carrello                                                               |
|      4       |            Il sistema lancia l'errore 404 perchè il carrello è vuoto / non esiste                                         |


### Use case x, UCx

..

# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the application, and their relationships>

\<concepts must be used consistently all over the document, ex in use cases, requirements etc>

# System Design

\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram

\<describe here deployment diagram >
