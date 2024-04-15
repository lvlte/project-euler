
/**
 * Check Brauer vs Non-Brauer numbers up to k=100000. The goal is also to show
 * that the Non-Brauer numbers found (verified + candidates) remains the same
 * regardless of the upper bound used (conjectured in "Optimization 2", vs no
 * bound) by our algorithm.
 *
 * SAC lengths are taken from A003313's b-file.
 * Non-Brauer numbers are taken from A349044's b-file (k ≤ 51667 at the time
 * of writing).
 *
 * For k in A349044, every length mismatch corresponds to a Non-Brauer number.
 *
 * It is then conjectured that mismatches for higer values of k are indeed
 * Non-Brauer numbers that are not yet on the OEIS.
 *
 * Run-time for k = 100000:
 *  - ~10 minutes with the upperbound
 *  - ~1h50m without bound
 */

/* eslint-disable max-len */

(async function checkNonBrauer() {

  const responseData = res => res.text().then(data => data
    .split(/\r?\n/)
    .filter(line => line.length && !line.startsWith('#'))
    .map(line => line.split(/\s+/).map(Number))
  );

  console.log('Fetching data from OEIS...');

  // Shortest addition chain lengths
  const SACLen = await fetch('https://oeis.org/A003313/b003313.txt').then(responseData);

  // Non-Brauer numbers
  const nonBrauer = (
    await fetch('https://oeis.org/A349044/b349044.txt').then(responseData)
  ).map(([, n]) => n);


  const timerLabel = '-> run time';
  console.time(timerLabel);

  const kmax = 1e5;
  console.log(`Computing Brauer chain lengths up to k = ${kmax} ...`);

  const c = 9 / Math.log2(71);
  const upperBound = k => Math.floor(c*Math.log2(k));

  const chain = Array(upperBound(kmax) + 1);
  const M = [0, ...Array.from({length: kmax}, (_, i) => upperBound(i+1))];
  // const M = [0, ...Array(kmax).fill(Infinity)];

  const stack = [{ k: 1, mk: 0 }];

  while (stack.length > 0) {
    let { k, mk } = stack.pop();

    M[k] = mk;
    chain[mk] = k;

    const nextMk = mk+1;
    if (nextMk >= chain.length || k === kmax) {
      continue;
    }

    for (let i=0; i<=mk; i++) {
      const nextK = k + chain[i];
      if (nextK > kmax) break;
      if (nextMk <= M[nextK]) {
        stack.push({ k: nextK, mk: nextMk });
      }
    }
  }

  const nBmax = Math.max(...nonBrauer);
  const nonBrauerSet = new Set(nonBrauer);
  const nonBrauer2 = [];

  for (const [k, mk] of SACLen) {
    if (k > kmax) break;
    if (nonBrauerSet.has(k)) continue;
    if (M[k] !== mk) {
      if (k <= nBmax) {
        // unexpected (brauer number missed, should not happen)
        console.log('\x1b[31m%s\x1b[0m', `m(${k}) = ${mk}, found ${M[k]}`);
      }
      else {
        nonBrauer2.push(k);
      }
    }
  }

  console.log('Non-Brauer numbers :');

  console.log('- verified :', nonBrauer);
  // 12509, 13207, 13705, 15473, 16537, 20753, 22955, 23219, 23447, 24797, 25018,
  // 26027, 26253, 26391, 26414, 26801, 27401, 27410, 30897, 30946, 31001, 32921,
  // 33065, 33074, 41489, 41506, 43755, 43927, 45867, 46355, 46419, 46797, 46871,
  // 46894, 47761, 49373, 49577, 49593, 49594, 49611, 50036, 50829, 51667

  console.log('- conjectured :', nonBrauer2);
  // 51891, 52011, 52054, 52493, 52506, 52759, 52782, 52828, 53602, 54033, 54802,
  // 54820, 61665, 61745, 61794, 61892, 61977, 62002, 62225, 62259, 65689, 65833,
  // 65842, 66035, 66130, 66148, 67067, 69407, 70167, 70295, 72953, 74195, 77267,
  // 79127, 82465, 82679, 82685, 82793, 82961, 82978, 83012, 83387, 83609, 84887,
  // 85461, 87510, 87831, 87854, 87881, 87897, 88841, 88915, 90929, 91673, 91691,
  // 91734, 92579, 92627, 92691, 92710, 92838, 92901, 92949, 92971, 93003, 93329,
  // 93397, 93719, 93742, 93788, 94993, 95505, 98525, 98729, 98733, 98745, 98746,
  // 98763, 99129, 99154, 99177, 99186, 99188, 99195, 99222

  console.timeEnd(timerLabel);
})()
