const normalizr = require("normalizr");
const { normalize, denormalize, schema } = require("normalizr");
const { readFile, writeFile } = require("fs/promises");

const myJson = {
  id: "mensajes",
  mensajes: [
    {
      _id: "62cc1126cb475a21a4fd5a6e",
      author: {
        email: "juanisabbatini@hotmail.com",
        nombre: "Juani",
        apellido: "Sabbatini",
        edad: "22",
        alias: "juanisabba",
        avatar: "no",
      },
      text: "Hola",
      time: "11/7/2022, 09:01:42",
    },
    {
      _id: "62cc112ecb475a21a4fd5a70",
      author: {
        email: "juanisabbatini@hotmail.com",
        nombre: "Juani",
        apellido: "Sabbatini",
        edad: "22",
        alias: "juanisabba",
        avatar: "no",
      },
      text: "testing",
      time: "11/7/2022, 09:01:50",
    },
    {
      _id: "62cc117eeec032884c1d24ff",
      author: {
        email: "user3@hotmail.com",
        nombre: "user3",
        apellido: "3",
        edad: "1",
        alias: "user3",
        avatar: "no",
      },
      text: "hola",
      time: "11/7/2022, 09:03:10",
    },
    {
      _id: "62cc1185eec032884c1d2501",
      author: {
        email: "user3@hotmail.com",
        nombre: "user3",
        apellido: "3",
        edad: "1",
        alias: "user3",
        avatar: "no",
      },
      text: "chau",
      time: "11/7/2022, 09:03:17",
    },
    {
      _id: "62cc43befcd933a174acab23",
      author: {
        email: "juanisabbatini@hotmail.com",
        nombre: "Juani",
        apellido: "Sabbatini",
        edad: "22",
        alias: "juanisabba",
        avatar: "no",
      },
      text: "chau",
      time: "11/7/2022, 12:37:34",
    },
  ],
};

const newPS = (value, parent, key) => {
  console.log(parent.author);
};

const authorSchema = new normalizr.schema.Entity(
  "author",
  {},
  { idAttribute: "alias" }
);

const textSchema = new normalizr.schema.Entity(
  "text",
  { author: authorSchema },
  { idAttribute: "_id" }
);

const mensajeSchema = new normalizr.schema.Entity("mensajes", {
  mensajes: [textSchema],
});

const normalizedChat = normalizr.normalize(myJson, mensajeSchema);

console.log("--- LONGITUD DE ARCHIVO SIN NORMALIZAR ---");
console.log(JSON.stringify(myJson, null, 2).length);
console.log("--- LONGITUD DE ARCHIVO NORMALIZADO ---");
console.log(JSON.stringify(normalizedChat, null, 2).length);


export const normalizedMessages = (data) => {
  return normalize(data, chatSchema);
};
