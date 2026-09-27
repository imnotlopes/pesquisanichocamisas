const ta = `DeMarcus Gilliard|1790342353
Adam Jackson|1790342279
Danilo Sipovac|1790342000
Danilo Sipovac|1790341987
Danilo Sipovac|1790341974
Adam Jackson|1790341959
Danilo Sipovac|1790341898
DeMarcus Gilliard|1790341892
Danilo Sipovac|1790341845
Danilo Sipovac|1790341806
Danilo Sipovac|1790337469
Danilo Sipovac|1790337446
Danilo Sipovac|1790337414
Danilo Sipovac|1790337402
Joel Berg|1790337371
Joel Berg|1790337361
Joel Berg|1790337323
Joel Berg|1790337319
Joel Berg|1790337295
Joel Berg|1790337292
Joel Berg|1790337262
Joel Berg|1790337261
Joel Berg|1790337260
Joel Berg|1790337251
Joel Berg|1790337223
Joel Berg|1790337218
Joel Berg|1790337156
Joel Berg|1790337147
Joel Berg|1790337125
Joel Berg|1790337121
Joel Berg|1790337077
Joel Berg|1790337061
Joel Berg|1790337039
Joel Berg|1790337004
Premium Denim. Built To Move.|1790180304
Premium Denim. Built To Move.|1790180299
Premium Denim. Built To Move.|1790180299
Premium Denim. Built To Move.|1790180298
Premium Denim. Built To Move.|1790180298
Premium Denim. Built To Move.|1790180298
Premium Denim. Built To Move.|1790180298
Premium Denim. Built To Move.|1790180297
Premium Denim. Built To Move.|1790180294
Premium Denim. Built To Move.|1790180293
Premium Denim. Built To Move.|1790180293
Premium Denim. Built To Move.|1790180291
Premium Denim. Built To Move.|1790180290
Premium Denim. Built To Move.|1790180288
Premium Denim. Built To Move.|1790180288
Premium Denim. Built To Move.|1790180285`;
const kojo = `Not Your Dad's Polo|1790465169
Not Your Dad's Polo|1790465154
Not Your Dad's Polo|1790465153
Not Your Dad's Polo|1790465119
Not Your Dad's Polo|1790465069
Not Your Dad's Polo|1790465053
Not Your Dad's Polo|1790465034
Not Your Dad's Polo|1790464428
You Run Hot? Wear These|1790462702
You Looked Twice|1790462447
You Looked Twice|1790462439
You Looked Twice|1790462435
You Looked Twice|1790462433
You Looked Twice|1790462430
The Tee That Keeps Its Shape|1790460788
The Tee That Keeps Its Shape|1790460788
The Tee That Keeps Its Shape|1790460786
The Tee That Keeps Its Shape|1790460786
The Tee That Keeps Its Shape|1790460773
The Tee That Keeps Its Shape|1790460733
The Tee That Keeps Its Shape|1790460709
The Tee That Keeps Its Shape|1790460670
The Tee That Keeps Its Shape|1790460633
Dress Code: Hot|1790460550
Dress Code: Hot|1790460550
Dress Code: Hot|1790460550
Dress Code: Hot|1790460549
Dress Code: Hot|1790460514
Dress Code: Hot|1790460514
You Looked Twice|1790459898
You Looked Twice|1790459864
Dress Code: Hot|1790456113
Built For Compliments|1790422759
Built For Compliments|1790422666
Built For Compliments|1790422593
Built For Compliments|1790422513
Built For Compliments|1790422391
Dress Code: Hot|1790421715
Dress Code: Hot|1790421656
Dress Code: Hot|1790421582
Dress Code: Hot|1790421498
Dress Code: Hot|1790421408
(sem título)|1790396842
You Looked Twice|1790242530
Fit, Style, Comfort. Have It All|1790242475
5 Inches. That's All You Need|1790242474
You Looked Twice|1790242474
Ultra-Stretch Chino Shorts|1790242473
You Run Hot? Wear These|1790242473
You Looked Twice|1790242473`;
const savid = `(sem título)|1789708829
Flex Weave Dress Shirts|1788917821
Flex Weave Dress Shirts|1788917818
Flex Weave Dress Shirts|1788917812
Flex Weave Dress Shirts|1788917810
(sem título)|1787625359
(sem título)|1787618859
No Ironing. No Wrinkles.|1787613848
No Ironing. No Wrinkles.|1787613721
No Ironing. No Wrinkles.|1787613628
No Ironing. No Wrinkles.|1787612967
No Ironing. No Wrinkles.|1787612726
No Ironing. No Wrinkles.|1787612503
No Ironing. No Wrinkles.|1787612457
No Ironing. No Wrinkles.|1787612074
No Ironing. No Wrinkles.|1787612009
No Ironing. No Wrinkles.|1787611636
No Ironing. No Wrinkles.|1787611572
No Ironing. No Wrinkles.|1787611397
No Ironing. No Wrinkles.|1787610924
(sem título)|1787199370
(sem título)|1787199366
(sem título)|1787199361
(sem título)|1787199358
(sem título)|1787199357
(sem título)|1787199352
(sem título)|1787199332
(sem título)|1787199331`;
const d = s => new Date(s*1000).toISOString().slice(0,16).replace('T',' ');
const out = {};
for (const [nome, txt] of Object.entries({ 'Tailored Athlete': ta, 'Kojo Fit': kojo, SAVID: savid })) {
  const rows = txt.split('\n').map(l => { const [t, s] = l.split('|'); return { t, s: +s }; });
  const por = {}; for (const r of rows) { (por[r.t] ??= []).push(r.s); }
  const ts = rows.map(r => r.s);
  const jan = (Math.max(...ts) - Math.min(...ts)) / 86400;
  out[nome] = { n: rows.length, criado_mais_novo: d(Math.max(...ts)), criado_mais_antigo: d(Math.min(...ts)), janela_dias: +jan.toFixed(2),
    criativos_unicos: Object.keys(por).length, duplicacao: +(rows.length / Object.keys(por).length).toFixed(1),
    por_titulo: Object.entries(por).map(([t, a]) => ({ titulo: t, qtd: a.length, primeiro: d(Math.min(...a)) })).sort((a, b) => b.qtd - a.qtd) };
}
console.log(JSON.stringify(out, null, 1));
import fs from 'node:fs'; fs.writeFileSync('amostras-meta-2026-09-27.json', JSON.stringify(out, null, 2));
