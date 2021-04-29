import { filterOutput, minifyPHPCode } from '../utils'

describe.each([
  ['input\r\nexpected\r\n', 'input', 'expected'],
  ['input\r\nexpected\r\n', 'input', 'expected'],
  ['input\r\nexpected\r\n>>>', 'input', 'expected'],
  ['input\r\nexpected\r\nexpected\r\n>>>', 'input', 'expected\r\nexpected'],
  ['input\r\nexpected\r\n \bexpected\r\n>>>', 'input', 'expected\r\nexpected'],
  ['input\r\nex \bpected\r\n \bexpected\r\n>>>', 'input', 'expected\r\nexpected'],
  ['----->>>input\r\nex \bpected\r\n \bexpected\r\n>>>', 'input', 'expected\r\nexpected'],
  ['----->>>inputinput\r\nex \bpected\r\n \bexpected\r\n>>>', 'input', 'expected\r\nexpected'],
  ['----->>>inputi\r\r\nnput\r\nex \bpected\r\n \bexpected\r\n>>>', 'input', 'expected\r\nexpected'],
  ['----->>>inputi\r\r\nnput\r\nex \bpected\\\r\n...  \bexpected\r\n>>>', 'input', 'expected\\\nexpected'],
])('test filterOutput(%s, %s)', (output, input, expected) => {
  test(`should be ${expected}`, () => {
    expect(filterOutput(output, input)).toBe(expected)
  })
})

describe.each([
  [
    `
    // single line
//////single line
# single line
##### single line
echo 3+/*inline*/2+3//some comment
/*
This is a multiple-lines comment block
that spans over multiple
lines
*/
    `,
    `// single line\\\n//////single line\\\n# single line\\\n##### single line\\\necho 3+/*inline*/2+3//some comment\\\n/*\\\nThis is a multiple-lines comment block\\\nthat spans over multiple\\\nlines\\\n*/`
  ],
  [
    `
    StmasSocks::where('stkcod', 'LIKE', '%B01%')
    ->get();
    `,
    'StmasSocks::where(\'stkcod\', \'LIKE\', \'%B01%\')\\\n    ->get();'
  ],
  [
    `<?php// lots of blank line




    User::first()
    
    
    
    
    
    
    `,
    '// lots of blank line\\\n\\\n\\\n\\\n\\\n    User::first()'
  ],
  [
    `<?php
    DB::connection("socks")
->select("
SELECT COUNT(*)
FROM stcrd
WHERE ( docnum LIKE 'IV%' OR docnum LIKE 'HS%' )
AND docdat BETWEEN '2017-01-01' AND '2018-01-01'
");
    `,
    'DB::connection("socks")\\\n->select("\\\nSELECT COUNT(*)\\\nFROM stcrd\\\nWHERE ( docnum LIKE \'IV%\' OR docnum LIKE \'HS%\' )\\\nAND docdat BETWEEN \'2017-01-01\' AND \'2018-01-01\'\\\n");'
  ]
])('test minifyPHPCode(%s)', (code, expected) => {
  it(`should be ${expected}`, () => {
    expect(minifyPHPCode(code)).toBe(expected)
  })
})
