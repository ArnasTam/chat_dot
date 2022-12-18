# Projektas: „ChatDot“

_Modulis: T120B165 Saityno taikomųjų programų projektavimas_

_Studentas: Arnas Tamašauskas IFF-9/11_

## Sprendžiamo uždavinio aprašymas

Projekto tikslas – sukurti platformą kurioje galima bendrauti žmonėms skirtingomis temomis, kanaluose/serveriuose skirtiems  specifinėms temoms.
Veikimo principas – Sudaro dvi dalys – client/server architektūra.
Paprastas vartotojas galės peržiūrėti visus serverius ir serveriuose esančius kanalus ,kanaluose esančias žinutes su atsakymais ir visus kanaluose esančius vartotojus. Ten vartotojas gali specifiniame kanale rašyti žinutes (yra galimybė jas ištrinti bei redaguoti).

### Administratorius (pagrindinis)

Gali atlikti visas CRUD operacijas su vartotojais (Users)
Gali atlikti visas CRUD operacijas su žinutėmis (Messages)
Gali atlikti visas CRUD operacijas su atsakymais (Reply)
Gali atlikti visas CRUD operacijas su kanalais (Channel)
Gali atlikti visas CRUD operacijas su serveriais (Server)

### Serverio administratorius

Gali atlikti visas CRUD operacijas su vartotojais (Users) (Savo serveriuos)
Gali atlikti visas CRUD operacijas su žinutėmis (Messages) (Savo serveriuos)
Gali atlikti visas CRUD operacijas su atsakymais (Reply) (Savo serveriuos)
Gali atlikti visas CRUD operacijas su kanalais (Kanalais) (Savo serveriuos)
Gali atlikti visas CRUD operacijas su su savo sukurtais serveriais

### Paprastas vartotojas

Gali atlikti visas CRUD operacijas su žinutėmis (Messages) (Savo žinutėmis)
Gali skaityti kitu vartotoju žinutės
Gali matyti visus kanalus
Gali matyti visus serverius
Gali matyti kitus naudotojus (kanalo viduje)

## Sistemos architektūra

Sistemos sudedamosios dalys:

- Kliento pusė (angl. k. Front-End) – naudojant React.js;
- Serverio pusė (angl. k. Back-End) – naudojant Koa (NodeJS). Duomenų bazė – PostgreSQL.

Apačioje pavaizduota kuriamos sistemos diegimo diagrama. Sistemos talpinimui yra naudojamas AWS serveris. Kiekviena sistemos dalis yra diegiama tame pačiame serveryje. Internetinė aplikacija yra pasiekiama per HTTP protokolą. Šios sistemos veikimui (pvz., duomenų manipuliavimui su duomenų baze) yra reikalingas ChatDot API, kuris pasiekiamas per aplikacijų programavimo sąsają. Pats ChatDot API vykdo duomenų mainus su duomenų baze - tam naudojama ORM sąsaja.

![architecture.png](images/architecture.png)

## Naudotojo sąsajos projektas

##### Prisijungimo puslapis

![login.png](images/login.png)

##### Serverių sąrašo puslapis

![servers.png](images/servers.png)

##### Serverio sukūrimo puslapis

![server_add.png](images/server_add.png)

##### Kanalų sąrašo puslapis

![img.png](images/channels.png)

##### Kanalų sukūrimo puslapis

![img.png](images/channel_add.png)

##### Žinučių sukūrimo puslapis

![img.png](images/messages.png)

##### Specifinės žinutės puslapis

![img.png](images/single_message.png)

## API specifikacija

- ### **Vartotojai**

### POST /users

Sukuriamas naujas vartotojas

#### Galimi atsako kodai

- 201
- 400

#### Panaudojimo pavyzdys

##### Užklausa

    {
        "userName": "user1",
        "email": "user1@gmail.com",
        "password": "user1",
        "role": 1
    }

##### Atsakymas

    {
        "userName": "user1",
        "email": "user1@gmail.com",
        "role": 1,
        "password": "$2a$10$KyRHASbmaJX0vE.4FBmP2OUV9WIvgWzND9pgImsGsrJuN3ZWB1X2q",
        "id": "1bde2641-5473-476c-ba00-3261fe30b2f8"
    }

### POST /auth/login

Gaunamas JWT tokenas teisingai nurodžius vartotojo duomenis

#### Galimi atsako kodai

- 200
- 401
- 404

#### Panaudojimo pavyzdys

##### Užklausa

    {
        "userName": "user1",
        "password": "user1"
    }

##### Atsakymas

    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMjkwNjQ0MC1kODE2LTRiNTItOWM0OC04YjZjYzEwODMwN2QiLCJyb2xlIjoxLCJ1c2VyTmFtZSI6InNlcnZlciIsInRpbWUiOiJzdW4gZGVjIDE4IDIwMjIgMTY6MjI6NDUgZ210KzAwMDAgKGNvb3JkaW5hdGVkIHVuaXZlcnNhbCB0aW1lKSIsImlhdCI6MTY3MTM4MDU2NX0.8LAF-goFd_agjTkikvbBHDTBcq2osWznJyT0gu6Pe-4

