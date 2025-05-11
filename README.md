# SZTE - Programrendszerek fejlesztése gyakorlat

## Fórum Projekt

### Készítette:
**Mandic Blanka**

---

### Projekt Leírása
Ez a projekt a Szegedi Tudományegyetem *Programrendszerek fejlesztése* gyakorlatának keretében készült.

A projekt a tanult MEAN (MongoDB, ExpressJS, Angular 2+, NodeJS) technológiai stackben készült.

---

### Működéshez szükséges lépések

A projekt működéséhez szükséges Docker, Node (20.19.1), AngularCLI (17.2.1).

A következő paranccsal telepíthető az AngularCLI:
> npm install @angular/cli@17.2.1

A projektben egy MongoDB adatbázist konfigurálunk és futtatunk Docker segítségével a backend mappában:

> cd backend

> docker build -t my_mongo_image .

> docker run -p 5000:27017 -it --name my_mongo_container -d my_mongo_image

### Backend és frontend beüzemelése

Backend mappában állva (backend telepítése, build és futtatás):

> npm install

> npm run build

> npm run start

Frontned mappában állva (frontend telepítése, futtatás):

> npm install

> ng serve