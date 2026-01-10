type Job = {
  start: number;
  end: number;
  load: number; // how much capacity this job uses while it's running
};

const overloadDuration = (jobs: Job[], capacity: number): number => {
  if (jobs.length === 0) {
    return 0;
  }
  const starts = jobs.map((x) => ({ val: x.start, load: x.load })).sort((a, b) => a.val - b.val);
  const ends = jobs.map((x) => ({ val: x.end, load: x.load })).sort((a, b) => a.val - b.val);
  let load = 0;
  let overLoadSpan = 0;
  let total = 0;
  let i = 0;
  let j = 0;
  while (i < starts.length) {
    if (starts[i].val < (ends[j].val || Infinity)) {
      load += starts[i].load;
      if (load > capacity && overLoadSpan === 0) {
        overLoadSpan = starts[i].val;
      }
      i++;
    } else {
      load -= ends[j].load;
      if (overLoadSpan > 0 && load <= capacity) {
        total += ends[j].val - starts[i].val;
        overLoadSpan = 0;
      }
      j++;
    }
  }
  if (overLoadSpan > 0 && load > capacity) {
    total += ends[ends.length - 1].val - overLoadSpan;
  }
  return total;
};
