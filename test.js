var science = require("./index");

var x = science.Zeros(2,2,2);

x.Set(1,1,1, 1);
x.Set(1,1,2, 2);
x.Set(1,2,1, 3);
x.Set(1,2,2, 4);
x.Set(2,1,1, 5);
x.Set(2,1,2, 6);
x.Set(2,2,1, 7);
x.Set(2,2,2, 8);

var y = x(science.All, 1, science.All);
var z = x.Part(science.All, 1, science.All);

console.log("x = " + x + "\ny = x(:,1,:) = " + y);
console.log("z = x.Part(:,1,:)\nz(2,2) = " + z(2,2));
console.log("z = " + z);

x.Each(console.log);

science.Eye(2000);

// TODO:
//console.log(science.Cell([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));

console.log(science.Info());
