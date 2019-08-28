// let c = document.getElementById("c");
// var ctx = c.getContext("2d");

// let symbolSize = 60;
const holdOrNudgesEnum = {
  HOLDS: 0,
  NUDGES: 1
}


function SlotMachine(size, symbols){
  // symbols is the dataset of symbols you need to provide of type:
  // {numba: string, imgEle: HTMLImageElementRef}

  Observable.call(this); // not sure if this is needed

  this.symbols = symbols;

  this.ctx = null;
  this.nOfReels = 3;
  this.size = size;
  this.reelBoundsOffsetYAxis = (this.size / this.nOfReels) / 2;
  this.reels = [];

  this.symbolSquareSize = this.size / 3;
  this.firstGo = true;

  this.spinningReelsIndexTracker = 0;
  this.start = null;
  this.animFrameRequestId = null;
  this.haveHoldThisGo = false;
  this.reelsAreLockedFromHolds = true;
  this.reelsAreLockedFromNudges = true;
  this.nudges = 0;

  this.isReadyToSpinListener = null;
  this.nudgesAndHoldListener = null;
  this.credit = 0;

  this.waitingForCallback = false;
  this.onGotBonusListener = null;


  // var c = document.createElement("canvas");
  // c.width = size;
  // c.height = size - (size / 3);
  this.init();
}

SlotMachine.prototype = Object.create(Observable.prototype);
SlotMachine.prototype.constructor = SlotMachine;

SlotMachine.prototype.appendVisualToParentInDom = function(parentElement){
  // set shouldDraw to true when this method is called
  // so can potentially test state in isolation without any view/dom aspect -
  // coupled to it.
  var c = document.createElement("canvas");
  c.width = this.size;
  c.height = this.size - (this.size / 3);
  this.ctx = c.getContext("2d");

  parentElement.appendChild(c);

  var self = this;

  this.reels.forEach(function(reel){
    reel.setCanvasContext(self.ctx);
    reel.draw();
  });
}

SlotMachine.prototype.init = function(){
  for(let i = 0; i < this.nOfReels; i++){
    this.reels.push(new Reel(this.symbols, this.ctx, i * (this.size / this.nOfReels),
      this.size, this.reelBoundsOffsetYAxis));
  }

  // this block will never run
  if(this.isReadyToSpinListener != null){
    this.isReadyToSpinListener(true);
  }
}



// draw();

// let reels = [];
//
// // canvas width height should be 1/4 smaller than canvas height
// const nOfReels = 3;
// const reelBoundsOffsetYAxis = ((c.width / 3) / 2);

// function initReels(){
//   for(let i = 0; i < nOfReels; i++){
//     reels.push(new Reel(symbols, ctx, i * (c.width / nOfReels)));
//   }
// }



// initReels();

// reels.forEach(function(reel){
//   // reel.update();
//   // reel.clearPaint();
//   reel.draw();
//   // ctx.fillStyle = "black";
//   // ctx.fillRect(0, 0, 600, 200);
// })


// rename to spin reels
SlotMachine.prototype.step = function(timestamp) {
  var self = this;

  if (!this.start) this.start = timestamp;
  var progress = timestamp - this.start;

  this.reels.forEach(function(reel){
    reel.update();
    reel.clearPaint();
    reel.draw();
  })

  console.log("step running");

  if (progress > 500 || this.reels[this.spinningReelsIndexTracker].CheckIfLocked()) {
    if(this.spinningReelsIndexTracker < this.reels.length){

      console.log("spinningReelsIndexTracker is: " + this.spinningReelsIndexTracker);
      this.reels[this.spinningReelsIndexTracker].setSpinToStop(function(reelObjectRef){



        console.log("callback called");
        if(self.haveAllReelsStoppedSpinning() == true && self.waitingForCallback == false){
          self.waitingForCallback = true;
          self.haveAllReelsSlottedIntoThereFinalPositions(function(){
            console.log("canceling anim request frame");
            window.cancelAnimationFrame(self.animFrameRequestId);
            self.animFrameRequestId = null;
            self.spinningReelsIndexTracker = 0;

            self.reels.forEach(function(reel){
              reel.unlockReel();
            });

            // self.reelsAreLockedFromHolds = false;
            console.log("have all reels slotted into there positions callback running");

            console.log(self.isReadyToSpinListener);
            if(self.isReadyToSpinListener != null){
              self.isReadyToSpinListener(true);
            }

            // if() results symbols contain pikachu 70% chance of hold being granted
            if(self.checkForNOfBonusSymbols() == 1 && self.hasDiceRollPassed(75)){
              self.grantHold();
            }else if(self.checkForNOfBonusSymbols() == 2 && self.hasDiceRollPassed(65)){
              if(self.hasDiceRollPassed(50)){
                self.grantHold();
              }else{
                self.grantNudges(Math.ceil(Math.random()*3)); // grant up to 3 nudges , minimum 1
              }
            }
            if(self.checkIfBonus() && self.onGotBonusListener != null){
              self.onGotBonusListener();
            }
          });

        }
      }, function(){ // this callback here is called first before above one
        if(self.spinningReelsIndexTracker != self.reels.length - 1){
          self.spinningReelsIndexTracker++;
        }
      });
      this.start = timestamp;
    }
  }

  if(this.animFrameRequestId == null){
    return;
  }else{
    this.animFrameRequestId = window.requestAnimationFrame(this.step.bind(this));
  }
}

SlotMachine.prototype.setOnBonusListener = function(onGotBonusListener){
  this.onGotBonusListener = onGotBonusListener;
}

