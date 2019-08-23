function Observable(){
  this.observers = [];
}

Observable.prototype.addObserver = function(observer){
  this.observers.push(observer);
}

Observable.prototype.removeObserver = function(observer){
  const removeIndex = this.observers.findIndex(obs => {
      return observer === obs;
    });

    if (removeIndex !== -1) {
      this.observers = this.observers.slice(removeIndex, 1);
    }
}

// Loops over this.observers and calls the update method on each observer.
// The state object will call this method everytime it is updated.
Observable.prototype.notify = function(data){
  console.log("notifying");
  if (this.observers.length > 0) {
      this.observers.forEach(observer => observer.update(data));
    }
}
