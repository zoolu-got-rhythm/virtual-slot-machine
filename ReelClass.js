
function Reel(symbolsArr, ctx, xAxisPos, slotMachineSize, reelBoundsOffsetYAxis){
  this.symbols = symbolsArr;
  this.reelBoundsOffsetYAxis = reelBoundsOffsetYAxis;
  this.slotMachineSize = slotMachineSize;
  this.reelViewBuffer = [];
  this.reelSymbolIndex = 0;
  this.ctx = ctx;
  this.symbolSize = this.slotMachineSize / 3;
  this.xAxisPos = xAxisPos;
  this.populateInitReel();
  this.endReelSpin = false;
  this.stopReel = false;

  this.randomSelectedSymbolForThisReel = null;

  this.reelHasStoppedSpinningCallbackFn = null;
}
// asssign the value 4 to a reel buffer limit variable

// this function simulates shifting the reel rotation at start before spin,
// so all reels aren't alligned with same symbol in slot machine at start,
// this may give user false impression he/she has a pre-emptive jack-pot
Reel.prototype.populateInitReel = function() {

  this.reelSymbolIndex = Math.floor(Math.random()
    * this.symbols.length);

  console.log("populate reel init");
  for (var i = 0; i < 4; i++) {

    if(this.reelSymbolIndex == this.symbols.length - 1){
      this.reelSymbolIndex = 0;
    }else{
      this.reelSymbolIndex++;
    }

    this.reelViewBuffer.push(
      {
        symbol: this.symbols[this.reelSymbolIndex],
        yPos: (this.symbolSize * (4 - i)) - this.reelBoundsOffsetYAxis * 5
      }
    );

    console.log(i);
    // this.reelSymbolIndex = i;
  }
  this.reelViewBuffer.reverse();
}

Reel.prototype.update = function(){
  // console.log("updating");
  // console.log("updating");

  if(this.stopReel)
    return;

  var self = this;

  this.reelViewBuffer.forEach(function(reelItemObject, i) {
    reelItemObject.yPos +=
      self.reelBoundsOffsetYAxis / 2;
  })

  if(Math.floor(this.reelViewBuffer[this.reelViewBuffer.length - 1].yPos + this.symbolSize)
    == Math.floor(this.slotMachineSize + this.reelBoundsOffsetYAxis)){

    // console.log("symbol: " + this.reelViewBuffer[this.reelViewBuffer.length - 1].symbol.imgEle.id);

    // console.log("hit");
    this.reelViewBuffer.pop();
    if(this.reelSymbolIndex == this.symbols.length - 1){
      this.reelSymbolIndex = 0;
    }else{
      this.reelSymbolIndex++;
    }

    let reEnterReelPos = this.reelViewBuffer[0].yPos - this.symbolSize;

    this.reelViewBuffer.unshift(
      {
        symbol: this.symbols[this.reelSymbolIndex],
        yPos: reEnterReelPos
      }
    );

    if(this.endReelSpin == true &&
      this.randomSelectedSymbolForThisReel.numba === this.reelViewBuffer[2].symbol.numba){
      this.stopReel = true;
      this.reelHasStoppedSpinningCallbackFn();
    }
  }
  //
  // if(this.reelViewBuffer[this.reelViewBuffer.length - 1].yPos == c.width + reelBoundsOffsetYAxis){
  //
  // }

  // console.log(this.reelViewBuffer);
}

Reel.prototype.draw = function() {

  // const image = document.getElementById('pikachuImage');
  if(this.ctx == null)
    return;

  // console.log("drawing");
  var self = this;
  this.reelViewBuffer.forEach(function(reelSymbol, i) {
    if(i == 2 && self.stopReel == true){
      self.ctx.fillStyle = "lime";
    }else{
      self.ctx.fillStyle = "white";
    }
    self.ctx.fillRect(self.xAxisPos, reelSymbol.yPos, self.symbolSize, self.symbolSize);
    self.ctx.beginPath();
    self.ctx.rect(self.xAxisPos, reelSymbol.yPos, self.symbolSize, self.symbolSize);
    self.ctx.fillText(reelSymbol.symbol.numba, self.xAxisPos + 10, reelSymbol.yPos + 10);
    self.ctx.stroke();
    self.ctx.drawImage(reelSymbol.symbol.imgEle, self.xAxisPos + 10, reelSymbol.yPos + 10,
      self.symbolSize - 20, self.symbolSize - 20);
  });
}

Reel.prototype.clearPaint = function(){
  // console.log("clearing");
  // ctx.fillStyle = "yellow";
  if(this.ctx == null)
    return;
  // console.log("clearing");
  // this.ctx.clearRect(this.xAxisPos - 5, 0, this.xAxisPos + this.symbolSize + 5, 400);
}

Reel.prototype.setSpinToStop = function(reelHasStoppedSpinningCallbackFn){
  this.endReelSpin = true;
  this.reelHasStoppedSpinningCallbackFn = reelHasStoppedSpinningCallbackFn;
}

Reel.prototype.setReadyToStart = function(){
  this.endReelSpin = false;
  this.stopReel = false;

  // may need to copy symbol element oppose to referencing it
  this.randomSelectedSymbolForThisReel = this.symbols[Math.floor(Math.random() *
    this.symbols.length)];

  console.log("random selected symbol is: ");
  console.log(this.randomSelectedSymbolForThisReel);

}

Reel.prototype.hasStoppedSpinning = function(){
  return this.stopReel;
}

Reel.prototype.hasBeenSetToStopSpin = function(){
  return this.endReelSpin;
}

Reel.prototype.setCanvasContext = function(ctx){
  this.ctx = ctx;
}