SlotMachine.prototype.grantNudges = function(nOfNudges){
  // this.reelsAreLockedFromHolds = true;
  this.reelsAreLockedFromNudges = false;
  this.nudges = nOfNudges;
  this.update();
}

SlotMachine.prototype.hasDiceRollPassed = function(threshHoldPercentageInteger){
  return Math.floor(Math.random() * 100) < threshHoldPercentageInteger;
}

SlotMachine.prototype.checkForNOfBonusSymbols = function(){
  var nOfBonusSymbols = 0;
  for(let i = 0; i < this.reels.length; i++){
    let reel = this.reels[i];
    if(reel.getRandomGeneratedRandomSymbol().rewardType ==
      symbolRewardTypeEnum.BOARD){
        nOfBonusSymbols++;
      }
  }
  return nOfBonusSymbols;
}

SlotMachine.prototype.checkIfBonus = function(){
  if(this.checkForNOfBonusSymbols() == 3){
    return true;
  }else{
    return false;
  }
}

SlotMachine.prototype.grantHold = function(){
  this.reelsAreLockedFromHolds = false;
  // if(this.nudgesAndHoldListener != null)
  //   this.nudgesAndHoldListener(holdOrNudgesEnum.HOLDS);
  this.update();
}

SlotMachine.prototype.setNudgesAndHoldListener = function(listener){
  this.nudgesAndHoldListener = listener;
}


SlotMachine.prototype.haveAllReelsStoppedSpinning = function(){
  let allReelsHaveStoppedSpin = false;
  for(let i = 0; i < this.reels.length; i++){
    allReelsHaveStoppedSpin =
      this.reels[i].hasBeenSetToStopSpin(); // if set to stop will = true
    if(allReelsHaveStoppedSpin == false){
      break;
    }
  }
  console.log("all reels have stopped spinning: " + allReelsHaveStoppedSpin);
  return allReelsHaveStoppedSpin;
}

SlotMachine.prototype.checkForJackpot = function(){
  let isJackPot = false;

  for(let i = 0; i < this.reels.length; i++){
    let reel = this.reels[i];
    if(reel.getRandomGeneratedRandomSymbol().rewardType ==
      symbolRewardTypeEnum.JACKPOT){
        isJackPot = true;
      }else{
        isJackPot = false;
        break;
      }
  }

  if(isJackPot){
    // add money to earnings;
    //callback
  }
}

SlotMachine.prototype.addCredit = function(amount){
  this.credit = amount;
  this.update();
}

SlotMachine.prototype.haveAllReelsSlottedIntoThereFinalPositions = function(reelsHaveSlottedIntoFinalPositionsCallback){
  var self = this;
  var reelsHaveSlottedIntoFinalPositions = false;
  var tid = window.setInterval(function(){
    console.log("waiting for reels to slot into position");
    for(let i = 0; i < self.reels.length; i++){
      var reel = self.reels[i];
      console.log(reel.hasStoppedSpinning());
      if(reel.hasStoppedSpinning()){
        reelsHaveSlottedIntoFinalPositions = true;
      }else{
        reelsHaveSlottedIntoFinalPositions = false;
        break;
      }
    }
    if(reelsHaveSlottedIntoFinalPositions){
      console.log("clearing timer");
      window.clearInterval(tid);
      reelsHaveSlottedIntoFinalPositionsCallback();
    }
  }, 50);
}

SlotMachine.prototype.holdReel = function(reelIndex){
  if(!this.reelsAreLockedFromHolds){
    this.reels[reelIndex].lockReel();
  }
}

SlotMachine.prototype.setIsReadyToSpinListener = function(listener){
  console.log(listener);
  this.isReadyToSpinListener = listener; // callback listener func has 1 param true or false
}

SlotMachine.prototype.nudgeReel = function(reelIndex){
  var rid;
  var stepLocal = function(){
    // update reel
    this.reels[reelIndex].update();
    this.reels[reelIndex].clearPaint();
    this.reels[reelIndex].draw();
    if(this.reels[reelIndex].isCurrentlyBeingNudged == false){
      window.cancelAnimationFrame(rid);
      rid = null;
      if(this.checkIfBonus() && this.onGotBonusListener != null){
        this.onGotBonusListener();
      }
    }else{
      rid = window.requestAnimationFrame(stepLocal.bind(this));
    }
  }

  if(!this.reelsAreLockedFromNudges && !this.firstGo && (this.nudges > 0)){
    console.log("nudges remaining before this nudge:" + this.nudges);
    this.reels[reelIndex].nudge();
    this.nudges = this.nudges - 1;
    this.update();
    rid = window.requestAnimationFrame(stepLocal.bind(this));
  }
}

SlotMachine.prototype.update = function(){
  console.log("calling update");
  this.notify(Object.create(this));
}


SlotMachine.prototype.spinReels = function(){
  var self = this;
  if(this.credit >= 10 && (this.haveAllReelsStoppedSpinning() || this.firstGo)){
    this.credit = this.credit - 10;
    if(this.isReadyToSpinListener != null)
      this.isReadyToSpinListener(false);
    this.reelsAreLockedFromHolds = true;
    this.reelsAreLockedFromNudges = true;
    this.waitingForCallback = false; // rename this member variable
    this.nudges = 0;

    this.firstGo = false;
    this.start = null;
    this.reels.forEach(function(reel){
      reel.setReadyToStart();
    });

    console.log("about to call update");
    this.update(); // notify any observers that are register'd

    this.animFrameRequestId = window.requestAnimationFrame(this.step.bind(this));
  }
}
