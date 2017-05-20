
let count = 1;

// TODO: cannot put export default on this line?
const Counter = {
  increment() {
    const newId = 'id-' + count++;
    console.log('made new id:', newId);
    return newId;
  }
};

export default Counter;