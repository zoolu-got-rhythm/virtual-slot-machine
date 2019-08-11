




// dataset
const symbols =
[
  {numba: "one", imgEle: document.getElementById("pikachuImage"),
    rewardType: symbolRewardTypeEnum.BOARD},
  {numba: "two", imgEle: document.getElementById("charmanderImage")},
  {numba: "three", imgEle: document.getElementById("ghastlyImage")},
  {numba: "four", imgEle: document.getElementById("psyduckImage")},
  {numba: "five", imgEle: document.getElementById("snorlaxImage")},
  {numba: "six", imgEle: document.getElementById("zaptosImage"), rewardType:
    symbolRewardTypeEnum.JACKPOT},
  {numba: "seven", imgEle: document.getElementById("eveyImage")}
];


var slotMachine1 = new SlotMachine(250, symbols); // make is ready callback/listener mandatory?
console.log(slotMachine1);

var slotMachine1Container = document.getElementById("slotMachineContainer");
slotMachine1.appendVisualToParentInDom(slotMachine1Container);
console.log(slotMachine1);






var holdAndNudgeButtonsContainer = document.createElement("div");
holdAndNudgeButtonsContainer.classList.add("buttonsContainer");

for(let i = 0; i < 3; i++){
  let button = document.createElement("button");
  button.classList.add("nudgeOrMove");
  button.style.width = (250 / 3) + "px";
  button.style.height = (250 / 3) + "px";
  let textNode = document.createTextNode("hold");
  button.appendChild(textNode);
  button.addEventListener("click", function(){
    slotMachine1.holdReel(i);
  });
  holdAndNudgeButtonsContainer.appendChild(button);
}



let startSpinButton = document.createElement("button");
startSpinButton.style.width = (200 / 4) + "px";
startSpinButton.style.height = (200 / 4) + "px";
let spinTextNode = document.createTextNode("spin");
startSpinButton.appendChild(spinTextNode);

// let startSpinButton = document.getElementById("startSpin");
startSpinButton.addEventListener("click", function(){
  slotMachine1.spinReels();
});

startSpinButton.classList.add("isReadyToSpin");
slotMachine1.setIsReadyToSpinListener(function(isReady){
  if(isReady){
    console.log("flash button");
    startSpinButton.classList.remove("isNotReadyToSpin");
    startSpinButton.classList.add("isReadyToSpin");
  }else{
    startSpinButton.classList.remove("isReadyToSpin");
    startSpinButton.classList.add("isNotReadyToSpin");
  }
});

holdAndNudgeButtonsContainer.appendChild(startSpinButton);

document.body.appendChild(holdAndNudgeButtonsContainer);





// slotMachine1.holdReel(2);
// slotMachine1.holdReel(0);
