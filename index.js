




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

var slotMachine1 = new SlotMachine(170, symbols); // make is ready callback/listener mandatory?
console.log(slotMachine1);

// perhaps make a observer factory or helper
function CreditObserver(){
  Observer.call(this);
}

CreditObserver.prototype = Object.create(Observer.prototype);
CreditObserver.prototype.constructor = CreditObserver;

CreditObserver.prototype.update = function(state){
  document.getElementById("credit-container").innerHTML =
  getNumberAsDigitText(state.credit);

  document.getElementById("credit-earnings").innerHTML =
  getNumberAsDigitText(state.nudges).substring(3);
}


slotMachine1.addObserver(new CreditObserver());




function HoldsAndNudgesObserver(){
  Observer.call(this);
}

HoldsAndNudgesObserver.prototype = Object.create(Observer.prototype);
HoldsAndNudgesObserver.prototype.constructor = HoldsAndNudgesObserver;

HoldsAndNudgesObserver.prototype.update = function(state){
  console.log("holds and nudges observer being ran");
  var x = document.getElementsByClassName("nudgeOrMove");
  for (let i = 0; i < x.length; i++) {
    if(!state.reelsAreLockedFromHolds){
      console.log(x);
      x[i].classList.add("addFlash");
    }else{
      x[i].classList.remove("addFlash");
    }

    if(!state.reelsAreLockedFromNudges){
      x[i].classList.add("nudgesFlash");
      x[i].innerHTML = "↓";
    }else{
      x[i].classList.remove("nudgesFlash");
      x[i].innerHTML = "hold";
    }
  }
}

slotMachine1.addObserver(new HoldsAndNudgesObserver());


slotMachine1.addCredit(200);



function getNumberAsDigitText(num){
  var n = num.toString();

  if(n.length == 2){
    n = "00.".concat(n);
  }

  if(n.length == 1){
    n = "00.0".concat(n);
  }

  if(n.length == 3){
    // n = num.toString();

    var tempArr = n.split("")
    tempArr.splice(1,0,".");
    var arrToString = tempArr.join();
    n = "0" + arrToString;
    n = n.replace(/,/g, ""); // with "100" there's a bizzare js bug which includes apostrophe from array ", , ,"; so -
    // this regex is a fix around that remove any ","'s with "100"
  }

  return n;
}


var slotMachine1Container = document.getElementById("slotMachineContainer");
slotMachine1.appendVisualToParentInDom(slotMachine1Container);
console.log(slotMachine1);

slotMachine1.setOnBonusListener(function(){
  alert("bonus");
});






var holdAndNudgeButtonsContainer = document.createElement("div");
holdAndNudgeButtonsContainer.classList.add("buttonsContainer");

for(let i = 0; i < 3; i++){
  let button = document.createElement("button");
  button.classList.add("nudgeOrMove");
  button.style.width = (160 / 3) + "px";
  button.style.height = (160 / 3) + "px";
  let textNode = document.createTextNode("hold");
  button.appendChild(textNode);
  button.addEventListener("click", function(){
    if(!slotMachine1.reelsAreLockedFromNudges){
      slotMachine1.nudgeReel(i);
      console.log("nudging reel " + i);
    }

    if(!slotMachine1.reelsAreLockedFromHolds){
      slotMachine1.holdReel(i);
      console.log("holding reel " + i);
    }
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
