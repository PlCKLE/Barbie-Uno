function createRandomInt() {
    const num = Math.floor(Math.random() * 10000);
    const output = document.getElementById("output");
    output.textContent = `Your number: ${num}`;
}