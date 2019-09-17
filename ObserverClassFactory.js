// creates a subclass of Observer class
function observerClassFactory(callbackWithStateArgument){
    function ObserverSubClass(){
        Observer.call(this);
    }

    ObserverSubClass.prototype = Object.create(Observer.prototype);
    ObserverSubClass.prototype.constructor = ObserverSubClass;

    ObserverSubClass.prototype.update = callbackWithStateArgument;

    return ObserverSubClass;
}