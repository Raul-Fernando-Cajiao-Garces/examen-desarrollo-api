# Examen Parcial — Desarrollo de Software II
**Estudiante:** Raúl Fernando Cajiao Garcés  
**Universidad:** Universidad Tecnológica Israel (UISRAEL)  
**Docente:** Msc. Viviana Flores  
**Proyecto:** examen-desarrollo-api  

---

## 📌 Descripción del Proyecto
API REST construida siguiendo los principios de **Arquitectura Hexagonal (Puertos y Adaptadores)**, Código Limpio (Clean Code) y GitHub Flow para la gestión de la biblioteca universitaria.

Se implementan las variantes solicitadas:
- **Variante A: Books (`/books`)** — Gestión de libros (título, autor, ISBN, ejemplares).
  - *Ampliación:* Préstamo de ejemplares (`PATCH /books/:id/borrow`).
- **Variante B: Members (`/members`)** — Gestión de socios (nombre, correo, tipo de membresía, estado activo).
  - *Ampliación:* Desactivación de socios (`PATCH /members/:id/deactivate`).

## 🛠️ Tecnologías y Almacenamiento
- **Lenguaje:** TypeScript / Node.js
- **Framework:** Express
- **Persistencia:** PostgreSQL con `pg` (SQL directo a mano) y modo en memoria desacoplado.
- **Testing:** Jest + Supertest para pruebas unitarias y de integración.

## 🚀 Puesta en Marcha
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar variables de entorno en `.env` (referencia en `.env.example`).
3. Ejecutar pruebas automatizadas:
   ```bash
   npm test
   ```
4. Compilar proyecto:
   ```bash
   npm run build
   ```
5. Iniciar servidor:
   ```bash
   npm run dev
   ```
