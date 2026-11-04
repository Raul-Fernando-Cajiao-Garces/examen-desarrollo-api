# Examen Parcial — Desarrollo de Software II
**Estudiante:** Raúl Fernando Cajiao Garcés  
**Universidad:** Universidad Tecnológica Israel (UISRAEL)  
**Docente:** MSc. Viviana Matilde Flores Cahueñas  
**Proyecto:** `examen-desarrollo-api`  

---

## 📌 1. Descripción del Proyecto
API REST construida siguiendo los principios de **Arquitectura Hexagonal (Puertos y Adaptadores)**, Código Limpio (Clean Code) y **GitHub Flow** para la gestión de una biblioteca universitaria.

Se implementan las variantes solicitadas con cobertura completa:
* **Variante A: Books (`/books`)** — Gestión de libros (título, autor, ISBN de 10 o 13 dígitos, ejemplares).
  * **Ampliación implementada:** Préstamo de ejemplares con validación de stock (`PATCH /books/:id/borrow`).
* **Variante B: Members (`/members`)** — Gestión de socios (nombre, correo electrónico, tipo de membresía, estado activo).
  * **Ampliación implementada:** Desactivación de socios (`PATCH /members/:id/deactivate`).

---

## 🔗 2. Enlaces Oficiales de GitHub

* **Repositorio:** [https://github.com/Raul-Fernando-Cajiao-Garces/examen-desarrollo-api](https://github.com/Raul-Fernando-Cajiao-Garces/examen-desarrollo-api)
* **Pull Request Fusionado (Merged):** [https://github.com/Raul-Fernando-Cajiao-Garces/examen-desarrollo-api/pull/1](https://github.com/Raul-Fernando-Cajiao-Garces/examen-desarrollo-api/pull/1)

---

## 🛠️ 3. Tecnologías y Almacenamiento
* **Lenguaje:** TypeScript / Node.js
* **Framework:** Express
* **Persistencia:** PostgreSQL con `pg` (SQL directo a mano con esquema DDL en `db/schema.sql`) y modo en memoria desacoplado con copias seguras.
* **Testing:** Jest + Supertest para pruebas unitarias de dominio, servicios e integración real.
* **Bases de datos independientes:** `examen_dev` (desarrollo) y `examen_test` (pruebas de integración con regla de protección).

---

## 🚀 4. Puesta en Marcha y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```
2. **Variables de entorno:**  
   Configuradas en `.env` (referencia en `.env.example`):
   ```env
   DATABASE_URL=postgresql://postgres:Retr0x1990@localhost:5432/examen_dev
   TEST_DATABASE_URL=postgresql://postgres:Retr0x1990@localhost:5432/examen_test
   PORT=3000
   BOOKS_ADAPTER=sql
   MEMBERS_ADAPTER=sql
   ```
3. **Ejecutar pruebas automatizadas:**
   ```bash
   npm test
   ```
4. **Compilar proyecto en TypeScript:**
   ```bash
   npm run build
   ```
5. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```

---

## 📸 5. Evidencias del Examen

### A. Árbol de Git (`git log --oneline --graph --all`)
Demostración del flujo **GitHub Flow** con commits convencionales y merge morado:

![Árbol de Git](docs/evidencias/arbol-git.png)

```text
*   44be9f1 (HEAD -> main, origin/main) Merge pull request #1 from Raul-Fernando-Cajiao-Garces/feature/exam-library-api
|\  
| * 9d63b90 (origin/feature/exam-library-api) feat(api): add extension patch endpoints and postman collection v2.1
| * 441182f test(integration): add real database integration test suite with safety check
| * 188dd5b feat(persistence): implement postgres database adapters and schema
| * 5661a58 feat(http): implement REST endpoints and wire modules in app
| * f48e3fc feat(application): implement ports, in-memory repositories, services and unit tests
| * 63341f4 feat(domain): implement Book and Member entities, validation rules and domain unit tests
|/  
* f12688c chore: initial project setup from template
```

---

### B. Pruebas Automatizadas (`npm test` — 100% en verde)
51 pruebas pasando en 7 suites (unitarias de dominio, servicios de aplicación y persistencia real):

![NPM Test](docs/evidencias/npm-test.png)

---

### C. Compilación limpia sin errores (`npm run build`)
Compilación estricta con TypeScript:

![Compilación TypeScript](docs/evidencias/compilacion-typescript.png)

---

### D. Persistencia Real en PostgreSQL (`SELECT`)
Demostración de datos guardados y consultados directamente en `psql`:

![Persistencia SQL](docs/evidencias/persistencia-sql.png)

```text
 id |                    title                     |   author    |     isbn      | copies 
----+----------------------------------------------+-------------+---------------+--------
  1 | 20 Pasos para ser un Desarrollador Senior    | Raúl Cajiao | 9781234784587 |      4
  2 | Por qué saber usar IA no te hace programador | Raúl Cajiao | 9784895438924 |      2
(2 filas)

 id |     name      |            email            | membership_type | active 
----+---------------+-----------------------------+-----------------+--------
  1 | Raúl Fernando | raulcajiao@uisrael.edu.ec   | estudiante      | t
  2 | Cajiao Garcés | cajiaogarces@uisrael.edu.ec | docente         | t
(2 filas)
```

---

## 📮 6. Colección de Postman
La colección oficial en formato **v2.1** está disponible en:
* [`examen-desarrollo-api.postman_collection.json`](./examen-desarrollo-api.postman_collection.json)
Contiene las carpetas para Books y Members con sus pruebas automatizadas de código de estado (201, 200, 400 y 404).
