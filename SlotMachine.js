// let c = document.getElementById("c");
// var ctx = c.getContext("2d");

// let symbolSize = 60;

function SlotMachine(size, symbols){
  // symbols is the dataset of symbols you need to provide of type:
  // {numba: string, imgEle: HTMLImageElementRef}
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


  // var c = document.createElement("canvas");
  // c.width = size;
  // c.height = size - (size / 3);
  this.init();
}

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



SlotMachine.prototype.step = function(timestamp) {
  var self = this;

  if (!this.start) this.start = timestamp;
  var progress = timestamp - this.start;
  // code to execute start
  this.reels.forEach(function(reel){
    reel.update();
    reel.clearPaint();
    reel.draw();
  })

  // ctx.fillStyle = "black";
  // ctx.fillRect(0, 0, 600, 200);
  // code to execute end
  if (progress > 1500) {
    if(this.spinningReelsIndexTracker < this.reels.length){
      this.reels[this.spinningReelsIndexTracker].setSpinToStop(function(){
        console.log("callback called");
        if(self.haveAllReelsStoppedSpinning() == true){
          console.log("canceling anim request frame");
          window.cancelAnimationFrame(self.animFrameRequestId);
          self.animFrameRequestId = null;
          self.spinningReelsIndexTracker = 0;
        }
      });

      // this statement/block of code is not needed really, just extra safety
      if(this.spinningReelsIndexTracker != this.reels.length - 1){
        this.spinningReelsIndexTracker++;
      }

      this.start = timestamp;
    }
  }

  if(this.animFrameRequestId == null){
    return;
  }else{
    this.animFrameRequestId = window.requestAnimationFrame(this.step.bind(this));
  }
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
  return allReelsHaveStoppedSpin;
}


SlotMachine.prototype.spinReels = function(){
  if(this.haveAllReelsStoppedSpinning() || this.firstGo){
    this.firstGo = false;
    this.start = null;
    this.reels.forEach(function(reel){
      reel.setReadyToStart();
    })
    this.animFrameRequestId = window.requestAnimationFrame(this.step.bind(this));
  }
}
