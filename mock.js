/**
 * js/mock.js — LocalStorage database simulator for static HTML preview files.
 * Full product catalogue (50 items) + 3 months of realistic sales data.
 * Schema v3.2 — Jan–Mar 2026
 */

// ── Schema version guard — wipes stale data automatically ────────
const SCHEMA_VER = 'v3.6';
if (localStorage.getItem('sb_schema_ver') !== SCHEMA_VER) {
  localStorage.removeItem('sb_products');
  localStorage.removeItem('sb_sales');
  localStorage.removeItem('sb_nextSaleId');
  localStorage.setItem('sb_schema_ver', SCHEMA_VER);
}

// ── Products ──────────────────────────────────────────────────────
if (!localStorage.getItem('sb_products')) {
  const defaultProducts = {
    // 11PLY SOLID MARINE — ₱2,250
    '1': {name:'1-023',cat:'11PLY SOLID MARINE',cd:'Yellow Birch',  th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:28,thr:5},
    '2': {name:'1-031',cat:'11PLY SOLID MARINE',cd:'Maridon Oak',   th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:38,thr:5},
    '3': {name:'1-009',cat:'11PLY SOLID MARINE',cd:'Golden Oak',    th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:39,thr:5},
    '4': {name:'1-000',cat:'11PLY SOLID MARINE',cd:'Real White',    th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:24,thr:5},
    '5': {name:'1-001',cat:'11PLY SOLID MARINE',cd:'Warm White',    th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:30,thr:5},
    '6': {name:'1-017',cat:'11PLY SOLID MARINE',cd:'Macassar',      th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:34,thr:5},
    '7': {name:'1-015',cat:'11PLY SOLID MARINE',cd:'Gray Oak',      th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:38,thr:5},
    '8': {name:'1-033',cat:'11PLY SOLID MARINE',cd:'Fabric Cream',  th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:40,thr:5},
    '9': {name:'1-039',cat:'11PLY SOLID MARINE',cd:'Dark Metallic', th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:32,thr:5},
    '10':{name:'1-014',cat:'11PLY SOLID MARINE',cd:'Gray Stone',    th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:42,thr:5},
    '11':{name:'1-016',cat:'11PLY SOLID MARINE',cd:'Silver Ash',    th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:44,thr:5},
    '12':{name:'1-034',cat:'11PLY SOLID MARINE',cd:'Metallic Dark', th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:46,thr:5},
    '13':{name:'1-041',cat:'11PLY SOLID MARINE',cd:'Wild Cherry',   th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:42,thr:5},
    '14':{name:'1-021',cat:'11PLY SOLID MARINE',cd:'Walnut Gray',   th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:44,thr:5},
    '15':{name:'1-046',cat:'11PLY SOLID MARINE',cd:'Natural Oak',   th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:30,thr:5},
    '16':{name:'1-048',cat:'11PLY SOLID MARINE',cd:'Light Acacia',  th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:38,thr:5},
    '17':{name:'1-045',cat:'11PLY SOLID MARINE',cd:'Beige',         th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:40,thr:5},
    '18':{name:'1-047',cat:'11PLY SOLID MARINE',cd:'Fabric Gray',   th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:42,thr:5},
    '19':{name:'1-044',cat:'11PLY SOLID MARINE',cd:'Silver Gray',   th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:44,thr:5},
    '20':{name:'1-043',cat:'11PLY SOLID MARINE',cd:'Dark Acacia',   th:'18mm',sz:"4'×8'",un:'pcs',cost:1800,price:2250,stock:47,thr:5},

    // COMPACT MARINE — ₱2,000
    '21':{name:'2-025',cat:'COMPACT MARINE',cd:'Brown Walnut',  th:'18mm',sz:"4'×8'",un:'pcs',cost:1600,price:2000,stock:26,thr:5},
    '22':{name:'2-023',cat:'COMPACT MARINE',cd:'Yellow Birch',  th:'18mm',sz:"4'×8'",un:'pcs',cost:1600,price:2000,stock:34,thr:5},
    '23':{name:'2-017',cat:'COMPACT MARINE',cd:'Macassar',      th:'18mm',sz:"4'×8'",un:'pcs',cost:1600,price:2000,stock:35,thr:5},
    '24':{name:'2-041',cat:'COMPACT MARINE',cd:'Wild Cherry',   th:'18mm',sz:"4'×8'",un:'pcs',cost:1600,price:2000,stock:36,thr:5},
    '25':{name:'2-022',cat:'COMPACT MARINE',cd:'Serpent',       th:'18mm',sz:"4'×8'",un:'pcs',cost:1600,price:2000,stock:37,thr:5},
    '26':{name:'2-021',cat:'COMPACT MARINE',cd:'Walnut Gray',   th:'18mm',sz:"4'×8'",un:'pcs',cost:1600,price:2000,stock:35,thr:5},
    '27':{name:'2-001',cat:'COMPACT MARINE',cd:'Warm White',    th:'18mm',sz:"4'×8'",un:'pcs',cost:1600,price:2000,stock:38,thr:5},
    '28':{name:'2-000',cat:'COMPACT MARINE',cd:'Real White',    th:'18mm',sz:"4'×8'",un:'pcs',cost:1600,price:2000,stock:36,thr:5},
    '29':{name:'2-024',cat:'COMPACT MARINE',cd:'Gray Birch',    th:'18mm',sz:"4'×8'",un:'pcs',cost:1600,price:2000,stock:44,thr:5},

    // LAMINATED PLYBOARD — ₱1,950
    '30':{name:'B-005',cat:'LAMINATED PLYBOARD',cd:'Shadow Oak',   th:'18mm',sz:"4'×8'",un:'pcs',cost:1560,price:1950,stock:37,thr:5},
    '31':{name:'B-001',cat:'LAMINATED PLYBOARD',cd:'Warm White',   th:'18mm',sz:"4'×8'",un:'pcs',cost:1560,price:1950,stock:42,thr:5},
    '32':{name:'B-006',cat:'LAMINATED PLYBOARD',cd:'Charcoal Gray',th:'18mm',sz:"4'×8'",un:'pcs',cost:1560,price:1950,stock:36,thr:5},
    '33':{name:'B-027',cat:'LAMINATED PLYBOARD',cd:'Lumenteak',    th:'18mm',sz:"4'×8'",un:'pcs',cost:1560,price:1950,stock:38,thr:5},
    '34':{name:'B-000',cat:'LAMINATED PLYBOARD',cd:'Real White',   th:'18mm',sz:"4'×8'",un:'pcs',cost:1560,price:1950,stock:44,thr:5},

    // PETG HIGH GLOSS — ₱3,500
    '35':{name:'009H',cat:'PETG HIGH GLOSS',cd:'Olive Green',  th:'18mm',sz:"4'×8'",un:'pcs',cost:2800,price:3500,stock:17,thr:5},
    '36':{name:'003H',cat:'PETG HIGH GLOSS',cd:'Light Gray',   th:'18mm',sz:"4'×8'",un:'pcs',cost:2800,price:3500,stock:42,thr:5},
    '37':{name:'001H',cat:'PETG HIGH GLOSS',cd:'White Glossy', th:'18mm',sz:"4'×8'",un:'pcs',cost:2800,price:3500,stock:12,thr:5},
    '38':{name:'006H',cat:'PETG HIGH GLOSS',cd:'Mocha',        th:'18mm',sz:"4'×8'",un:'pcs',cost:2800,price:3500,stock:23,thr:5},
    '39':{name:'012H',cat:'PETG HIGH GLOSS',cd:'Dark Gray',    th:'18mm',sz:"4'×8'",un:'pcs',cost:2800,price:3500,stock:39,thr:5},
    '40':{name:'005H',cat:'PETG HIGH GLOSS',cd:'Light Blue',   th:'18mm',sz:"4'×8'",un:'pcs',cost:2800,price:3500,stock:33,thr:5},

    // UV GLOSS — ₱3,000
    '41':{name:'UV-040',cat:'UV GLOSS',cd:'White Gloss',th:'18mm',sz:"4'×8'",un:'pcs',cost:2400,price:3000,stock:5,thr:5},

    // UV MARBLE — ₱3,100
    '42':{name:'042',cat:'UV MARBLE',cd:'Marble',th:'18mm',sz:"4'×8'",un:'pcs',cost:2480,price:3100,stock:41,thr:5},

    // 6MM BACKING — ₱1,100
    '43':{name:'000',cat:'6MM BACKING',cd:'Real White',     th:'6mm',sz:"4'×8'",un:'pcs',cost:880,price:1100,stock:29,thr:5},
    '44':{name:'001',cat:'6MM BACKING',cd:'Warm White',     th:'6mm',sz:"4'×8'",un:'pcs',cost:880,price:1100,stock:30,thr:5},
    '45':{name:'034',cat:'6MM BACKING',cd:'Light Metallic', th:'6mm',sz:"4'×8'",un:'pcs',cost:880,price:1100,stock:40,thr:5},
    '46':{name:'015',cat:'6MM BACKING',cd:'Gray Oak',       th:'6mm',sz:"4'×8'",un:'pcs',cost:880,price:1100,stock:37,thr:5},
    '47':{name:'033',cat:'6MM BACKING',cd:'Fabric',         th:'6mm',sz:"4'×8'",un:'pcs',cost:880,price:1100,stock:37,thr:5},
    '48':{name:'023',cat:'6MM BACKING',cd:'Yellow Birch',   th:'6mm',sz:"4'×8'",un:'pcs',cost:880,price:1100,stock:42,thr:5},
    '49':{name:'016',cat:'6MM BACKING',cd:'Silver Ash',     th:'6mm',sz:"4'×8'",un:'pcs',cost:880,price:1100,stock:36,thr:5},
    '50':{name:'014',cat:'6MM BACKING',cd:'Gray Stone',     th:'6mm',sz:"4'×8'",un:'pcs',cost:880,price:1100,stock:40,thr:5},

    // ── EDGEBAND (Regular) ₱17/meter — 3-digit color codes matching all board designs ──
    '51':{name:'EB-000',cat:'EDGEBAND',cd:'Real White',    th:null,sz:null,un:'meter',cost:10,price:17,stock:290,thr:100},
    '52':{name:'EB-001',cat:'EDGEBAND',cd:'Warm White',    th:null,sz:null,un:'meter',cost:10,price:17,stock:245,thr:100},
    '53':{name:'EB-005',cat:'EDGEBAND',cd:'Shadow Oak',    th:null,sz:null,un:'meter',cost:10,price:17,stock:455,thr:100},
    '54':{name:'EB-006',cat:'EDGEBAND',cd:'Charcoal Gray', th:null,sz:null,un:'meter',cost:10,price:17,stock:450,thr:100},
    '55':{name:'EB-009',cat:'EDGEBAND',cd:'Golden Oak',    th:null,sz:null,un:'meter',cost:10,price:17,stock:415,thr:100},
    '56':{name:'EB-014',cat:'EDGEBAND',cd:'Gray Stone',    th:null,sz:null,un:'meter',cost:10,price:17,stock:440,thr:100},
    '57':{name:'EB-015',cat:'EDGEBAND',cd:'Gray Oak',      th:null,sz:null,un:'meter',cost:10,price:17,stock:395,thr:100},
    '58':{name:'EB-016',cat:'EDGEBAND',cd:'Silver Ash',    th:null,sz:null,un:'meter',cost:10,price:17,stock:455,thr:100},
    '59':{name:'EB-017',cat:'EDGEBAND',cd:'Macassar',      th:null,sz:null,un:'meter',cost:10,price:17,stock:350,thr:100},
    '60':{name:'EB-021',cat:'EDGEBAND',cd:'Walnut Gray',   th:null,sz:null,un:'meter',cost:10,price:17,stock:390,thr:100},
    '61':{name:'EB-022',cat:'EDGEBAND',cd:'Serpent',       th:null,sz:null,un:'meter',cost:10,price:17,stock:420,thr:100},
    '62':{name:'EB-023',cat:'EDGEBAND',cd:'Yellow Birch',  th:null,sz:null,un:'meter',cost:10,price:17,stock:200,thr:100},
    '63':{name:'EB-024',cat:'EDGEBAND',cd:'Gray Birch',    th:null,sz:null,un:'meter',cost:10,price:17,stock:460,thr:100},
    '64':{name:'EB-025',cat:'EDGEBAND',cd:'Brown Walnut',  th:null,sz:null,un:'meter',cost:10,price:17,stock:230,thr:100},
    '65':{name:'EB-027',cat:'EDGEBAND',cd:'Lumenteak',     th:null,sz:null,un:'meter',cost:10,price:17,stock:445,thr:100},
    '66':{name:'EB-031',cat:'EDGEBAND',cd:'Maridon Oak',   th:null,sz:null,un:'meter',cost:10,price:17,stock:365,thr:100},
    '67':{name:'EB-033',cat:'EDGEBAND',cd:'Fabric Cream',  th:null,sz:null,un:'meter',cost:10,price:17,stock:455,thr:100},
    '68':{name:'EB-034',cat:'EDGEBAND',cd:'Metallic Dark', th:null,sz:null,un:'meter',cost:10,price:17,stock:490,thr:100},
    '69':{name:'EB-039',cat:'EDGEBAND',cd:'Dark Metallic', th:null,sz:null,un:'meter',cost:10,price:17,stock:410,thr:100},
    '70':{name:'EB-041',cat:'EDGEBAND',cd:'Wild Cherry',   th:null,sz:null,un:'meter',cost:10,price:17,stock:335,thr:100},
    '71':{name:'EB-043',cat:'EDGEBAND',cd:'Dark Acacia',   th:null,sz:null,un:'meter',cost:10,price:17,stock:470,thr:100},
    '72':{name:'EB-044',cat:'EDGEBAND',cd:'Silver Gray',   th:null,sz:null,un:'meter',cost:10,price:17,stock:455,thr:100},
    '73':{name:'EB-045',cat:'EDGEBAND',cd:'Beige',         th:null,sz:null,un:'meter',cost:10,price:17,stock:450,thr:100},
    '74':{name:'EB-046',cat:'EDGEBAND',cd:'Natural Oak',   th:null,sz:null,un:'meter',cost:10,price:17,stock:380,thr:100},
    '75':{name:'EB-047',cat:'EDGEBAND',cd:'Fabric Gray',   th:null,sz:null,un:'meter',cost:10,price:17,stock:460,thr:100},
    '76':{name:'EB-048',cat:'EDGEBAND',cd:'Light Acacia',  th:null,sz:null,un:'meter',cost:10,price:17,stock:420,thr:100},

    // ── EDGEBAND GLOSS ₱23/meter — PETG HIGH GLOSS & UV colors only ──
    '77':{name:'EBG-009H',cat:'EDGEBAND GLOSS',cd:'Olive Green',  th:null,sz:null,un:'meter',cost:16,price:23,stock:155,thr:100},
    '78':{name:'EBG-003H',cat:'EDGEBAND GLOSS',cd:'Light Gray',   th:null,sz:null,un:'meter',cost:16,price:23,stock:440,thr:100},
    '79':{name:'EBG-001H',cat:'EDGEBAND GLOSS',cd:'White Glossy', th:null,sz:null,un:'meter',cost:16,price:23,stock:195,thr:100},
    '80':{name:'EBG-006H',cat:'EDGEBAND GLOSS',cd:'Mocha',        th:null,sz:null,un:'meter',cost:16,price:23,stock:290,thr:100},
    '81':{name:'EBG-012H',cat:'EDGEBAND GLOSS',cd:'Dark Gray',    th:null,sz:null,un:'meter',cost:16,price:23,stock:425,thr:100},
    '82':{name:'EBG-005H',cat:'EDGEBAND GLOSS',cd:'Light Blue',   th:null,sz:null,un:'meter',cost:16,price:23,stock:365,thr:100},
    '83':{name:'EBG-040', cat:'EDGEBAND GLOSS',cd:'White Gloss',  th:null,sz:null,un:'meter',cost:16,price:23,stock:285,thr:100},
    '84':{name:'EBG-042', cat:'EDGEBAND GLOSS',cd:'Marble',       th:null,sz:null,un:'meter',cost:16,price:23,stock:440,thr:100},
  };
  localStorage.setItem('sb_products', JSON.stringify(defaultProducts));
}

