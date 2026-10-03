#!/usr/bin/env node
/**
 * net-pay-pj.mjs — net monthly take-home for a Brazilian PJ contractor under
 * Simples Nacional, from an hourly rate (or a monthly gross).
 *
 * Why it exists: PJ offers are quoted gross ("R$ 109/hora"), but the floors in
 * modes/_profile.md are compared against what actually lands in the account.
 * The Simples regime makes that non-obvious, because the tax anexo depends on
 * how much pro-labore the owner pays (Fator R):
 *
 *   A. Anexo III — pro-labore >= 28% of revenue (Fator R >= 28%). Cheaper DAS,
 *      but a bigger pro-labore means more INSS (11%) and IRRF.
 *   B. Anexo V   — pro-labore at the minimum wage. Much higher DAS.
 *
 * Both are computed and the better one is reported. Profit left after DAS,
 * pro-labore and costs is taken as distribuição de lucros (exempt for the
 * individual, see WARNINGS in the output for the limits).
 *
 * This is an ESTIMATE for comparing offers, not tax advice. Constants below are
 * dated (TABLES_AS_OF) and must be re-verified each January — confirm the
 * regime, CNAE and Fator R treatment with your contador before relying on it.
 *
 * Run: node net-pay-pj.mjs --rate 109                      (hourly)
 *      node net-pay-pj.mjs --monthly 21500                 (monthly gross)
 *      node net-pay-pj.mjs --solve-net 17000               (hourly rate needed for a net target)
 *      Options: --hours 168  --vacation-weeks 0  --contador 0  --json
 *               --pensao <R$/month> | --pensao-sm <minimum wages>   court-ordered child
 *               support: deducted from the pro-labore IRRF base (not from INSS or DAS)
 *      node net-pay-pj.mjs --self-test
 */

import { isMainModule } from './lib/is-main-module.mjs';

export const TABLES_AS_OF = '2026-01';

export const CONSTANTS = {
  minWage: 1621, // salário mínimo 2026
  inssCeiling: 8475.55, // teto do INSS 2026
  inssRateContributor: 0.11, // sócio / contribuinte individual (plano normal)
  fatorRMin: 0.28,
  simplesLimit: 4_800_000,
  // IRRF monthly table (May/2025 onward) + Lei 15.270/2025 reducer for 2026
  irrfSimplifiedDiscount: 607.2,
  irrfBrackets: [
    { upTo: 2428.8, rate: 0, deduct: 0 },
    { upTo: 2826.65, rate: 0.075, deduct: 182.16 },
    { upTo: 3751.05, rate: 0.15, deduct: 394.16 },
    { upTo: 4664.68, rate: 0.225, deduct: 675.49 },
    { upTo: Infinity, rate: 0.275, deduct: 908.73 },
  ],
  irrfZeroUpTo: 5000,
  irrfReducerUpTo: 7350,
  irrfReducerBase: 978.62,
  irrfReducerSlope: 0.133145,
  presumedProfitMargin: 0.32, // services — cap on exempt distribution without full bookkeeping
  dividendWithholdingThreshold: 50_000, // monthly, per company (Lei 15.270/2025)
};

// Simples Nacional tables: [RBT12 upper bound, nominal rate, deduction]
export const ANEXO_III = [
  [180_000, 0.06, 0],
  [360_000, 0.112, 9_360],
  [720_000, 0.135, 17_640],
  [1_800_000, 0.16, 35_640],
  [3_600_000, 0.21, 125_640],
  [4_800_000, 0.33, 648_000],
];
export const ANEXO_V = [
  [180_000, 0.155, 0],
  [360_000, 0.18, 4_500],
  [720_000, 0.195, 9_900],
  [1_800_000, 0.205, 17_100],
  [3_600_000, 0.23, 62_100],
  [4_800_000, 0.305, 540_000],
];

/** Effective DAS rate for a given trailing-12-month revenue. */
export function effectiveRate(table, rbt12) {
  if (rbt12 <= 0) return table[0][1];
  const row = table.find(([limit]) => rbt12 <= limit) ?? table[table.length - 1];
  return (rbt12 * row[1] - row[2]) / rbt12;
}

export function inssOnProLabore(proLabore, c = CONSTANTS) {
  return Math.min(proLabore, c.inssCeiling) * c.inssRateContributor;
}

/**
 * Monthly IRRF on a pro-labore. Legal deductions are INSS plus court-ordered child
 * support (pensão alimentícia); the simplified discount replaces them all, so the larger
 * of the two is used. The Lei 15.270/2025 reducer below looks at gross income, not the base.
 */
export function irrfOnProLabore(gross, inss, c = CONSTANTS, pensao = 0) {
  const base = Math.max(0, gross - Math.max(inss + pensao, c.irrfSimplifiedDiscount));
  const b = c.irrfBrackets.find((x) => base <= x.upTo);
  let tax = Math.max(0, base * b.rate - b.deduct);
  if (gross <= c.irrfZeroUpTo) tax = 0;
  else if (gross <= c.irrfReducerUpTo) {
    tax = Math.max(0, tax - Math.max(0, c.irrfReducerBase - c.irrfReducerSlope * gross));
  }
  return tax;
}

