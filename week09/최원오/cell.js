const valueCell = (initValue) => {
  let currentValue = initValue;
  const watchers = [];

  return {
    getvalue() {
      return currentValue;
    },
    update(fn) {
      currentValue = fn(currentValue);

      watchers.forEach((watcher) => watcher(currentValue));
    },
    addWatcher: (fn) => {
      watchers.push(fn);
    },
  };
};

const formulaCell = (upstreamCell, fn) => {
  //* 새로운 셀 추가
  const cell = valueCell(fn(upstreamCell.value()));

  //* 기존 셀에 옵저버 셀 업데이트 로직 추가
  upstreamCell.addWatcher((newUpstreamValue) => {
    cell.update(() => fn(newUpstreamValue));
  });

  return {
    value: cell.value,
    addWatcher: cell.addWatcher,
  };
};

const test = valueCell(123);
const test2 = formulaCell(test, (value) => value * 2);

test.update((value) => value - 2);
console.log(test.value());
console.log(test2.value());
test.update((value) => value - 1);
console.log(test.value());
console.log(test2.value());