- ### **Serveriai**

### POST /servers

Sukuriamas naujas serveris

#### Galimi atsako kodai

- 201
- 400
- 401
- 403

#### Panaudojimo pavyzdys

##### Užklausa

    {
        "name": "serveris",
        "description": "aprašymas"
    }

##### Atsakymas

    {
        "id": "4ef3a785-5919-4e15-bc4e-312e771543ad",
        "adminId": "d3c752bd-f03f-4a49-a626-f01ba5ea1ee9",
        "name": "serveris",
        "description": "aprašymas"
    }

### GET /servers/{id}

Pagal id gaunami serverio duomenys

#### Galimi atsako kodai

- 200
- 401
- 404

#### Panaudojimo pavyzdys

##### Užklausa

    GET /servers/4ef3a785-5919-4e15-bc4e-312e771543ad

##### Atsakymas

    {
        "id": "4ef3a785-5919-4e15-bc4e-312e771543ad",
        "adminId": "d3c752bd-f03f-4a49-a626-f01ba5ea1ee9",
        "name": "serveris",
        "description": "aprašymas"
    }

### PUT /servers/{id}

Atnaujinami serverio duomenys

#### Galimi atsako kodai

- 201
- 400
- 401
- 403
- 404

#### Panaudojimo pavyzdys

##### Užklausa

    PUT /servers/4ef3a785-5919-4e15-bc4e-312e771543ad

    {
        "name": "serveris2",
        "description": "aprašymas2"
    }


##### Atsakymas

    {
        "id": "4ef3a785-5919-4e15-bc4e-312e771543ad",
        "adminId": "d3c752bd-f03f-4a49-a626-f01ba5ea1ee9",
        "name": "serveris2",
        "description": "aprašymas2"
    }

### DELETE /servers/{id}

Ištrinamas serveris pagal id

#### Galimi atsako kodai

- 204
- 401
- 403
- 404

#### Panaudojimo pavyzdys

##### Užklausa

    DELETE /servers/4ef3a785-5919-4e15-bc4e-312e771543ad

##### Atsakymas

    204

### GET /servers

Gaunamas visų serverių sąrašas

#### Galimi atsako kodai

- 200
- 401

#### Panaudojimo pavyzdys

##### Užklausa

    GET /servers

##### Atsakymas

    [
        {
            "id": "4ef3a785-5919-4e15-bc4e-312e771543ad",
            "adminId": "d3c752bd-f03f-4a49-a626-f01ba5ea1ee9",
            "name": "serveris",
            "description": "aprašymas"
        }
    ]

- ### **Kanalai**

### POST /servers/{serverId}/channels

Serveryje pagal id sukuriamas naujas kanalas

#### Galimi atsako kodai

- 201
- 400
- 401
- 403

#### Panaudojimo pavyzdys

##### Užklausa

    POST /servers/4ef3a785-5919-4e15-bc4e-312e771543ad/channels

    {
        "name": "kanalas",
    }

##### Atsakymas

    {
        "id": "0286d937-4563-42d7-8273-e046693289b3",
        "name": "kanalas",
        "createdById": "d3c752bd-f03f-4a49-a626-f01ba5ea1ee9",
        "serverId": "fd618693-3dc0-41f3-926d-f21b46b266a7"
    }

### GET /servers/{serverId}/channels/{channelId}

Gaunami kanalo duomenus pagal id

#### Galimi atsako kodai

- 200
- 401
- 404

#### Panaudojimo pavyzdys

##### Užklausa

    GET /servers/0286d937-4563-42d7-8273-e046693289b3/channels/0286d937-4563-42d7-8273-e046693289b3

##### Atsakymas

    {
        "id": "0286d937-4563-42d7-8273-e046693289b3",
        "name": "kanalas",
        "createdById": "d3c752bd-f03f-4a49-a626-f01ba5ea1ee9",
        "serverId": "fd618693-3dc0-41f3-926d-f21b46b266a7"
    }

### PUT /servers/{id}/channels/{channelId}

Atnaujinami kanalo duomenys

#### Galimi atsako kodai

- 201
- 400
- 401
- 403
- 404

#### Panaudojimo pavyzdys

##### Užklausa

    PUT /servers/0286d937-4563-42d7-8273-e046693289b3/channels/4ef3a785-5919-4e15-bc4e-312e771543ad

    {
        "name": "kanalas2"
    }


##### Atsakymas

    {
        "id": "0286d937-4563-42d7-8273-e046693289b3",
        "name": "kanalas2",
        "createdById": "d3c752bd-f03f-4a49-a626-f01ba5ea1ee9",
        "serverId": "fd618693-3dc0-41f3-926d-f21b46b266a7"
    }

### DELETE /servers/{id}/channels/{channelId}

Ištrinamas kanalas

#### Galimi atsako kodai

- 204
- 401
- 403
- 404

#### Panaudojimo pavyzdys

##### Užklausa

    DELETE /servers/0286d937-4563-42d7-8273-e046693289b3/channels/0286d937-4563-42d7-8273-e046693289b3


##### Atsakymas

    204

### GET /servers/{serverId}/channels

