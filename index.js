




// dataset
const symbols =
[
  {numba: "one", imgEle: document.getElementById("pikachuImage")},
  {numba: "two", imgEle: document.getElementById("charmanderImage")},
  {numba: "three", imgEle: document.getElementById("ghastlyImage")},
  {numba: "four", imgEle: document.getElementById("psyduckImage")},
  {numba: "five", imgEle: document.getElementById("snorlaxImage")},
  {numba: "six", imgEle: document.getElementById("zaptosImage")},
  {numba: "seven", imgEle: document.getElementById("eveyImage")}
];


var slotMachine1 = new SlotMachine(200, symbols);
console.log(slotMachine1);

var slotMachine1Container = document.getElementById("slotMachineContainer");
slotMachine1.appendVisualToParentInDom(slotMachine1Container);
console.log(slotMachine1);

let startSpinButton = document.getElementById("startSpin");
startSpinButton.addEventListener("click", function(){
  slotMachine1.spinReels();
});