function scenario(label, anexo, table, monthlyRevenue, proLabore, contador, c, pensao = 0) {
  const rbt12 = monthlyRevenue * 12;
  const das = monthlyRevenue * effectiveRate(table, rbt12);
  const inss = inssOnProLabore(proLabore, c);
  const irrf = irrfOnProLabore(proLabore, inss, c, pensao);
  const irrfSaved = pensao ? irrfOnProLabore(proLabore, inss, c) - irrf : 0;
  const distribution = monthlyRevenue - das - proLabore - contador;
  const net = monthlyRevenue - das - inss - irrf - contador;
  const warnings = [];
  if (distribution < 0) warnings.push('pro-labore + DAS + costs exceed revenue');
  if (distribution > c.presumedProfitMargin * monthlyRevenue - das) {
    warnings.push(
      'distribution exceeds the presumed-profit exemption (32% of revenue minus DAS) — distributing the rest tax-free needs regular bookkeeping (contabilidade escriturada); confirm with your contador'
    );
  }
  if (distribution > c.dividendWithholdingThreshold) {
    warnings.push('distribution above R$ 50k/month may trigger 10% dividend withholding (Lei 15.270/2025)');
  }
  return {
    label, anexo, proLabore, das, dasRate: das / monthlyRevenue, inss, irrf, contador,
    distribution, net, keptPct: net / monthlyRevenue, warnings,
    pensao, irrfSaved, netAfterPensao: net - pensao,
  };
}

/** Both regimes for a steady monthly gross revenue; `best` is the higher net. */
export function computeFromMonthly(monthlyRevenue, { contador = 0, pensao = 0, constants = CONSTANTS } = {}) {
  const c = constants;
  if (!(monthlyRevenue > 0)) throw new Error('monthly revenue must be > 0');
  if (monthlyRevenue * 12 > c.simplesLimit) throw new Error('annual revenue exceeds the Simples Nacional limit (R$ 4.8M)');
  const a = scenario('Anexo III (Fator R, pro-labore ≥ 28%)', 'III', ANEXO_III, monthlyRevenue,
    Math.max(c.minWage, c.fatorRMin * monthlyRevenue), contador, c, pensao);
  const b = scenario('Anexo V (pro-labore at minimum wage)', 'V', ANEXO_V, monthlyRevenue, c.minWage, contador, c, pensao);
  const scenarios = [a, b];
  return { monthlyRevenue, scenarios, best: scenarios.reduce((x, y) => (y.net > x.net ? y : x)) };
}

export function monthlyFromRate(rate, { hours = 168, vacationWeeks = 0 } = {}) {
  const annualHours = hours * 12 - vacationWeeks * ((hours * 12) / 52);
  return (rate * annualHours) / 12;
}

/** Hourly rate whose best-regime net equals `targetNet` (net is monotonic in revenue → bisection). */
export function solveRateForNet(targetNet, opts = {}) {
  const { hours = 168, vacationWeeks = 0, contador = 0, pensao = 0 } = opts;
  let lo = 1;
  let hi = 4_800_000 / 12;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (computeFromMonthly(mid, { contador, pensao }).best.net < targetNet) lo = mid;
    else hi = mid;
  }
  const monthly = (lo + hi) / 2;
  const perHour = monthly / monthlyFromRate(1, { hours, vacationWeeks });
  return { monthly, rate: perHour };
}

const brl = (n) => 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (n) => (n * 100).toFixed(2).replace('.', ',') + '%';

function printResult(result, header) {
  console.log(header);
  for (const s of result.scenarios) {
    const mark = s === result.best ? '  ← better' : '';
    console.log(`\n  ${s.label}${mark}`);
    console.log(`    DAS (${pct(s.dasRate)})        ${brl(s.das)}`);
    console.log(`    Pro-labore           ${brl(s.proLabore)}  (INSS ${brl(s.inss)}, IRRF ${brl(s.irrf)})`);
    if (s.contador) console.log(`    Contador             ${brl(s.contador)}`);
    console.log(`    Distribuição lucros  ${brl(s.distribution)}`);
    console.log(`    NET take-home        ${brl(s.net)}  (${pct(s.keptPct)} of gross)`);
    if (s.pensao) {
      console.log(`    Child support paid   ${brl(s.pensao)}  (deducted from IRRF base; IRRF saved ${brl(s.irrfSaved)})`);
      console.log(`    NET after child supp ${brl(s.netAfterPensao)}`);
    }
    for (const w of s.warnings) console.log(`    ⚠ ${w}`);
  }
}

function parseArgs(argv) {
  const out = { hours: 168, vacationWeeks: 0, contador: 0 };
  const num = (flag) => {
    const v = Number(argv[argv.indexOf(flag) + 1]);
    if (!Number.isFinite(v) || v < 0) throw new Error(`${flag} needs a non-negative number`);
    return v;
  };
  for (const f of ['--rate', '--monthly', '--solve-net', '--hours', '--vacation-weeks', '--contador', '--pensao', '--pensao-sm']) {
    if (argv.includes(f)) out[f.slice(2).replace(/-(\w)/g, (_, ch) => ch.toUpperCase())] = num(f);
  }
  out.json = argv.includes('--json');
  return out;
}