Gaunamas visų serverio pagal id kanalų sąrašas

#### Galimi atsako kodai

- 200
- 401

#### Panaudojimo pavyzdys

##### Užklausa

    GET /servers/fd618693-3dc0-41f3-926d-f21b46b266a7/channels

##### Atsakymas

    [
        {
            "id": "0286d937-4563-42d7-8273-e046693289b3",
            "name": "kanalas",
            "createdById": "d3c752bd-f03f-4a49-a626-f01ba5ea1ee9",
            "serverId": "fd618693-3dc0-41f3-926d-f21b46b266a7"
        }
    ]

- ### **Žinutės**

### POST /servers/{serverId}/channels/{channelId}/messages

Sukuriama pagal kanalo id nauja žinutė

#### Galimi atsako kodai

- 201
- 400
- 401

#### Panaudojimo pavyzdys

##### Užklausa

    POST /servers/4ef3a785-5919-4e15-bc4e-312e771543ad/channels/0286d937-4563-42d7-8273-e046693289b3/messages

    {
        "content": "žinutė",
    }

##### Atsakymas

    {
        "id": "90cbb5ed-0e19-4b0f-bf32-b549e75ab85d",
        "content": "žinutė",
        "dateCreated": "2022-12-18T15:59:09.344Z",
        "dateUpdated": "2022-12-18T15:59:09.344Z",
        "channelId": "0286d937-4563-42d7-8273-e046693289b3",
        "authorId": "d3c752bd-f03f-4a49-a626-f01ba5ea1ee9"
    }

### GET /servers/{serverId}/channels/{channelId}/messages/{messageId}

Gaunami žinutės duomenys pagal id

#### Galimi atsako kodai

- 200
- 401
- 404

#### Panaudojimo pavyzdys

##### Užklausa

    GET /servers/0286d937-4563-42d7-8273-e046693289b3/channels/0286d937-4563-42d7-8273-e046693289b3/messages/90cbb5ed-0e19-4b0f-bf32-b549e75ab85d

##### Atsakymas

    {
        "id": "90cbb5ed-0e19-4b0f-bf32-b549e75ab85d",
        "content": "content",
        "dateCreated": "2022-12-18T15:59:09.344Z",
        "dateUpdated": "2022-12-18T15:59:09.344Z",
        "channelId": "0286d937-4563-42d7-8273-e046693289b3",
        "authorId": "d3c752bd-f03f-4a49-a626-f01ba5ea1ee9"
    }

### PUT /servers/{id}/channels/{channelId}/messages/{messageId}

Atnaujinami žinutės duomenys

#### Galimi atsako kodai

- 201
- 400
- 401
- 403
- 404

#### Panaudojimo pavyzdys

##### Užklausa

    PUT /servers/0286d937-4563-42d7-8273-e046693289b3/channels/0286d937-4563-42d7-8273-e046693289b3/messages/90cbb5ed-0e19-4b0f-bf32-b549e75ab85d

    {
        "name": "žinutė2"
    }


##### Atsakymas

    {
        "id": "90cbb5ed-0e19-4b0f-bf32-b549e75ab85d",
        "content": "žinutė2",
        "dateCreated": "2022-12-18T15:59:09.344Z",
        "dateUpdated": "2022-12-18T15:59:40.344Z",
        "channelId": "0286d937-4563-42d7-8273-e046693289b3",
        "authorId": "d3c752bd-f03f-4a49-a626-f01ba5ea1ee9"
    }

### DELETE /servers/{id}/channels/{channelId}/messages/{messageId}

Ištrinama žinutė

#### Galimi atsako kodai

- 204
- 401
- 403
- 404

#### Panaudojimo pavyzdys

##### Užklausa

    DELETE /servers/0286d937-4563-42d7-8273-e046693289b3/channels/0286d937-4563-42d7-8273-e046693289b3/messages/90cbb5ed-0e19-4b0f-bf32-b549e75ab85d


##### Atsakymas

    204

### GET /servers/{serverId}/channels/{channelId}/messages

Gaunamas kanalo pagal id žinučiu sąrašas

#### Galimi atsako kodai

- 200
- 401

#### Panaudojimo pavyzdys

##### Užklausa

    GET /servers/fd618693-3dc0-41f3-926d-f21b46b266a7/channels/0286d937-4563-42d7-8273-e046693289b3/messages

##### Atsakymas

    [
        {
            "id": "90cbb5ed-0e19-4b0f-bf32-b549e75ab85d",
            "content": "content",
            "dateCreated": "2022-12-18T15:59:09.344Z",
            "dateUpdated": "2022-12-18T15:59:09.344Z",
            "channelId": "0286d937-4563-42d7-8273-e046693289b3",
            "authorId": "d3c752bd-f03f-4a49-a626-f01ba5ea1ee9"
        }
    ]


## Išvados

Galima teigti, kad Koa, PostgressSQL, Azure ir React yra tinkami įrankiai norint realizuoti paprastomis CRUD opeacijomis grįsta projektą. Taip pat JWT panaudojimas autentifikacijoje/autorizacijoje yra tinkamas sprendimas norint užtikrinti puslapio bei vartotojo duomenų saugumą.