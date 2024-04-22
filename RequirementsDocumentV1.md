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
    - [Use case 1, Aggiunta prodotto carrello](#use-case-1-aggiunta-prodotto-carrello)
        - [Scenario 1.1](#scenario-11)
        - [Scenario 1.2](#scenario-12)
        - [Scenario 1.3](#scenario-13)
    - [Use case 2, Rimozione elementi Carrello](#use-case-2-rimozione-elementi-carrello)
        - [Scenario 2.1](#scenario-21)
        - [Scenario 2.2](#scenario-22)
        - [Scenario 2.3](#scenario-23)
    - [Use case 3, Eliminazione Carrello](#use-case-3-eliminazione-carrello)
        - [Scenario 3.1](#scenario-31)
        - [Scenario 3.2](#scenario-32)
    - [Use case 4, Checkout Carrello](#use-case-4-checkout-carrello)
        - [Scenario 4.1](#scenario-41)
        - [Scenario 4.2](#scenario-42)
        - [Scenario 4.3](#scenario-43)
    - [Use case 5, Mostra carrello](#use-case-5-mostra-carrello)
    - [Scenario 5.1](#scenario-51)
    - [Use case 3, Registrazione arrivo prodotti](#use-case-3-registrazione-arrivo-prodotti)
        - [Scenario 3.1](#scenario-31-1)
        - [Scenario 3.2](#scenario-32-1)
        - [Scenario 3.3](#scenario-33)
        - [Scenario 3.4](#scenario-34)
    - [Use case 4, Eliminazione prodotto](#use-case-4-eliminazione-prodotto)
        - [Scenario 4.1](#scenario-41-1)
        - [Scenario 4.2](#scenario-42-1)
    - [Use case 5, Conferma vendita prodotto](#use-case-5-conferma-vendita-prodotto)
        - [Scenario 5.1](#scenario-51-1)
        - [Scenario 5.2](#scenario-52)
        - [Scenario 5.2](#scenario-52-1)
    - [Use case 6, Ricerca prodotti](#use-case-6-ricerca-prodotti)
        - [Scenario 6.1](#scenario-61)
        - [Scenario 6.2](#scenario-62)
    - [Use case 7, Filtra prodotti](#use-case-7-filtra-prodotti)
        - [Scenario 7.1](#scenario-71)
        - [Scenario 7.2](#scenario-72)
    - [Use case 8, Crea nuovo prodotto](#use-case-8-crea-nuovo-prodotto)
        - [Scenario 8.1](#scenario-81)
        - [Scenario 8.2](#scenario-82)
        - [Scenario 8.3](#scenario-83)
    - [Use case 9, Mostra prodotti](#use-case-9-mostra-prodotti)
        - [Scenario 9.1](#scenario-91)
        - [Scenario 9.2](#scenario-92)
    - [Use case x, UCx](#use-case-x-ucx)
    - [Use case a, Registrazione](#use-case-a-registrazione)
        - [Scenario a.1](#scenario-a1)
        - [Scenario a.2](#scenario-a2)
    - [Use case b, Login](#use-case-b-login)
        - [Scenario b.1](#scenario-b1)
        - [Scenario b.2](#scenario-b2)
    - [Use case C, Logout](#use-case-c-logout)
        - [Scenario c.1](#scenario-c1)
    - [Use case d, Eliminazione account](#use-case-d-eliminazione-account)
        - [Scenario d.1](#scenario-d1)
        - [Scenario d.2](#scenario-d2)
    - [Use case e, Filtra utenti](#use-case-e-filtra-utenti)
        - [Scenario e.1](#scenario-e1)
        - [Scenario e.2](#scenario-e2)
        - [Scenario e.3](#scenario-e3)
    - [Use case f, Mostra utenti](#use-case-f-mostra-utenti)
        - [Scenario f.1](#scenario-f1)
    - [Use case g, Mostra informazioni utente](#use-case-g-mostra-informazioni-utente)
        - [Scenario g.1](#scenario-g1)
    - [Use case a, Storico ordini](#use-case-a-storico-ordini)
        - [Scenario a.1](#scenario-a1-1)
        - [Scenario a.2](#scenario-a2-1)
    - [Use case b, Storico ordini](#use-case-b-storico-ordini)
        - [Scenario b.1](#scenario-b1-1)
        - [Scenario b.2](#scenario-b2-1)
    - [Use case c, Rimozione ordini](#use-case-c-rimozione-ordini)
        - [Scenario c.1](#scenario-c1-1)
        - [Scenario c.2](#scenario-c2)
        - [Scenario c.3](#scenario-c3)
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
| FR2 | Gestione carrello |
| FR2.1 | Aggiungi prodotto| v
| FR2.2 | Elimina carrello corrente | v
| FR2.3 | Checkout carrello | v
| FR2.4 | Mostra carrello | v
| FR2.5 | Rimuovi prodotto| v
| FR3 | Gestione prodotti| 
| FR3.1 | Ricerca prodotto| v 
| FR3.2 | Filtra prodotti (categoria, modello, sold)| v
| FR3.3 | Mostra prodotti | v
| FR3.4 | Crea prodotto | v
| FR3.5 | Conferma vendita prodotto | v
| FR3.6 | Eliminazione prodotto/i | v
| FR3.7 | Registra arrivo prodotti dello stesso modello| v
| FR4| Gestione Account |
| FR4.1| Creazione utente| v
| FR4.2| Eliminazione utente/i| v
| FR4.3| Login utenti| v
| FR4.4| Filtra utenti| v
| FR4.5| Mostra lista utenti| v
| FR4.6| Mostra utente loggato| v
| FR4.7| Ricerca utente| v
| FR4.8| Logout utente| v
| FR5| Gestione ordini |
| FR5.1| Mostra storico ordini/carrelli pagati| v
| FR5.2| Rimozione carrelli | v







## Non Functional Requirements

\<Describe constraints on functional requirements>

|   ID    | Type (efficiency, reliability, ..) | Description | Refers to |
| :-----: | :--------------------------------: | :---------: | :-------: |
|  NFR1 | Usabilità | Utenti non hanno bisogno di training | Utente |
|  NFR2 | Efficienza | Tempo di risposta del server inferiore a 0.2s |           |
|  NFR3 | Affidabilità | Sito non deve essere offline per più di 7gg all'anno|           |
| NFR4 | Usabilità | La sessione deve essere mantenuta attiva almeno 5 ore |           |
| NFR5 |   Correttezza | Test Coverage >= 80%  |           |
| NFR6 |   Portabilità | Chrome: 97.0.4692.99, Firefox:  96.0.1, Safari: 15.1|           |
| NFR7 |  Portabilità | Il sito deve essere responsive per schermi che vanno da 360x720 pixels a 3840x2160 pixels |           |
| NFR8 | Manutenibilità | 8 ore/persona necessarie per sistemare un malfunzionamento |           |
| NFR9 | Manutenibilità | 20 ore/persona necessarie per tempistiche di deploy per una nuova versione|           |
| NFR10 | Sicurezza | La password deve rispettare le seguenti caratteristiche: lunghezza minima 8 caratteri, carattere speciale, carattere maiuscolo, numero |           |
| NFR11 | Sicurezza | Le password devono essere salvate sul database con un algoritmo di hashing salted (?)|           |
| NFR12 | Sicurezza | Utilizzo del protocollo https (?)|           |




# Use case diagram and use cases

## Use case diagram

\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>

\<next describe here each use case in the UCD>


### Use case 1, Aggiunta prodotto carrello

| Actors Involved  |         Utente                                                             |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Utente loggato come cliente |
|  Post condition  | prodotto aggiunto al carrello |
| Nominal Scenario |        utente aggiunge un elemento al carrello         |
|     Variants     |    -                      |
|    Exceptions    | il prodotto non esiste (Error 404),il prodotto non è disponibile (venduto o in un altro carrello) (Error 409)                       |

##### Scenario 1.1

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

|  Scenario 1.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente autenticato come cliente |
| Post condition |  Aggiunta elemento al carrello|
|     Step#      |                                Description                                 |
|       1        |      Il sito mostra la lista dei prodotti                                                                   |
|       2        |        L'utente inserisce un prodotto nel carrello                                                                    |
|      3       |            Il sistema aggiorna il carrello                                                        |

##### Scenario 1.2


|  Scenario 1.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente autenticato come cliente |
| Post condition |  Lancio errore 404|
|     Step#      |                                Description                                 |
|       1      |      Il sito mostra la lista dei prodotti                                                                   |
|       2      |        L'utente inserisce un prodotto nel carrello                   |
|      3       |            Il sistema ritorna un messaggio 404 perchè il prodotto non esiste  |

##### Scenario 1.3


|  Scenario 1.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente autenticato come cliente |
| Post condition |  Lancio errore 409 |
|     Step#      |                                Description                                 |
|       1        |      Il sito mostra la lista dei prodotti                                                                   |
|       2        |        L'utente inserisce un prodotto nel carrello                                                                    |
|      3       |            Il sistema ritorna un messaggio 409 perchè il prodotto non è disponibile (venduto o in un altro carrello)   |

### Use case 2, Rimozione elementi Carrello

| Actors Involved  |         Utente                                                             |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Utente loggato come cliente, carrello con un elemento |
|  Post condition  |  Elemento rimosso dal carrello |
| Nominal Scenario |         Rimozione di un elemento dal carrello         |
|     Variants     |                      \<other normal executions>                      |
|    Exceptions    |                       Errori 404,409                       |

##### Scenario 2.1

|  Scenario 2.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Carrello con almeno un elemento, Utente autenticato come cliente |
| Post condition |  Rimozioni elemento al carrello|
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente rimuove un elemento                                                                    |
|      4       |            Il sistema aggiorna il carrello                                                         |

##### Scenario 2.2

|  Scenario 2.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente autenticato come cliente |
| Post condition |  Lancio Errore 404 |
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente rimuove un elemento                                                                    |
|      4       |            Il sistema lancia l'errore 404 (prodotto non nel carrello, prodotto e/o carrello non esistente)                                                         |

##### Scenario 2.3

|  Scenario 2.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Carrello con almeno un elemento, Utente autenticato come cliente |
| Post condition |  Lancio Errore 409|
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente rimuove un elemento                                                                    |
|      4       |            Il sistema lancia l'errore 409 (prodotto già venduto)                                                         |

### Use case 3, Eliminazione Carrello

| Actors Involved  |         Utente                                                             |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Utente autenticato come cliente, Utente   |
|  Post condition  |  Carrello eliminato|
| Nominal Scenario |         Azioni di gestione del carrello         |
|     Variants     |                      \<other normal executions>                      |
|    Exceptions    |                       Errori 404,409                       |


##### Scenario 3.1

|  Scenario 3.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente possiede un carrello, Utente autenticato come cliente|
| Post condition |  Carrello eliminato |
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente richiede eliminazione del carrello                                                               |
|      4       |            Il sistema aggiorna il carrello                                                         |

##### Scenario 3.2

|  Scenario 3.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Utente non possiede un carrello, Utente autenticato come cliente|
| Post condition |  Errore 404 |
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente richiede eliminazione del carrello                                                               |
|      4       |            Il sistema lancia l'errore 404                                                        |


### Use case 4, Checkout Carrello
| Actors Involved  |         Cliente                                                             |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Utente autenticato come Cliente|
|  Post condition  |  Checkout effettuato   |
| Nominal Scenario | Cliente fa il checkout del carrello         |
|     Variants     |   -   |
|    Exceptions    |   Il carrello non esiste(Error 404), carrello vuoti (ERROR 404)                      |

##### Scenario 4.1

|  Scenario 4.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Carrello con almeno un elemento, Utente autenticato come cliente|
| Post condition |  Checkout effettuato con successo|
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente richiede checkout del carrello                                                               |
|      4       |            Il sistema effettua il checkout del carrello con successo                                             |

##### Scenario 4.2

|  Scenario 4.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Carrello vuoto, Utente autenticato come cliente|
| Post condition |  Checkout non riuscito|
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente richiede checkout del carrello                                                               |
|      4       |            Il sistema lancia l'errore 404 perchè il carrello è vuoto                         |

##### Scenario 4.3

|  Scenario 4.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Carrello con almeno un elemento, Utente autenticato come cliente|
| Post condition |  Checkout effettuato con successo|
|     Step#      |                                Description                                 |
|       1        |      L'utente   apre il carrello                                                           |
|       2        |      Il sistema mostra il carrello                                         |
|       3        |        L'utente richiede checkout del carrello                                                               |
|      4       |  Il sistema lancia l'errore 404 (carrello insesistente)                                       |

### Use case 5, Mostra carrello

| Actors Involved  |         Customer                                                            |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Utente loggato come customer|
|  Post condition  | carrello dal sistema |
| Nominal Scenario | Sitstema mostra carrello dell'utente corrente          |
|     Variants     |        -          |
|    Exceptions    |               |


### Scenario 5.1

|  Scenario 5.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | utente loggato come customer|
| Post condition | carrello mostrato dal sistema|
|    1   |       customer richiede di visualizzare il carrello |
|    2   |            Sistema mostra il carrello |


### Use case 3, Registrazione arrivo prodotti

| Actors Involved  |  Store Manager |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Utente autenticato come Store Manager |
|  Post condition  | Prodotto/i registrato all'interno del sistema |
| Nominal Scenario | Store manager registra singolo prodotto        |
|     Variants     |  Store manager registra più prodotti dello stesso modello   |
|    Exceptions    | inserimento data di arrivo dopo quella corrente, prodotto già esistente nel database(ERROR 409) |


##### Scenario 3.1

|  Scenario 3.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Store manager loggato|
| Post condition |  Registrazione prodotti con molteplicitá > 1 |
|       1        |        Store manager chiede di registrare nuovi arrivi |
|      2       |            Sistema mostra form di inserimento data di arrivo |
|      3       |            Store manager inserisce data di arrivo |
|      4       |            Il sistema registra data di arrivo relativa ai prodotti interessati |

##### Scenario 3.2

|  Scenario 3.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Store manager loggato|
| Post condition |  sistema mostra errore |
|       1       |        Store manager chiede di registrare nuovi arrivi |
|      2       |            Sistema mostra form di inserimento data di arrivo |
|      3       |            Store manager inserisce data/e di arrivo |
|      4       |            Il sistema mostra errore perchè la data di arrivo è dopo la data odierna |

##### Scenario 3.3

|  Scenario 3.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Store manager loggato|
| Post condition | registrazione singolo prodotto |
|       1        |        Store manager chiede di registrare nuovo arrivo |
|      2       |            Sistema mostra form di inserimento dati |
|      3     |            Store manager inserisce dati prodotto |
|      4       |            Il sistema registra dati di arrivo relativi al prodotto interessato |

##### Scenario 3.4

|  Scenario 3.4  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Store manager loggato|
| Post condition | registrazione singolo prodotto |
|       1        |        Store manager chiede di registrare nuovo arrivo |
|      2       |            Sistema mostra form di inserimento dati |
|      3     |            Store manager inserisce dati prodotto |
|      4       |            Il sistema rileva duplicazione codice prodotto (ERROR 409) e torna errore |


### Use case 4, Eliminazione prodotto

| Actors Involved  |  Store Manager |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Utente autenticato come Store Manager |
|  Post condition  | Prodotto eliminato dal sistema |
| Nominal Scenario | Store manager elimina prodotto dal sistema        |
|     Variants     | -  |
|    Exceptions    | Codice prodtto da eliminare non esistente (ERROR 404) |


##### Scenario 4.1

|  Scenario 4.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Store manager loggato|
| Post condition |  Prodotto eliminato |
|       1        |  Sistema mostra elenco prodotti |
|       2        |  Store manager seleziona 'elimina' accanto al prodotto che desidera eliminare |
|      3       |  Sistema chiede conferma dell'operazione |
|      4       |  Store manager conferma l'operazione |
|      5       |  Sistema elimina il prodotto dall'elenco |


##### Scenario 4.2

|  Scenario 4.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Store manager loggato|
| Post condition |  Sistema mostra errore |
|       1        |  Sistema mostra elenco prodotti |
|       2        |  Store manager seleziona 'elimina' accanto al prodotto che desidera eliminare |
|      3       |  Sistema chiede conferma dell'operazione |
|      4       |  Store manager conferma l'operazione |
|      5       |  Sistema mostra errore 404  |

### Use case 5, Conferma vendita prodotto

| Actors Involved  |  Store Manager |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Utente autenticato come Store Manager |
|  Post condition  | Prodotto segnato come venduto |
| Nominal Scenario | Store manager conferma vendita prodotto     |
|     Variants     | -   |
|    Exceptions    | il codice prodotto non esiste (ERROR 404), data di vendita dopo data corrente, data di vendita antecedente alla data di arrivo, il prodotto è gia stato venduto|

##### Scenario 5.1

|  Scenario 5.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Store manager loggato|
| Post condition |  Vendita prodotto confermata |
|       1        |  Store manager chiede di segnare un prodotto come venduto |
|      2       |  Sistema aggiorna lo stato del prodotto |

##### Scenario 5.2

|  Scenario 5.2 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Store manager loggato|
| Post condition |  sistema mostra errore (404) |
|       1        |  Store manager chiede di segnare un prodotto come venduto |
|      2       |  Sistema mostra errore(404) |

##### Scenario 5.2

|  Scenario 5.2 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Store manager loggato|
| Post condition |  sistema mostra errore |
|       1        |  Store manager chiede di segnare un prodotto come venduto |
|      2       |  Sistema mostra errore (data di vendita antecedente quella di arrivo, data di vendita dopo quella corrente, il prodotto è gia stato venduto) |

### Use case 6, Ricerca prodotti

| Actors Involved  |  Utente |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Utente autenticato |
|  Post condition  | Prodotto mostrato dal sistema |
| Nominal Scenario | utente ricerca prodotto per codice         |
|     Variants     | - |
|    Exceptions    | Errore prodotto non trovato (error 404)|

##### Scenario 6.1

|  Scenario 6.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | utente loggato|
| Post condition |  Prodotto ricercato mostrato |
|       1        |  Sistema mostra elenco prodotti |
|       2        |  utente inserisce il codice prodotto nella barra di ricerca |
|      3       |  Sistema mostra prodotto ricercato |

##### Scenario 6.2
|  Scenario 6.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | utente loggato|
| Post condition |  Errore prodotto ricercato non trovato |
|       1        |  Sistema mostra elenco prodotti |
|       2        |  utente inserisce il codice prodotto nella barra di ricerca |
|      3       |  Sistema mostra messaggio di errore 404 |

### Use case 7, Filtra prodotti

| Actors Involved  |  utente|
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Utente autenticato |
|  Post condition  | Visualizzazione prodotti filtrati |
| Nominal Scenario | Utente filtra, per categoria o modello, lista di prodotti       |
|     Variants     | utente applica ulteriore filtro per prodotti venduti/non venduti    |
|    Exceptions    | - |

##### Scenario 7.1

|  Scenario 7.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | utente loggato|
| Post condition |  Visualizzazione lista prodotti filtrata |
|       1        |  utente seleziona filtro (categoria o modello) |
|      2       |  Sistema mostra lista prodotti filtrata secondo il filtro selezionato |

##### Scenario 7.2

|  Scenario 7.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | utente loggato|
| Post condition |  Visualizzazione lista prodotti filtrata |
|       1        |  utente seleziona filtro (categoria o modello) |
|      2       |  Sistema mostra lista prodotti filtrata secondo il filtro selezionato |
| 3 | utente seleziona filtro venduto/venduto|
| 4 | sistema mostra lissta prodotti ulteriormente filtrati|


### Use case 8, Crea nuovo prodotto
| Actors Involved  | store manager  |
| :--------------: | :---: |
|   Precondition   | utente loggato come manager|
|  Post condition  | nuovo prodotto aggiunto |
| Nominal Scenario | Manager richiede di aggiungere prodotto ed EZElectronics lo aggiunge|
|     Variants     | - |
|    Exceptions    | Inserimento prodotto duplicato (409), inserimento data di arrivo dopo quella corrente |

##### Scenario 8.1
|  Scenario 8.1  |   |
| :------------: | :---: |
|  Precondition  | utente loggato come manager|
| Post condition | nuovo prodotto aggiunto|
|     Step#      |Description |
|1| Manager chiede di aggiungere nuovo prodotto |
|2| EZElectronics mostra form per inserimento informazioni|
|3| Manager compila il form e invia i dati|
|4| EZElectronics valida i dati e inserisce nuovo prodotto|

##### Scenario 8.2
|  Scenario 8.2  |   |
| :------------: | :---: |
|  Precondition  | utente loggato come manager|
| Post condition | visualizzazione errore da parte del sisstema|
|     Step#      |Description |
|1| Manager chiede di aggiungere nuovo prodotto |
|2| EZElectronics mostra form per inserimento informazioni|
|3| Manager compila il form e invia i dati|
|4| EZElectronics verifica i dati e torna errore 409 (prodotto gia esistente)|

##### Scenario 8.3
|  Scenario 8.3  |   |
| :------------: | :---: |
|  Precondition  | utente loggato come manager|
| Post condition | visualizzazione errore da parte del sisstema|
|     Step#      |Description |
|1| Manager chiede di aggiungere nuovo prodotto |
|2| EZElectronics mostra form per inserimento informazioni|
|3| Manager compila il form e invia i dati|
|4| EZElectronics verifica i dati e torna errore (data di arrivo dopo la data odierna)|

### Use case 9, Mostra prodotti
| Actors Involved  | Utente  |
| :--------------: | :---: |
|   Precondition   | utente loggato|
|  Post condition  | visualizzazione prodotti |
| Nominal Scenario | utente richiede di visualizzare tutti i prodotti e EZElectronics li mostra |
|     Variants     | utente richiede di visualizzare prodotti per venduto/non venduto |
|    Exceptions    | - |

##### Scenario 9.1
|  Scenario 9.1  |   |
| :------------: | :---: |
|  Precondition  | utente loggato|
| Post condition | prodotti visualizzati|
|     Step#      |Description |
|1| utente chiede di visualizzare tutti i prodotti |
|2| EZElectronics mostra i prodotti|

##### Scenario 9.2
|  Scenario 9.2  |   |
| :------------: | :---: |
|  Precondition  | utente loggato|
| Post condition | prodotti filtrati e visualizzati|
|     Step#      |Description |
|1| utente chiede di visualizzare i prodotti venduti/non venduti |
|2| EZElectronics mostra i prodotti filtrati richiesti|


### Use case x, UCx

..

### Use case a, Registrazione
| Actors Involved  |  Utente |
| :--------------: | :---: |
|   Precondition   | Utente non registrato |
|  Post condition  | Utente Registrato |
| Nominal Scenario | Utente visita EZElectronics e si registra inserendo i dati personali|
|     Variants     | - |
|    Exceptions    | l'utente inserisce uno username duplicato(ERROR 409) |

##### Scenario a.1
|  Scenario a.1  |   |
| :------------: | :---: |
|  Precondition  | Utente non registrato|
| Post condition | Utente registrato|
|     Step#      |Description |
|1| Utente chiede di effettuare registrazione |
|2| EZElectronics mostra form registrazione|
|3| Utente inserisce dati personali|
|4| Sistema valida, salva i dati e crea nuovo account| 

##### Scenario a.2
|  Scenario a.2  |   |
| :------------: | :---: |
|  Precondition  | Utente non registrato|
| Post condition | Sistema mostra errore|
|     Step#      |Description |
|1| Utente chiede di effettuare registrazione |
|2| EZElectronics chiede dati personali|
|3| Utente inserisce dati personali|
|4| Sistema individua username duplicato e torna errore 409|


### Use case b, Login
| Actors Involved  | Utente  |
| :--------------: | :---: |
|   Precondition   | Utente non loggato |
|  Post condition  | Utente loggato |
| Nominal Scenario | Utente visita EZElectronics e accede al proprio account|
|     Variants     | - |
|    Exceptions    | l'utente inserisce dei dati non validi|

##### Scenario b.1
|  Scenario b.1  |   |
| :------------: | :---: |
|  Precondition  | Utente non loggato|
| Post condition | Utente loggato|
|     Step#      |Description |
|1| Utente visita EZElectronics|
|2| EZElectronics visualizza pagina principale|
|3| Utente chiede di effettuare login |
|4| EZElectronics chiede dati di accesso|
|5| Utente inserisce dati di accesso|
|6| Sistema valida i dati e avvia sessione|

##### Scenario b.2
|  Scenario b.1  |   |
| :------------: | :---: |
|  Precondition  | Utente non loggato|
| Post condition | - |
|     Step#      |Description |
|1| Utente visita EZElectronics|
|2| EZElectronics visualizza pagina principale|
|3| Utente chiede di effettuare login |
|4| EZElectronics chiede dati di accesso|
|5| Utente inserisce dati di accesso|
|6| Sistema rileva errore nei dati e torna errore|

### Use case C, Logout
| Actors Involved  | Utente  |
| :--------------: | :---: |
|   Precondition   | Utente loggato |
|  Post condition  | Utente non loggato |
| Nominal Scenario | Utente si disconnette dal proprio account EZElectronics|
|     Variants     | - |
|    Exceptions    | -|

##### Scenario c.1
|  Scenario c.1  |   |
| :------------: | :---: |
|  Precondition  | Utente loggato|
| Post condition | Utente non loggato|
|     Step#      |Description |
|1| Utente chiede di effettuare logout |
|2| EZElectronics termina la sessione dell'account|

### Use case d, Eliminazione account
| Actors Involved  | Utente  |
| :--------------: | :---: |
|   Precondition   | - |
|  Post condition  | Account desiderato eliminato |
| Nominal Scenario | Utente elimina un account EZElectronics|
|     Variants     | -|
|    Exceptions    | tentativo di eliminare un accaout non esistente (ERROR 404)|

##### Scenario d.1
|  Scenario d.1  |   |
| :------------: | :---: |
|  Precondition  | -|
| Post condition | Account desiderato eliminato|
|     Step#      |Description |
|1| Utente chiede di eliminare uno specifico account |
|2| EZElectronics elimina account e relativi dati|

##### Scenario d.2
|  Scenario d.2  |   |
| :------------: | :---: |
|  Precondition  | --|
| Post condition |Sistema visualizza errore|
|     Step#      |Description |
|1| Utente chiede di eliminare l'account |
|2| EZElectronics torna errore perchè l'account selezionato non esiste|

### Use case e, Filtra utenti
| Actors Involved  | Utente  |
| :--------------: | :---: |
|   Precondition   | - |
|  Post condition  | Visulalizzazione utenti filtrati|
| Nominal Scenario | Utente filtra utenti per username|
|     Variants     | Utente filtra utenti per ruolo |
|    Exceptions    | Username cercato non esiste( ERROR 404)|

##### Scenario e.1
|  Scenario e.1  |   |
| :------------: | :---: |
|  Precondition  | -|
| Post condition | Visulalizzazione utenti filtrati|
|     Step#      |Description |
|1| Utente chiede di visualizzare utenti |
|2| EZElectronics mostra utenti|
|3| Utente chiede di filtrare utenti per username|
|4| EZElectronics richiede username|
|5| Utente inserisce username|
|6| EZElectronics visualizza utente cercato|

##### Scenario e.2
|  Scenario e.2  |   |
| :------------: | :---: |
|  Precondition  | -|
| Post condition | Sistema visulalizza errore 404|
|     Step#      |Description |
|1| Utente chiede di visualizzare utenti |
|2| EZElectronics mostra utenti|
|3| Utente chiede di filtrare utenti per username|
|4| EZElectronics richiede username|
|5| Utente inserisce username|
|6| EZElectronics torna errore visto che lo username cercato non esiste|

##### Scenario e.3
|  Scenario e.3  |   |
| :------------: | :---: |
|  Precondition  | -|
| Post condition | Visulalizzazione utenti filtrati|
|     Step#      |Description |
|1| Utente chiede di visualizzare utenti |
|2| EZElectronics mostra utenti|
|3| Utente chiede di filtrare utenti per ruolo|
|4| EZElectronics richiede di selezionare un ruolo per cui filtrare|
|5| Utente sleziona ruolo|
|6| EZElectronics visualizza utenti filtrati|


### Use case f, Mostra utenti
| Actors Involved  | Utente  |
| :--------------: | :---: |
|   Precondition   |-|
|  Post condition  | Sistema mostra utenti |
| Nominal Scenario | Dopo richiesta da parte dell'utente EZElectronics mostra lista degli utenti|
|     Variants     | - |
|    Exceptions    | -|

##### Scenario f.1
|  Scenario f.1  |   |
| :------------: | :---: |
|  Precondition  | -|
| Post condition |Sistema mostra utenti|
|     Step#      |Description |
|1| Utente chiede di visualizzare utenti |
|2| EZElectronics mostra utenti|


### Use case g, Mostra informazioni utente
| Actors Involved  | Utente  |
| :--------------: | :---: |
|   Precondition   | utente loggato|
|  Post condition  | informazioni visualizzate |
| Nominal Scenario | Dopo richiesta da parte dell'utente EZElectronics mostra informazione relative all'utente|
|     Variants     | - |
|    Exceptions    | -|

##### Scenario g.1
|  Scenario g.1  |   |
| :------------: | :---: |
|  Precondition  | utente loggato|
| Post condition |informazioni visualizzate|
|     Step#      |Description |
|1| Utente chiede di visualizzare le proprie informazioni |
|2| EZElectronics mostra le informazioni relative all'utente|



### Use case a, Storico ordini
| Actors Involved  |  Manager |
| :--------------: | :---: |
|   Precondition   | Manager autenticato |
|  Post condition  | Manager storico ordini visualizzato|
| Nominal Scenario | Manager visualizza e gestisce gli ordini
 |
|     Variants     | - |
|    Exceptions    |  Ordini non trovati |

##### Scenario a.1
|  Scenario a.1  |   |
| :------------: | :---: |
|  Precondition  | Manager autenticato|
| Post condition | Manager visualizza ordini|
|     Step#      |Description |
|1| Manager apre sezione ordini|
|2| Manager clicca su "storico ordini"|
|3| Lo storico ordini viene visualizzato|


##### Scenario a.2
|  Scenario a.2  |   |
| :------------: | :---: |
|  Precondition  | Manager autenticato|
| Post condition | Lancio errore "Ordini non trovati"|
|     Step#      |Description |
|1| Manager apre sezione ordini|
|2| Manager clicca su "storico ordini"|
|3| Il sistema restituisce un messaggio di errore "Ordini non trovati"|

### Use case b, Storico ordini
| Actors Involved  |  Utente |
| :--------------: | :---: |
|   Precondition   | Utente autenticato |
|  Post condition  | Utente storico ordini visualizzato|
| Nominal Scenario | L'utente visualizza il proprio storico ordini
 |
|     Variants     | - |
|    Exceptions    | Ordini non trovati |

##### Scenario b.1
|  Scenario b.1  |   |
| :------------: | :---: |
|  Precondition  | Utente autenticato|
| Post condition | Utente visualizza lista ordini|
|     Step#      |Description |
|1| Utente apre la sezione "i miei ordini"|
|2| Il sistema cerca gli ordini associati all'utente|
|3| La lista degli ordini effettuati viene restituita all'utente|

##### Scenario b.2
|  Scenario b.2  |   |
| :------------: | :---: |
|  Precondition  | Utente autenticato|
| Post condition | Lancio errore "Nessun ordine eseguito"|
|     Step#      |Description |
|1| Utente apre la sezione "i miei ordini"|
|2| Il sistema cerca gli ordini associati all'utente|
|3| Il sistema restituisce un messaggio di errore "Impossibile visualizzare ordini, nessun ordine eseguito"|


### Use case c, Rimozione ordini
| Actors Involved  |  Manager |
| :--------------: | :---: |
|   Precondition   | Manager autenticato |
|  Post condition  | Tutti gli ordini sono stati cancellati|
| Nominal Scenario | Manager visualizza gli ordini e li rimuove |
|     Variants     | - |
|    Exceptions    | Rimozione ordine disponibile solo dopo il loro completamento, impossibile rimuovere ordini in assenza di ordini completati. |

##### Scenario c.1
|  Scenario c.1  |   |
| :------------: | :---: |
|  Precondition  | Manager autenticato|
| Post condition | Tutti gli ordini sono stati eliminati|
|     Step#      |Description |
|1| Manager apre sezione ordini|
|2| Manager clicca la voce "Elimina tutti gli ordini"|
|3| Tutti gli ordini presenti vengono eliminati|

##### Scenario c.2
|  Scenario c.2  |   |
| :------------: | :---: |
|  Precondition  | Manager autenticato|
| Post condition | Lancio errore eliminazione ordini|
|     Step#      |Description |
|1| Manager apre sezione ordini|
|2| Seleziona la voce "Elimina tutti gli ordini"|
|3| Lancio messaggio di errore poichè uno o più ordini non sono stati ancora completati|

##### Scenario c.3
|  Scenario c.3  |   |
| :------------: | :---: |
|  Precondition  | Manager autenticato|
| Post condition | Lancio errore eliminazione ordini|
|     Step#      |Description |
|1| Manager apre sezione ordini|
|2| Seleziona la voce "Elimina tutti gli ordini"|
|3| Lancio messaggio di errore poichè nessun ordine è presente nel database|


















# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the application, and their relationships>

\<concepts must be used consistently all over the document, ex in use cases, requirements etc>

# System Design

\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram

\<describe here deployment diagram >