function main(argv) {
  const o = parseArgs(argv);
  const opts = { hours: o.hours, vacationWeeks: o.vacationWeeks };
  // Court-ordered child support, in R$ (--pensao) or in minimum wages (--pensao-sm).
  const pensao = o.pensaoSm !== undefined ? o.pensaoSm * CONSTANTS.minWage : (o.pensao ?? 0);
  const footer =
    `\nAssumptions: Simples Nacional, services CNAE with Fator R, steady revenue, no dependents, tables as of ${TABLES_AS_OF}.\n` +
    'Estimate for comparing offers — not tax advice; confirm regime/CNAE/Fator R with your contador.';

  if (o.solveNet !== undefined) {
    const { monthly, rate } = solveRateForNet(o.solveNet, { ...opts, contador: o.contador, pensao });
    if (o.json) return console.log(JSON.stringify({ targetNet: o.solveNet, monthlyGross: monthly, hourlyRate: rate, ...opts }, null, 2));
    console.log(`To net ${brl(o.solveNet)}/month you need ≈ ${brl(monthly)} gross/month = ${brl(rate)}/hour (${o.hours}h/month, ${o.vacationWeeks} unpaid vacation weeks).${footer}`);
    return;
  }

  let monthly;
  let header;
  if (o.rate !== undefined) {
    monthly = monthlyFromRate(o.rate, opts);
    header = `R$ ${o.rate}/hour × ${o.hours}h/month, ${o.vacationWeeks} unpaid vacation weeks → ${brl(monthly)}/month average gross`;
  } else if (o.monthly !== undefined) {
    monthly = o.monthly;
    header = `${brl(monthly)}/month gross`;
  } else {
    console.error('Usage: node net-pay-pj.mjs --rate <R$/h> | --monthly <R$> | --solve-net <R$>  [--hours 168] [--vacation-weeks 0] [--contador 0] [--pensao <R$> | --pensao-sm <n>] [--json]');
    process.exit(1);
  }
  const result = computeFromMonthly(monthly, { contador: o.contador, pensao });
  if (o.json) return console.log(JSON.stringify(result, null, 2));
  printResult(result, header);
  console.log('\nFor reference (your PJ anchors as of 2026-10-02, gross → best-regime net):');
  for (const [name, gross] of [['floor (R$ 100/h)', 16800], ['target (R$ 120/h)', 20160]]) {
    console.log(`  ${name} ${brl(gross)} → ${brl(computeFromMonthly(gross, { contador: o.contador, pensao }).best.net)}`);
  }
  console.log(footer);
}

function selfTest() {
  let failed = 0;
  const near = (label, got, want, tol = 0.01) => {
    if (Math.abs(got - want) > tol) { failed++; console.log(`FAIL ${label}: got ${got}, want ${want}`); }
  };
  near('Anexo III eff @219,744', effectiveRate(ANEXO_III, 219_744), (219_744 * 0.112 - 9_360) / 219_744, 1e-9);
  near('Anexo III bracket 1', effectiveRate(ANEXO_III, 100_000), 0.06, 1e-9);
  near('Anexo V bracket 1', effectiveRate(ANEXO_V, 100_000), 0.155, 1e-9);
  near('INSS capped', inssOnProLabore(20_000), CONSTANTS.inssCeiling * 0.11);
  near('IRRF zero at 5000', irrfOnProLabore(5000, 550), 0);
  near('IRRF reducer @6000', irrfOnProLabore(6000, 660), 380.02, 0.05);
  near('IRRF no reducer @8000', irrfOnProLabore(8000, 880), 1049.27, 0.05);
  near('IRRF with child support 2.3 SM', irrfOnProLabore(5644.8, 620.93, CONSTANTS, 2.3 * CONSTANTS.minWage), 0);
  near('IRRF unchanged at pensao 0', irrfOnProLabore(8000, 880, CONSTANTS, 0), 1049.27, 0.05);
  const rp = computeFromMonthly(20_160, { pensao: 2.3 * CONSTANTS.minWage });
  if (!(rp.best.irrfSaved > 0)) { failed++; console.log('FAIL: child support should save IRRF at R$ 20.160'); }
  near('net after child support', rp.best.netAfterPensao, rp.best.net - 2.3 * CONSTANTS.minWage);
  const r = computeFromMonthly(18_312);
  if (r.best.anexo !== 'III') { failed++; console.log('FAIL: Anexo III should win at R$ 18.312'); }
  near('net identity', r.best.net, r.monthlyRevenue - r.best.das - r.best.inss - r.best.irrf);
  const s = solveRateForNet(r.best.net);
  near('solve round-trip', s.rate * 168, 18_312, 0.05);
  if (failed) { console.log(`${failed} failed`); process.exit(1); }
  console.log('net-pay-pj self-test: all passed');
}

if (isMainModule(import.meta.url)) {
  if (process.argv.includes('--self-test')) selfTest();
  else main(process.argv.slice(2));
}
