const {DBHelper} = require('../lib/DBHelper.js');

const db = new DBHelper();

test('getABC', async () => {


  const me = await db.findByName("ARTURO PEDRO ENRIQUE VOLPE TORRES");

  expect(me.length).toBe(1);
  expect(me[0].doc).toBe('4787587');
  expect(JSON.stringify(me[0])).toBe(JSON.stringify({
    doc: '4787587',
    name: 'VOLPE TORRES, ARTURO PEDRO ENRIQUE',
    div: '9',
    old: 'AACJ841761P'
  }));
});
