const mdLinks = require('../src/md-links');

describe('mdLinks', () => {

  //Cuando es unarchivo

  test('Al colocar md-links ./prueba.md en la terminal nos debe dar file, href y text', (done) => {
    expect
    mdLinks('./prueba.md', [{ default:true }]).then(data => {
      expect(data).toStrictEqual( [ { href:
      'https://carlosazaustre.com/manejando-la-asincronia-en-javascript/',
     text: 'Asíncronía en js',
     file: './prueba.md' },
   { href:
      'https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e',
     text: 'Linea de comando CLI',
     file: './prueba.md' },
   { href: 'https://www.figma.com/file/',
     text: 'enlace de figma',
     file: './prueba.md' },
   { href: 'https://www.figma.com/file/',
     text: 'enlace de figma',
     file: './prueba.md' } ]);done();
    });
});

test('Al colocar md-links ./prueba.md --validate en la terminal debe darnos file, href, statusText, status y text', (done) => {
  expect
  mdLinks('./prueba.md', [{ validate:true }]).then(data => {
    expect(data).toStrictEqual([ { file: './prueba.md',
    href:
     'https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e',
    statusText: 'OK',
    status: 200,
    text: 'Linea de comando CLI' },
  { file: './prueba.md',
    href: 'https://www.figma.com/file/',
    statusText: 'Not Found',
    status: 404,
    text: 'enlace de figma' },
  { file: './prueba.md',
    href: 'https://www.figma.com/file/',
    statusText: 'Not Found',
    status: 404,
    text: 'enlace de figma' },
  { file: './prueba.md',
    href:
     'https://carlosazaustre.es/manejando-la-asincronia-en-javascript/',
    statusText: 'OK',
    status: 200,
    text: 'Asíncronía en js' } ]);done();
  });
});

test('Al colocar md-links ./prueba.md --stats en la terminal debe retorna links Total y Unique', (done) => {
  expect
  mdLinks('./prueba.md', [{ stats:true }]).then(data => {
    expect(data).toStrictEqual( { Total: 4, Unique: 3 });done();
  });
});

test('Al colocar md-links ./prueba.md --stats --validate en la terminal debe retorna links Total, Unique y Broken', (done) => {
  expect
  mdLinks('./prueba.md', [{ both:true }]).then(data => {
    expect(data).toStrictEqual( { Total: 4, Unique: 3, Broken: 2 });done();
  });
});

//Cuando es un directorio

test('Al colocar md-links ./carpeta-prueba en la terminal nos debe dar file, href y text', (done) => {
  expect
  mdLinks('./carpeta-prueba', [{ default:true }]).then(data => {
    expect(data).toStrictEqual( [ { href:
      'https://git-scm.com/book/es/v1/Fundamentos-de-Git-Guardando-cambios-en-el-repositorio',
     text: 'Fundamentos de git',
     file: 'carpeta-prueba\\prueba2.md' },
   { href:
      'https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/concat',
     text: 'Métodos para arrays',
     file: 'carpeta-prueba\\prueba2.md' },
   { href: 'https://www.figma.com/file/',
     text: 'enlace de figma',
     file: 'carpeta-prueba\\prueba2.md' } ]);done();
  });
});

test('Al colocar md-links ./carpeta-prueba --validate en la terminal debe darnos file, href, statusText, status y text', (done) => {
  expect
  mdLinks('./carpeta-prueba', [{ validate:true }]).then(data => {
    expect(data).toStrictEqual([ { file: 'carpeta-prueba\\prueba2.md',
    href:
     'https://git-scm.com/book/es/v1/Fundamentos-de-Git-Guardando-cambios-en-el-repositorio',
    statusText: 'OK',
    status: 200,
    text: 'Fundamentos de git' },
  { file: 'carpeta-prueba\\prueba2.md',
    href:
     'https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/concat',
    statusText: 'OK',
    status: 200,
    text: 'Métodos para arrays' },
  { file: 'carpeta-prueba\\prueba2.md',
    href: 'https://www.figma.com/file/',
    statusText: 'Not Found',
    status: 404,
    text: 'enlace de figma' } ]);done();
  });
});

test('Al colocar md-links ./carpeta-prueba --stats en la terminal debe retorna links Total y Unique', (done) => {
  expect
  mdLinks('./carpeta-prueba', [{ stats:true }]).then(data => {
    expect(data).toStrictEqual([ { Total: 3, Unique: 3 } ]);done();
  });
});

test('Al colocar md-links ./carpeta-prueba --stats --validate en la terminal debe retorna links Total, Unique y Broken', (done) => {
  expect
  mdLinks('./carpeta-prueba', [{ both:true }]).then(data => {
    expect(data).toStrictEqual([ { Total: 3, Unique: 3, Broken: 1 } ]);done();
  });
});

});