// ── Sales (3 months, Jan–Mar 2026) ───────────────────────────────
if (!localStorage.getItem('sb_sales')) {
  const defaultSales = [
    // JANUARY 2026
    {id:1, date:'2026-01-03',pid:'1', name:'1-023',cat:'11PLY SOLID MARINE',cd:'Yellow Birch', th:'18mm',sz:"4'×8'",un:'pcs',qty:10,ppu:2250,total:22500},
    {id:2, date:'2026-01-04',pid:'2', name:'1-031',cat:'11PLY SOLID MARINE',cd:'Maridon Oak',  th:'18mm',sz:"4'×8'",un:'pcs',qty:5, ppu:2250,total:11250},
    {id:3, date:'2026-01-05',pid:'21',name:'2-025',cat:'COMPACT MARINE',    cd:'Brown Walnut', th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2000,total:8000},
    {id:4, date:'2026-01-06',pid:'22',name:'2-023',cat:'COMPACT MARINE',    cd:'Yellow Birch', th:'18mm',sz:"4'×8'",un:'pcs',qty:8, ppu:2000,total:16000},
    {id:5, date:'2026-01-07',pid:'3', name:'1-009',cat:'11PLY SOLID MARINE',cd:'Golden Oak',   th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2250,total:6750},
    {id:6, date:'2026-01-09',pid:'26',name:'2-021',cat:'COMPACT MARINE',    cd:'Walnut Gray',  th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2000,total:8000},
    {id:7, date:'2026-01-10',pid:'4', name:'1-000',cat:'11PLY SOLID MARINE',cd:'Real White',   th:'18mm',sz:"4'×8'",un:'pcs',qty:6, ppu:2250,total:13500},
    {id:8, date:'2026-01-11',pid:'25',name:'2-022',cat:'COMPACT MARINE',    cd:'Serpent',      th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:2000,total:4000},
    {id:9, date:'2026-01-12',pid:'5', name:'1-001',cat:'11PLY SOLID MARINE',cd:'Warm White',   th:'18mm',sz:"4'×8'",un:'pcs',qty:6, ppu:2250,total:13500},
    {id:10,inv:'SI-0010',date:'2026-01-13',pid:'37',name:'001H', cat:'PETG HIGH GLOSS',    cd:'White Glossy', th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3500,total:7000},
    {id:11,inv:'SI-0011',date:'2026-01-13',pid:'41',name:'UV-040',cat:'UV GLOSS',         cd:'White Gloss',  th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3000,total:6000},
    {id:12,inv:'SI-0012',date:'2026-01-14',pid:'29',name:'2-024',cat:'COMPACT MARINE',    cd:'Gray Birch',   th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2000,total:8000},
    {id:13,inv:'SI-0013',date:'2026-01-16',pid:'6', name:'1-017',cat:'11PLY SOLID MARINE',cd:'Macassar',     th:'18mm',sz:"4'×8'",un:'pcs',qty:7, ppu:2250,total:15750},
    {id:14,inv:'SI-0014',date:'2026-01-17',pid:'32',name:'B-006',cat:'LAMINATED PLYBOARD',cd:'Charcoal Gray',th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:1950,total:3900},
    {id:15,inv:'SI-0015',date:'2026-01-18',pid:'35',name:'009H', cat:'PETG HIGH GLOSS',    cd:'Olive Green',  th:'18mm',sz:"4'×8'",un:'pcs',qty:5, ppu:3500,total:17500},
    {id:16,inv:'SI-0016',date:'2026-01-18',pid:'36',name:'003H', cat:'PETG HIGH GLOSS',    cd:'Light Gray',   th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3500,total:7000},
    {id:17,inv:'SI-0017',date:'2026-01-19',pid:'24',name:'2-041',cat:'COMPACT MARINE',    cd:'Wild Cherry',  th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2000,total:8000},
    {id:18,inv:'SI-0018',date:'2026-01-20',pid:'7', name:'1-015',cat:'11PLY SOLID MARINE',cd:'Gray Oak',     th:'18mm',sz:"4'×8'",un:'pcs',qty:6, ppu:2250,total:13500},
    {id:19,inv:'SI-0019',date:'2026-01-23',pid:'39',name:'012H', cat:'PETG HIGH GLOSS',    cd:'Dark Gray',    th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:3500,total:10500},
    {id:20,inv:'SI-0020',date:'2026-01-25',pid:'9', name:'1-039',cat:'11PLY SOLID MARINE',cd:'Dark Metallic',th:'18mm',sz:"4'×8'",un:'pcs',qty:5, ppu:2250,total:11250},
    {id:21,inv:'SI-0021',date:'2026-01-26',pid:'38',name:'006H', cat:'PETG HIGH GLOSS',    cd:'Mocha',        th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:3500,total:14000},
    {id:22,inv:'SI-0022',date:'2026-01-26',pid:'42',name:'042',  cat:'UV MARBLE',         cd:'Marble',       th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3100,total:6200},
    {id:23,inv:'SI-0023',date:'2026-01-27',pid:'27',name:'2-001',cat:'COMPACT MARINE',    cd:'Warm White',   th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2000,total:8000},
    {id:24,inv:'SI-0024',date:'2026-01-28',pid:'10',name:'1-014',cat:'11PLY SOLID MARINE',cd:'Gray Stone',   th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2250,total:9000},
    {id:25,inv:'SI-0025',date:'2026-01-29',pid:'11',name:'1-016',cat:'11PLY SOLID MARINE',cd:'Silver Ash',   th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2250,total:6750},
    {id:26,inv:'SI-0026',date:'2026-01-30',pid:'35',name:'009H', cat:'PETG HIGH GLOSS',    cd:'Olive Green',  th:'18mm',sz:"4'×8'",un:'pcs',qty:6, ppu:3500,total:21000},
    {id:27,inv:'SI-0027',date:'2026-01-30',pid:'41',name:'UV-040',cat:'UV GLOSS',         cd:'White Gloss',  th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:3000,total:9000},
    {id:28,inv:'SI-0028',date:'2026-01-31',pid:'12',name:'1-034',cat:'11PLY SOLID MARINE',cd:'Metallic Dark',th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:2250,total:4500},
    {id:29,inv:'SI-0029',date:'2026-01-31',pid:'21',name:'2-025',cat:'COMPACT MARINE',    cd:'Brown Walnut', th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2000,total:6000},

    // FEBRUARY 2026
    {id:30,inv:'SI-0030',date:'2026-02-02',pid:'13',name:'1-041',cat:'11PLY SOLID MARINE',cd:'Wild Cherry',  th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2250,total:9000},
    {id:31,inv:'SI-0031',date:'2026-02-02',pid:'21',name:'2-025',cat:'COMPACT MARINE',    cd:'Brown Walnut', th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2000,total:6000},
    {id:32,inv:'SI-0032',date:'2026-02-03',pid:'30',name:'B-005',cat:'LAMINATED PLYBOARD',cd:'Shadow Oak',   th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:1950,total:5850},
    {id:33,inv:'SI-0033',date:'2026-02-04',pid:'35',name:'009H', cat:'PETG HIGH GLOSS',    cd:'Olive Green',  th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3500,total:7000},
    {id:34,inv:'SI-0034',date:'2026-02-04',pid:'37',name:'001H', cat:'PETG HIGH GLOSS',    cd:'White Glossy', th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3500,total:7000},
    {id:35,inv:'SI-0035',date:'2026-02-05',pid:'14',name:'1-021',cat:'11PLY SOLID MARINE',cd:'Walnut Gray',  th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:2250,total:4500},
    {id:36,inv:'SI-0036',date:'2026-02-05',pid:'26',name:'2-021',cat:'COMPACT MARINE',    cd:'Walnut Gray',  th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2000,total:6000},
    {id:37,inv:'SI-0037',date:'2026-02-06',pid:'15',name:'1-046',cat:'11PLY SOLID MARINE',cd:'Natural Oak',  th:'18mm',sz:"4'×8'",un:'pcs',qty:8, ppu:2250,total:18000},
    {id:38,inv:'SI-0038',date:'2026-02-09',pid:'25',name:'2-022',cat:'COMPACT MARINE',    cd:'Serpent',      th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2000,total:6000},
    {id:39,inv:'SI-0039',date:'2026-02-10',pid:'38',name:'006H', cat:'PETG HIGH GLOSS',    cd:'Mocha',        th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3500,total:7000},
    {id:40,inv:'SI-0040',date:'2026-02-10',pid:'39',name:'012H', cat:'PETG HIGH GLOSS',    cd:'Dark Gray',    th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3500,total:7000},
    {id:41,inv:'SI-0041',date:'2026-02-11',pid:'16',name:'1-048',cat:'11PLY SOLID MARINE',cd:'Light Acacia', th:'18mm',sz:"4'×8'",un:'pcs',qty:8, ppu:2250,total:18000},
    {id:42,inv:'SI-0042',date:'2026-02-12',pid:'32',name:'B-006',cat:'LAMINATED PLYBOARD',cd:'Charcoal Gray',th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:1950,total:3900},
    {id:43,inv:'SI-0043',date:'2026-02-13',pid:'17',name:'1-045',cat:'11PLY SOLID MARINE',cd:'Beige',        th:'18mm',sz:"4'×8'",un:'pcs',qty:5, ppu:2250,total:11250},
    {id:44,inv:'SI-0044',date:'2026-02-14',pid:'36',name:'003H', cat:'PETG HIGH GLOSS',    cd:'Light Gray',   th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3500,total:7000},
    {id:45,inv:'SI-0045',date:'2026-02-14',pid:'41',name:'UV-040',cat:'UV GLOSS',         cd:'White Gloss',  th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3000,total:6000},
    {id:46,inv:'SI-0046',date:'2026-02-16',pid:'35',name:'009H', cat:'PETG HIGH GLOSS',    cd:'Olive Green',  th:'18mm',sz:"4'×8'",un:'pcs',qty:5, ppu:3500,total:17500},
    {id:47,inv:'SI-0047',date:'2026-02-16',pid:'37',name:'001H', cat:'PETG HIGH GLOSS',    cd:'White Glossy', th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:3500,total:10500},
    {id:48,inv:'SI-0048',date:'2026-02-18',pid:'33',name:'B-027',cat:'LAMINATED PLYBOARD',cd:'Lumenteak',    th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:1950,total:3900},
    {id:49,inv:'SI-0049',date:'2026-02-18',pid:'34',name:'B-000',cat:'LAMINATED PLYBOARD',cd:'Real White',   th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:1950,total:3900},
    {id:50,inv:'SI-0050',date:'2026-02-19',pid:'18',name:'1-047',cat:'11PLY SOLID MARINE',cd:'Fabric Gray',  th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2250,total:9000},
    {id:51,inv:'SI-0051',date:'2026-02-19',pid:'24',name:'2-041',cat:'COMPACT MARINE',    cd:'Wild Cherry',  th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2000,total:6000},
    {id:52,inv:'SI-0052',date:'2026-02-20',pid:'40',name:'005H', cat:'PETG HIGH GLOSS',    cd:'Light Blue',   th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:3500,total:14000},
    {id:53,inv:'SI-0053',date:'2026-02-20',pid:'38',name:'006H', cat:'PETG HIGH GLOSS',    cd:'Mocha',        th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:3500,total:10500},
    {id:54,inv:'SI-0054',date:'2026-02-23',pid:'19',name:'1-044',cat:'11PLY SOLID MARINE',cd:'Silver Gray',  th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2250,total:6750},
    {id:55,inv:'SI-0055',date:'2026-02-24',pid:'20',name:'1-043',cat:'11PLY SOLID MARINE',cd:'Dark Acacia',  th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2250,total:6750},
    {id:56,inv:'SI-0056',date:'2026-02-25',pid:'21',name:'2-025',cat:'COMPACT MARINE',    cd:'Brown Walnut', th:'18mm',sz:"4'×8'",un:'pcs',qty:6, ppu:2000,total:12000},
    {id:57,inv:'SI-0057',date:'2026-02-26',pid:'39',name:'012H', cat:'PETG HIGH GLOSS',    cd:'Dark Gray',    th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3500,total:7000},
    {id:58,inv:'SI-0058',date:'2026-02-26',pid:'41',name:'UV-040',cat:'UV GLOSS',         cd:'White Gloss',  th:'18mm',sz:"4'×8'",un:'pcs',qty:1, ppu:3000,total:3000},
    {id:59,inv:'SI-0059',date:'2026-02-27',pid:'37',name:'001H', cat:'PETG HIGH GLOSS',    cd:'White Glossy', th:'18mm',sz:"4'×8'",un:'pcs',qty:6, ppu:3500,total:21000},
    {id:60,inv:'SI-0060',date:'2026-02-27',pid:'41',name:'UV-040',cat:'UV GLOSS',         cd:'White Gloss',  th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:3000,total:12000},
    {id:61,inv:'SI-0061',date:'2026-02-28',pid:'1', name:'1-023',cat:'11PLY SOLID MARINE',cd:'Yellow Birch', th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2250,total:9000},
    {id:62,inv:'SI-0062',date:'2026-02-28',pid:'27',name:'2-001',cat:'COMPACT MARINE',    cd:'Warm White',   th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2000,total:8000},

    // MARCH 2026
    {id:63,inv:'SI-0063',date:'2026-03-02',pid:'1', name:'1-023',cat:'11PLY SOLID MARINE',cd:'Yellow Birch', th:'18mm',sz:"4'×8'",un:'pcs',qty:8, ppu:2250,total:18000},
    {id:64,inv:'SI-0064',date:'2026-03-02',pid:'21',name:'2-025',cat:'COMPACT MARINE',    cd:'Brown Walnut', th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2000,total:8000},
    {id:65,inv:'SI-0065',date:'2026-03-03',pid:'2', name:'1-031',cat:'11PLY SOLID MARINE',cd:'Maridon Oak',  th:'18mm',sz:"4'×8'",un:'pcs',qty:6, ppu:2250,total:13500},
    {id:66,inv:'SI-0066',date:'2026-03-04',pid:'40',name:'005H', cat:'PETG HIGH GLOSS',    cd:'Light Blue',   th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:3500,total:10500},
    {id:67,inv:'SI-0067',date:'2026-03-04',pid:'41',name:'UV-040',cat:'UV GLOSS',         cd:'White Gloss',  th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3000,total:6000},
    {id:68,inv:'SI-0068',date:'2026-03-04',pid:'42',name:'042',  cat:'UV MARBLE',         cd:'Marble',       th:'18mm',sz:"4'×8'",un:'pcs',qty:1, ppu:3100,total:3100},
    {id:69,inv:'SI-0069',date:'2026-03-05',pid:'25',name:'2-022',cat:'COMPACT MARINE',    cd:'Serpent',      th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2000,total:6000},
    {id:70,inv:'SI-0070',date:'2026-03-06',pid:'38',name:'006H', cat:'PETG HIGH GLOSS',    cd:'Mocha',        th:'18mm',sz:"4'×8'",un:'pcs',qty:6, ppu:3500,total:21000},
    {id:71,inv:'SI-0071',date:'2026-03-07',pid:'7', name:'1-015',cat:'11PLY SOLID MARINE',cd:'Gray Oak',     th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2250,total:6750},
    {id:72,inv:'SI-0072',date:'2026-03-09',pid:'35',name:'009H', cat:'PETG HIGH GLOSS',    cd:'Olive Green',  th:'18mm',sz:"4'×8'",un:'pcs',qty:6, ppu:3500,total:21000},
    {id:73,inv:'SI-0073',date:'2026-03-09',pid:'37',name:'001H', cat:'PETG HIGH GLOSS',    cd:'White Glossy', th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:3500,total:10500},
    {id:74,inv:'SI-0074',date:'2026-03-10',pid:'23',name:'2-017',cat:'COMPACT MARINE',    cd:'Macassar',     th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2000,total:8000},
    {id:75,inv:'SI-0075',date:'2026-03-10',pid:'31',name:'B-001',cat:'LAMINATED PLYBOARD',cd:'Warm White',   th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:1950,total:5850},
    {id:76,inv:'SI-0076',date:'2026-03-11',pid:'32',name:'B-006',cat:'LAMINATED PLYBOARD',cd:'Charcoal Gray',th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:1950,total:5850},
    {id:77,inv:'SI-0077',date:'2026-03-12',pid:'4', name:'1-000',cat:'11PLY SOLID MARINE',cd:'Real White',   th:'18mm',sz:"4'×8'",un:'pcs',qty:10,ppu:2250,total:22500},
    {id:78,inv:'SI-0078',date:'2026-03-13',pid:'5', name:'1-001',cat:'11PLY SOLID MARINE',cd:'Warm White',   th:'18mm',sz:"4'×8'",un:'pcs',qty:7, ppu:2250,total:15750},
    {id:79,inv:'SI-0079',date:'2026-03-14',pid:'35',name:'009H', cat:'PETG HIGH GLOSS',    cd:'Olive Green',  th:'18mm',sz:"4'×8'",un:'pcs',qty:5, ppu:3500,total:17500},
    {id:80,inv:'SI-0080',date:'2026-03-14',pid:'41',name:'UV-040',cat:'UV GLOSS',         cd:'White Gloss',  th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3000,total:6000},
    {id:81,inv:'SI-0081',date:'2026-03-14',pid:'42',name:'042',  cat:'UV MARBLE',         cd:'Marble',       th:'18mm',sz:"4'×8'",un:'pcs',qty:1, ppu:3100,total:3100},
    {id:82,inv:'SI-0082',date:'2026-03-17',pid:'39',name:'012H', cat:'PETG HIGH GLOSS',    cd:'Dark Gray',    th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3500,total:7000},
    {id:83,inv:'SI-0083',date:'2026-03-17',pid:'38',name:'006H', cat:'PETG HIGH GLOSS',    cd:'Mocha',        th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3500,total:7000},
    {id:84,inv:'SI-0084',date:'2026-03-17',pid:'41',name:'UV-040',cat:'UV GLOSS',         cd:'White Gloss',  th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3000,total:6000},
    {id:85,inv:'SI-0085',date:'2026-03-18',pid:'24',name:'2-041',cat:'COMPACT MARINE',    cd:'Wild Cherry',  th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2000,total:8000},
    {id:86,inv:'SI-0086',date:'2026-03-19',pid:'37',name:'001H', cat:'PETG HIGH GLOSS',    cd:'White Glossy', th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:3500,total:14000},
    {id:87,inv:'SI-0087',date:'2026-03-19',pid:'36',name:'003H', cat:'PETG HIGH GLOSS',    cd:'Light Gray',   th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:3500,total:14000},
    {id:88,inv:'SI-0088',date:'2026-03-20',pid:'33',name:'B-027',cat:'LAMINATED PLYBOARD',cd:'Lumenteak',    th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:1950,total:5850},
    {id:89,inv:'SI-0089',date:'2026-03-21',pid:'15',name:'1-046',cat:'11PLY SOLID MARINE',cd:'Natural Oak',  th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2250,total:9000},
    {id:90,inv:'SI-0090',date:'2026-03-21',pid:'26',name:'2-021',cat:'COMPACT MARINE',    cd:'Walnut Gray',  th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2000,total:6000},
    {id:91,inv:'SI-0091',date:'2026-03-23',pid:'35',name:'009H', cat:'PETG HIGH GLOSS',    cd:'Olive Green',  th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:3500,total:14000},
    {id:92,inv:'SI-0092',date:'2026-03-23',pid:'40',name:'005H', cat:'PETG HIGH GLOSS',    cd:'Light Blue',   th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3500,total:7000},
    {id:93,inv:'SI-0093',date:'2026-03-23',pid:'42',name:'042',  cat:'UV MARBLE',         cd:'Marble',       th:'18mm',sz:"4'×8'",un:'pcs',qty:1, ppu:3100,total:3100},
    {id:94,inv:'SI-0094',date:'2026-03-25',pid:'37',name:'001H', cat:'PETG HIGH GLOSS',    cd:'White Glossy', th:'18mm',sz:"4'×8'",un:'pcs',qty:5, ppu:3500,total:17500},
    {id:95,inv:'SI-0095',date:'2026-03-25',pid:'41',name:'UV-040',cat:'UV GLOSS',         cd:'White Gloss',  th:'18mm',sz:"4'×8'",un:'pcs',qty:5, ppu:3000,total:15000},
    {id:96,inv:'SI-0096',date:'2026-03-25',pid:'42',name:'042',  cat:'UV MARBLE',         cd:'Marble',       th:'18mm',sz:"4'×8'",un:'pcs',qty:1, ppu:3100,total:3100},
    {id:97,inv:'SI-0097',date:'2026-03-26',pid:'6', name:'1-017',cat:'11PLY SOLID MARINE',cd:'Macassar',     th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2250,total:9000},
    {id:98,inv:'SI-0098',date:'2026-03-26',pid:'34',name:'B-000',cat:'LAMINATED PLYBOARD',cd:'Real White',   th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:1950,total:3900},
    {id:99,inv:'SI-0099',date:'2026-03-27',pid:'8', name:'1-033',cat:'11PLY SOLID MARINE',cd:'Fabric Cream', th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2250,total:6750},
    {id:100,inv:'SI-0100',date:'2026-03-27',pid:'28',name:'2-000',cat:'COMPACT MARINE',   cd:'Real White',   th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:2000,total:6000},
    {id:101,inv:'SI-0101',date:'2026-03-28',pid:'38',name:'006H', cat:'PETG HIGH GLOSS',   cd:'Mocha',        th:'18mm',sz:"4'×8'",un:'pcs',qty:3, ppu:3500,total:10500},
    {id:102,inv:'SI-0102',date:'2026-03-28',pid:'41',name:'UV-040',cat:'UV GLOSS',        cd:'White Gloss',  th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3000,total:6000},
    {id:103,inv:'SI-0103',date:'2026-03-28',pid:'42',name:'042',  cat:'UV MARBLE',        cd:'Marble',       th:'18mm',sz:"4'×8'",un:'pcs',qty:1, ppu:3100,total:3100},
    {id:104,inv:'SI-0104',date:'2026-03-29',pid:'21',name:'2-025',cat:'COMPACT MARINE',   cd:'Brown Walnut', th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2000,total:8000},
    {id:105,inv:'SI-0105',date:'2026-03-29',pid:'9', name:'1-039',cat:'11PLY SOLID MARINE',cd:'Dark Metallic',th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2250,total:9000},
    {id:106,inv:'SI-0106',date:'2026-03-30',pid:'37',name:'001H', cat:'PETG HIGH GLOSS',   cd:'White Glossy', th:'18mm',sz:"4'×8'",un:'pcs',qty:6, ppu:3500,total:21000},
    {id:107,inv:'SI-0107',date:'2026-03-30',pid:'40',name:'005H', cat:'PETG HIGH GLOSS',   cd:'Light Blue',   th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:3500,total:14000},
    {id:108,inv:'SI-0108',date:'2026-03-30',pid:'41',name:'UV-040',cat:'UV GLOSS',        cd:'White Gloss',  th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:3000,total:6000},
    {id:109,inv:'SI-0109',date:'2026-03-31',pid:'3', name:'1-009',cat:'11PLY SOLID MARINE',cd:'Golden Oak',  th:'18mm',sz:"4'×8'",un:'pcs',qty:4, ppu:2250,total:9000},
    {id:110,inv:'SI-0110',date:'2026-03-31',pid:'25',name:'2-022',cat:'COMPACT MARINE',   cd:'Serpent',      th:'18mm',sz:"4'×8'",un:'pcs',qty:2, ppu:2000,total:4000},
      // -- EDGEBAND SALES (paired with each board sale) ------------------
    // Rules: 10-15m per board, multiples of 5 only, minimum 10m
    // Regular edgebands ?17/m | Gloss edgebands ?23/m
    // JANUARY 2026
    {id:112,inv:'SI-0112',date:'2026-01-03',pid:'62',name:'EB-023',cat:'EDGEBAND',      cd:'Yellow Birch', un:'meter',qty:100,ppu:17,total:1700},
    {id:113,inv:'SI-0113',date:'2026-01-04',pid:'66',name:'EB-031',cat:'EDGEBAND',      cd:'Maridon Oak',  un:'meter',qty:75, ppu:17,total:1275},
    {id:114,inv:'SI-0114',date:'2026-01-05',pid:'64',name:'EB-025',cat:'EDGEBAND',      cd:'Brown Walnut', un:'meter',qty:40, ppu:17,total:680},
    {id:115,inv:'SI-0115',date:'2026-01-06',pid:'62',name:'EB-023',cat:'EDGEBAND',      cd:'Yellow Birch', un:'meter',qty:80, ppu:17,total:1360},
    {id:116,inv:'SI-0116',date:'2026-01-07',pid:'55',name:'EB-009',cat:'EDGEBAND',      cd:'Golden Oak',   un:'meter',qty:45, ppu:17,total:765},
    {id:117,inv:'SI-0117',date:'2026-01-09',pid:'60',name:'EB-021',cat:'EDGEBAND',      cd:'Walnut Gray',  un:'meter',qty:40, ppu:17,total:680},
    {id:118,inv:'SI-0118',date:'2026-01-10',pid:'51',name:'EB-000',cat:'EDGEBAND',      cd:'Real White',   un:'meter',qty:60, ppu:17,total:1020},
    {id:119,inv:'SI-0119',date:'2026-01-11',pid:'61',name:'EB-022',cat:'EDGEBAND',      cd:'Serpent',      un:'meter',qty:10, ppu:17,total:170},
    {id:120,inv:'SI-0120',date:'2026-01-12',pid:'52',name:'EB-001',cat:'EDGEBAND',      cd:'Warm White',   un:'meter',qty:60, ppu:17,total:1020},
    {id:121,inv:'SI-0121',date:'2026-01-13',pid:'79',name:'EBG-001H',cat:'EDGEBAND GLOSS',cd:'White Glossy',un:'meter',qty:10,ppu:23,total:230},
    {id:122,inv:'SI-0122',date:'2026-01-13',pid:'83',name:'EBG-040',cat:'EDGEBAND GLOSS',cd:'White Gloss', un:'meter',qty:10, ppu:23,total:230},
    {id:123,inv:'SI-0123',date:'2026-01-14',pid:'63',name:'EB-024',cat:'EDGEBAND',      cd:'Gray Birch',   un:'meter',qty:40, ppu:17,total:680},
    {id:124,inv:'SI-0124',date:'2026-01-16',pid:'59',name:'EB-017',cat:'EDGEBAND',      cd:'Macassar',     un:'meter',qty:70, ppu:17,total:1190},
    {id:125,inv:'SI-0125',date:'2026-01-17',pid:'54',name:'EB-006',cat:'EDGEBAND',      cd:'Charcoal Gray',un:'meter',qty:10, ppu:17,total:170},
    {id:126,inv:'SI-0126',date:'2026-01-18',pid:'77',name:'EBG-009H',cat:'EDGEBAND GLOSS',cd:'Olive Green',un:'meter',qty:75,ppu:23,total:1725},
    {id:127,inv:'SI-0127',date:'2026-01-18',pid:'78',name:'EBG-003H',cat:'EDGEBAND GLOSS',cd:'Light Gray', un:'meter',qty:10, ppu:23,total:230},
    {id:128,inv:'SI-0128',date:'2026-01-19',pid:'70',name:'EB-041',cat:'EDGEBAND',      cd:'Wild Cherry',  un:'meter',qty:40, ppu:17,total:680},
    {id:129,inv:'SI-0129',date:'2026-01-20',pid:'57',name:'EB-015',cat:'EDGEBAND',      cd:'Gray Oak',     un:'meter',qty:60, ppu:17,total:1020},
    {id:130,inv:'SI-0130',date:'2026-01-23',pid:'81',name:'EBG-012H',cat:'EDGEBAND GLOSS',cd:'Dark Gray',  un:'meter',qty:45, ppu:23,total:1035},
    {id:131,inv:'SI-0131',date:'2026-01-25',pid:'69',name:'EB-039',cat:'EDGEBAND',      cd:'Dark Metallic',un:'meter',qty:50, ppu:17,total:850},
    {id:132,inv:'SI-0132',date:'2026-01-26',pid:'80',name:'EBG-006H',cat:'EDGEBAND GLOSS',cd:'Mocha',      un:'meter',qty:40, ppu:23,total:920},
    {id:133,inv:'SI-0133',date:'2026-01-26',pid:'84',name:'EBG-042',cat:'EDGEBAND GLOSS',cd:'Marble',      un:'meter',qty:10, ppu:23,total:230},
    {id:134,inv:'SI-0134',date:'2026-01-27',pid:'52',name:'EB-001',cat:'EDGEBAND',      cd:'Warm White',   un:'meter',qty:40, ppu:17,total:680},
    {id:135,inv:'SI-0135',date:'2026-01-28',pid:'56',name:'EB-014',cat:'EDGEBAND',      cd:'Gray Stone',   un:'meter',qty:60, ppu:17,total:1020},
    {id:136,inv:'SI-0136',date:'2026-01-29',pid:'58',name:'EB-016',cat:'EDGEBAND',      cd:'Silver Ash',   un:'meter',qty:45, ppu:17,total:765},
    {id:137,inv:'SI-0137',date:'2026-01-30',pid:'77',name:'EBG-009H',cat:'EDGEBAND GLOSS',cd:'Olive Green',un:'meter',qty:60,ppu:23,total:1380},
    {id:138,inv:'SI-0138',date:'2026-01-30',pid:'83',name:'EBG-040',cat:'EDGEBAND GLOSS',cd:'White Gloss', un:'meter',qty:45, ppu:23,total:1035},
    {id:139,inv:'SI-0139',date:'2026-01-31',pid:'68',name:'EB-034',cat:'EDGEBAND',      cd:'Metallic Dark',un:'meter',qty:10, ppu:17,total:170},
    {id:140,inv:'SI-0140',date:'2026-01-31',pid:'64',name:'EB-025',cat:'EDGEBAND',      cd:'Brown Walnut', un:'meter',qty:45, ppu:17,total:765},
    // FEBRUARY 2026
    {id:141,inv:'SI-0141',date:'2026-02-02',pid:'70',name:'EB-041',cat:'EDGEBAND',      cd:'Wild Cherry',  un:'meter',qty:40, ppu:17,total:680},
    {id:142,inv:'SI-0142',date:'2026-02-02',pid:'64',name:'EB-025',cat:'EDGEBAND',      cd:'Brown Walnut', un:'meter',qty:45, ppu:17,total:765},
    {id:143,inv:'SI-0143',date:'2026-02-03',pid:'53',name:'EB-005',cat:'EDGEBAND',      cd:'Shadow Oak',   un:'meter',qty:45, ppu:17,total:765},
    {id:144,inv:'SI-0144',date:'2026-02-04',pid:'77',name:'EBG-009H',cat:'EDGEBAND GLOSS',cd:'Olive Green',un:'meter',qty:10,ppu:23,total:230},
    {id:145,inv:'SI-0145',date:'2026-02-04',pid:'79',name:'EBG-001H',cat:'EDGEBAND GLOSS',cd:'White Glossy',un:'meter',qty:10,ppu:23,total:230},
    {id:146,inv:'SI-0146',date:'2026-02-05',pid:'60',name:'EB-021',cat:'EDGEBAND',      cd:'Walnut Gray',  un:'meter',qty:10, ppu:17,total:170},
    {id:147,inv:'SI-0147',date:'2026-02-05',pid:'60',name:'EB-021',cat:'EDGEBAND',      cd:'Walnut Gray',  un:'meter',qty:30, ppu:17,total:510},
    {id:148,inv:'SI-0148',date:'2026-02-06',pid:'74',name:'EB-046',cat:'EDGEBAND',      cd:'Natural Oak',  un:'meter',qty:80, ppu:17,total:1360},
    {id:149,inv:'SI-0149',date:'2026-02-09',pid:'61',name:'EB-022',cat:'EDGEBAND',      cd:'Serpent',      un:'meter',qty:30, ppu:17,total:510},
    {id:150,inv:'SI-0150',date:'2026-02-10',pid:'80',name:'EBG-006H',cat:'EDGEBAND GLOSS',cd:'Mocha',      un:'meter',qty:10, ppu:23,total:230},
    {id:151,inv:'SI-0151',date:'2026-02-10',pid:'81',name:'EBG-012H',cat:'EDGEBAND GLOSS',cd:'Dark Gray',  un:'meter',qty:10, ppu:23,total:230},
    {id:152,inv:'SI-0152',date:'2026-02-11',pid:'76',name:'EB-048',cat:'EDGEBAND',      cd:'Light Acacia', un:'meter',qty:80, ppu:17,total:1360},
    {id:153,inv:'SI-0153',date:'2026-02-12',pid:'54',name:'EB-006',cat:'EDGEBAND',      cd:'Charcoal Gray',un:'meter',qty:10, ppu:17,total:170},
    {id:154,inv:'SI-0154',date:'2026-02-13',pid:'73',name:'EB-045',cat:'EDGEBAND',      cd:'Beige',        un:'meter',qty:50, ppu:17,total:850},
    {id:155,inv:'SI-0155',date:'2026-02-14',pid:'78',name:'EBG-003H',cat:'EDGEBAND GLOSS',cd:'Light Gray', un:'meter',qty:10, ppu:23,total:230},
    {id:156,inv:'SI-0156',date:'2026-02-14',pid:'83',name:'EBG-040',cat:'EDGEBAND GLOSS',cd:'White Gloss', un:'meter',qty:10, ppu:23,total:230},
    {id:157,inv:'SI-0157',date:'2026-02-16',pid:'77',name:'EBG-009H',cat:'EDGEBAND GLOSS',cd:'Olive Green',un:'meter',qty:50,ppu:23,total:1150},
    {id:158,inv:'SI-0158',date:'2026-02-16',pid:'79',name:'EBG-001H',cat:'EDGEBAND GLOSS',cd:'White Glossy',un:'meter',qty:45,ppu:23,total:1035},
    {id:159,inv:'SI-0159',date:'2026-02-18',pid:'65',name:'EB-027',cat:'EDGEBAND',      cd:'Lumenteak',    un:'meter',qty:10, ppu:17,total:170},
    {id:160,inv:'SI-0160',date:'2026-02-18',pid:'51',name:'EB-000',cat:'EDGEBAND',      cd:'Real White',   un:'meter',qty:10, ppu:17,total:170},
    {id:161,inv:'SI-0161',date:'2026-02-19',pid:'75',name:'EB-047',cat:'EDGEBAND',      cd:'Fabric Gray',  un:'meter',qty:40, ppu:17,total:680},
    {id:162,inv:'SI-0162',date:'2026-02-19',pid:'70',name:'EB-041',cat:'EDGEBAND',      cd:'Wild Cherry',  un:'meter',qty:45, ppu:17,total:765},
    {id:163,inv:'SI-0163',date:'2026-02-20',pid:'82',name:'EBG-005H',cat:'EDGEBAND GLOSS',cd:'Light Blue', un:'meter',qty:40, ppu:23,total:920},
    {id:164,inv:'SI-0164',date:'2026-02-20',pid:'80',name:'EBG-006H',cat:'EDGEBAND GLOSS',cd:'Mocha',      un:'meter',qty:45, ppu:23,total:1035},
    {id:165,inv:'SI-0165',date:'2026-02-23',pid:'72',name:'EB-044',cat:'EDGEBAND',      cd:'Silver Gray',  un:'meter',qty:45, ppu:17,total:765},
    {id:166,inv:'SI-0166',date:'2026-02-24',pid:'71',name:'EB-043',cat:'EDGEBAND',      cd:'Dark Acacia',  un:'meter',qty:30, ppu:17,total:510},
    {id:167,inv:'SI-0167',date:'2026-02-25',pid:'64',name:'EB-025',cat:'EDGEBAND',      cd:'Brown Walnut', un:'meter',qty:60, ppu:17,total:1020},
    {id:168,inv:'SI-0168',date:'2026-02-26',pid:'81',name:'EBG-012H',cat:'EDGEBAND GLOSS',cd:'Dark Gray',  un:'meter',qty:10, ppu:23,total:230},
    {id:169,inv:'SI-0169',date:'2026-02-26',pid:'83',name:'EBG-040',cat:'EDGEBAND GLOSS',cd:'White Gloss', un:'meter',qty:10, ppu:23,total:230},
    {id:170,inv:'SI-0170',date:'2026-02-27',pid:'79',name:'EBG-001H',cat:'EDGEBAND GLOSS',cd:'White Glossy',un:'meter',qty:60,ppu:23,total:1380},
    {id:171,inv:'SI-0171',date:'2026-02-27',pid:'83',name:'EBG-040',cat:'EDGEBAND GLOSS',cd:'White Gloss', un:'meter',qty:40, ppu:23,total:920},
    {id:172,inv:'SI-0172',date:'2026-02-28',pid:'62',name:'EB-023',cat:'EDGEBAND',      cd:'Yellow Birch', un:'meter',qty:40, ppu:17,total:680},
    {id:173,inv:'SI-0173',date:'2026-02-28',pid:'52',name:'EB-001',cat:'EDGEBAND',      cd:'Warm White',   un:'meter',qty:40, ppu:17,total:680},
    // MARCH 2026
    {id:174,inv:'SI-0174',date:'2026-03-02',pid:'62',name:'EB-023',cat:'EDGEBAND',      cd:'Yellow Birch', un:'meter',qty:80, ppu:17,total:1360},
    {id:175,inv:'SI-0175',date:'2026-03-02',pid:'64',name:'EB-025',cat:'EDGEBAND',      cd:'Brown Walnut', un:'meter',qty:40, ppu:17,total:680},
    {id:176,inv:'SI-0176',date:'2026-03-03',pid:'66',name:'EB-031',cat:'EDGEBAND',      cd:'Maridon Oak',  un:'meter',qty:60, ppu:17,total:1020},
    {id:177,inv:'SI-0177',date:'2026-03-04',pid:'82',name:'EBG-005H',cat:'EDGEBAND GLOSS',cd:'Light Blue', un:'meter',qty:45, ppu:23,total:1035},
    {id:178,inv:'SI-0178',date:'2026-03-04',pid:'83',name:'EBG-040',cat:'EDGEBAND GLOSS',cd:'White Gloss', un:'meter',qty:10, ppu:23,total:230},
    {id:179,inv:'SI-0179',date:'2026-03-04',pid:'84',name:'EBG-042',cat:'EDGEBAND GLOSS',cd:'Marble',      un:'meter',qty:10, ppu:23,total:230},
    {id:180,inv:'SI-0180',date:'2026-03-05',pid:'61',name:'EB-022',cat:'EDGEBAND',      cd:'Serpent',      un:'meter',qty:30, ppu:17,total:510},
    {id:181,inv:'SI-0181',date:'2026-03-06',pid:'80',name:'EBG-006H',cat:'EDGEBAND GLOSS',cd:'Mocha',      un:'meter',qty:60, ppu:23,total:1380},
    {id:182,inv:'SI-0182',date:'2026-03-07',pid:'57',name:'EB-015',cat:'EDGEBAND',      cd:'Gray Oak',     un:'meter',qty:45, ppu:17,total:765},
    {id:183,inv:'SI-0183',date:'2026-03-09',pid:'77',name:'EBG-009H',cat:'EDGEBAND GLOSS',cd:'Olive Green',un:'meter',qty:60,ppu:23,total:1380},
    {id:184,inv:'SI-0184',date:'2026-03-09',pid:'79',name:'EBG-001H',cat:'EDGEBAND GLOSS',cd:'White Glossy',un:'meter',qty:30,ppu:23,total:690},
    {id:185,inv:'SI-0185',date:'2026-03-10',pid:'59',name:'EB-017',cat:'EDGEBAND',      cd:'Macassar',     un:'meter',qty:40, ppu:17,total:680},
    {id:186,inv:'SI-0186',date:'2026-03-10',pid:'52',name:'EB-001',cat:'EDGEBAND',      cd:'Warm White',   un:'meter',qty:45, ppu:17,total:765},
    {id:187,inv:'SI-0187',date:'2026-03-11',pid:'54',name:'EB-006',cat:'EDGEBAND',      cd:'Charcoal Gray',un:'meter',qty:30, ppu:17,total:510},
    {id:188,inv:'SI-0188',date:'2026-03-12',pid:'51',name:'EB-000',cat:'EDGEBAND',      cd:'Real White',   un:'meter',qty:100,ppu:17,total:1700},
    {id:189,inv:'SI-0189',date:'2026-03-13',pid:'52',name:'EB-001',cat:'EDGEBAND',      cd:'Warm White',   un:'meter',qty:70, ppu:17,total:1190},
    {id:190,inv:'SI-0190',date:'2026-03-14',pid:'77',name:'EBG-009H',cat:'EDGEBAND GLOSS',cd:'Olive Green',un:'meter',qty:50,ppu:23,total:1150},
    {id:191,inv:'SI-0191',date:'2026-03-14',pid:'83',name:'EBG-040',cat:'EDGEBAND GLOSS',cd:'White Gloss', un:'meter',qty:10, ppu:23,total:230},
    {id:192,inv:'SI-0192',date:'2026-03-14',pid:'84',name:'EBG-042',cat:'EDGEBAND GLOSS',cd:'Marble',      un:'meter',qty:10, ppu:23,total:230},
    {id:193,inv:'SI-0193',date:'2026-03-17',pid:'81',name:'EBG-012H',cat:'EDGEBAND GLOSS',cd:'Dark Gray',  un:'meter',qty:10, ppu:23,total:230},
    {id:194,inv:'SI-0194',date:'2026-03-17',pid:'80',name:'EBG-006H',cat:'EDGEBAND GLOSS',cd:'Mocha',      un:'meter',qty:10, ppu:23,total:230},
    {id:195,inv:'SI-0195',date:'2026-03-17',pid:'83',name:'EBG-040',cat:'EDGEBAND GLOSS',cd:'White Gloss', un:'meter',qty:10, ppu:23,total:230},
    {id:196,inv:'SI-0196',date:'2026-03-18',pid:'70',name:'EB-041',cat:'EDGEBAND',      cd:'Wild Cherry',  un:'meter',qty:40, ppu:17,total:680},
    {id:197,inv:'SI-0197',date:'2026-03-19',pid:'79',name:'EBG-001H',cat:'EDGEBAND GLOSS',cd:'White Glossy',un:'meter',qty:40,ppu:23,total:920},
    {id:198,inv:'SI-0198',date:'2026-03-19',pid:'78',name:'EBG-003H',cat:'EDGEBAND GLOSS',cd:'Light Gray', un:'meter',qty:40, ppu:23,total:920},
    {id:199,inv:'SI-0199',date:'2026-03-20',pid:'65',name:'EB-027',cat:'EDGEBAND',      cd:'Lumenteak',    un:'meter',qty:45, ppu:17,total:765},
    {id:200,inv:'SI-0200',date:'2026-03-21',pid:'74',name:'EB-046',cat:'EDGEBAND',      cd:'Natural Oak',  un:'meter',qty:40, ppu:17,total:680},
    {id:201,inv:'SI-0201',date:'2026-03-21',pid:'60',name:'EB-021',cat:'EDGEBAND',      cd:'Walnut Gray',  un:'meter',qty:30, ppu:17,total:510},
    {id:202,inv:'SI-0202',date:'2026-03-23',pid:'77',name:'EBG-009H',cat:'EDGEBAND GLOSS',cd:'Olive Green',un:'meter',qty:40,ppu:23,total:920},
    {id:203,inv:'SI-0203',date:'2026-03-23',pid:'82',name:'EBG-005H',cat:'EDGEBAND GLOSS',cd:'Light Blue', un:'meter',qty:10, ppu:23,total:230},
    {id:204,inv:'SI-0204',date:'2026-03-23',pid:'84',name:'EBG-042',cat:'EDGEBAND GLOSS',cd:'Marble',      un:'meter',qty:10, ppu:23,total:230},
    {id:205,inv:'SI-0205',date:'2026-03-25',pid:'79',name:'EBG-001H',cat:'EDGEBAND GLOSS',cd:'White Glossy',un:'meter',qty:50,ppu:23,total:1150},
    {id:206,inv:'SI-0206',date:'2026-03-25',pid:'83',name:'EBG-040',cat:'EDGEBAND GLOSS',cd:'White Gloss', un:'meter',qty:50, ppu:23,total:1150},
    {id:207,inv:'SI-0207',date:'2026-03-25',pid:'84',name:'EBG-042',cat:'EDGEBAND GLOSS',cd:'Marble',      un:'meter',qty:10, ppu:23,total:230},
    {id:208,inv:'SI-0208',date:'2026-03-26',pid:'59',name:'EB-017',cat:'EDGEBAND',      cd:'Macassar',     un:'meter',qty:40, ppu:17,total:680},
    {id:209,inv:'SI-0209',date:'2026-03-26',pid:'51',name:'EB-000',cat:'EDGEBAND',      cd:'Real White',   un:'meter',qty:10, ppu:17,total:170},
    {id:210,inv:'SI-0210',date:'2026-03-27',pid:'67',name:'EB-033',cat:'EDGEBAND',      cd:'Fabric Cream', un:'meter',qty:45, ppu:17,total:765},
    {id:211,inv:'SI-0211',date:'2026-03-27',pid:'51',name:'EB-000',cat:'EDGEBAND',      cd:'Real White',   un:'meter',qty:30, ppu:17,total:510},
    {id:212,inv:'SI-0212',date:'2026-03-28',pid:'80',name:'EBG-006H',cat:'EDGEBAND GLOSS',cd:'Mocha',      un:'meter',qty:45, ppu:23,total:1035},
    {id:213,inv:'SI-0213',date:'2026-03-28',pid:'83',name:'EBG-040',cat:'EDGEBAND GLOSS',cd:'White Gloss', un:'meter',qty:10, ppu:23,total:230},
    {id:214,inv:'SI-0214',date:'2026-03-28',pid:'84',name:'EBG-042',cat:'EDGEBAND GLOSS',cd:'Marble',      un:'meter',qty:10, ppu:23,total:230},
    {id:215,inv:'SI-0215',date:'2026-03-29',pid:'64',name:'EB-025',cat:'EDGEBAND',      cd:'Brown Walnut', un:'meter',qty:40, ppu:17,total:680},
    {id:216,inv:'SI-0216',date:'2026-03-29',pid:'69',name:'EB-039',cat:'EDGEBAND',      cd:'Dark Metallic',un:'meter',qty:40, ppu:17,total:680},
    {id:217,inv:'SI-0217',date:'2026-03-30',pid:'79',name:'EBG-001H',cat:'EDGEBAND GLOSS',cd:'White Glossy',un:'meter',qty:60,ppu:23,total:1380},
    {id:218,inv:'SI-0218',date:'2026-03-30',pid:'82',name:'EBG-005H',cat:'EDGEBAND GLOSS',cd:'Light Blue', un:'meter',qty:40, ppu:23,total:920},
    {id:219,inv:'SI-0219',date:'2026-03-30',pid:'83',name:'EBG-040',cat:'EDGEBAND GLOSS',cd:'White Gloss', un:'meter',qty:10, ppu:23,total:230},
    {id:220,inv:'SI-0220',date:'2026-03-31',pid:'55',name:'EB-009',cat:'EDGEBAND',      cd:'Golden Oak',   un:'meter',qty:40, ppu:17,total:680},
    {id:221,inv:'SI-0221',date:'2026-03-31',pid:'61',name:'EB-022',cat:'EDGEBAND',      cd:'Serpent',      un:'meter',qty:10, ppu:17,total:170},  {id:111,inv:'SI-0111',date:'2026-03-31',pid:'50',name:'014',  cat:'6MM BACKING',      cd:'Gray Stone',   th:'6mm', sz:"4'×8'",un:'pcs',qty:2, ppu:1100,total:2200},
  ];
  localStorage.setItem('sb_sales', JSON.stringify(defaultSales));
}

if (!localStorage.getItem('sb_nextSaleId')) {
  localStorage.setItem('sb_nextSaleId', '222');
}

// ── Global getters/setters ────────────────────────────────────────
window.db = {
  getProducts: () => JSON.parse(localStorage.getItem('sb_products')),
  saveProducts: (p) => localStorage.setItem('sb_products', JSON.stringify(p)),

  getSales: () => JSON.parse(localStorage.getItem('sb_sales')),
  saveSales: (s) => localStorage.setItem('sb_sales', JSON.stringify(s)),

  getNextSaleId: (count = 1) => {
    let id = parseInt(localStorage.getItem('sb_nextSaleId')) || 1;
    localStorage.setItem('sb_nextSaleId', (id + count).toString());
    return id;
  },

  // Wipe all memory to start fresh
  reset: () => {
    localStorage.removeItem('sb_products');
    localStorage.removeItem('sb_sales');
    localStorage.removeItem('sb_nextSaleId');
    location.reload();
  }
};
