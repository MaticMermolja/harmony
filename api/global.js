// Global object
setTimeout(() => {
    console.log("GG");
    clearInterval(int);
}, 3000);

const int = setInterval(() => {
    console.log("FF");
}, 1000);

console.log(__dirname); // absolute path of dir we are in
console.log(__filename); // absolute path of file name we are in
// useful when we want to get to current dir of our file

