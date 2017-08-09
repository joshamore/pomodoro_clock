// Holds required data.
var model = {
    timerActive: false,
    countdownStep: "session",
    breakInt: 5,
    sessionInt: 25,
    mins: null,
    seconds: null
};


// Methods for break and session time toggles.
var userToggle = {
    minCheck: function(toCheck) {
        if (toCheck === 1) {
            return true;
        } else {
            return false;
        }
    },
    timeNull: function() {
        model.mins = null;
        model.seconds = null;
    },
    breakAdd: function() {
        if (model.timerActive) {
            console.log("Timer active -- cannot change session/break.");
            return;
        }
        
        this.timeNull();
        
        model.breakInt++;
        elements.breakIntDOM.innerHTML = model.breakInt;
        elements.timer.innerHTML = model.sessionInt;
    },
    breakMinus: function() {
        if (model.timerActive) {
            console.log("Timer active -- cannot change session/break.");
            return;
        }
        
        this.timeNull();
        
        if (this.minCheck(model.breakInt)) {
            return;
        }
        
        model.breakInt--;
        elements.breakIntDOM.innerHTML = model.breakInt;
        elements.timer.innerHTML = model.sessionInt;
    },
    sessionAdd: function() {
        if (model.timerActive) {
            console.log("Timer active -- cannot change session/break.");
            return;
        }
        
        this.timeNull();
        
        model.sessionInt++;
        elements.sessionIntDOM.innerHTML = model.sessionInt;
        elements.timer.innerHTML = model.sessionInt;
    },
    sessionMinus: function() {
        if (model.timerActive) {
            console.log("Timer active -- cannot change session/break.");
            return;
        }
        
        this.timeNull();
        
        if (this.minCheck(model.sessionInt)) {
            return;
        }
        
        model.sessionInt--;
        elements.sessionIntDOM.innerHTML = model.sessionInt;
        elements.timer.innerHTML = model.sessionInt;
    }
}


// Methods for the countdown timer.
var timerController = {
    timerActiveSwitch: function() {
        model.timerActive = !model.timerActive;
        
        if (elements.countdownToggle.innerHTML === "<p>Start</p>") {
            elements.countdownToggle.className = "stopBtn";
            elements.countdownToggle.innerHTML = "<p>Stop</p>";
        } else {
            elements.countdownToggle.className = "startBtn";
            elements.countdownToggle.innerHTML = "<p>Start</p>";
        }
    },
    reset: function() {
        model.timerActive = false;
        model.countdownStep = "session";
        
        model.breakInt = 5;
        model.sessionInt = 25;
        
        userToggle.timeNull();
        
        elements.timerTitle.innerHTML = "Session";
        elements.breakIntDOM.innerHTML = model.breakInt;
        elements.sessionIntDOM.innerHTML = model.sessionInt;
        elements.timer.innerHTML = model.sessionInt;
        elements.countdownToggle.className = "startBtn";
        elements.countdownToggle.innerHTML = "<p>Start</p>";
    },
    stepChange: function() {
        model.countdownStep = "break";
        elements.timerTitle.innerHTML = "Break";
        
        var audio = new Audio();
        audio.src = "assets/notification.mp3"
        
        audio.play();
    },
    countdownTimerActivator: function() {
        this.timerActiveSwitch();
        
        if (model.countdownStep === "session") {
            if (model.mins === null || model.seconds === null) {
                model.mins = model.sessionInt;
                model.seconds = 0;
            }
        } else if (model.countdownStep === "break") {
            if (model.mins === null || model.seconds === null) {
                model.mins = model.breakInt;
                model.seconds = 0;
            }
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(timeUpdate, 1000);
        }
        startTimer();
        
        // Does the actual countdown each second.
        function timeUpdate() {
            if (!model.timerActive) {
                clearInterval(timer);
            } else if (model.mins === 0 && model.seconds === 0) {
                clearInterval(timer);
                model.mins = null;
                model.seconds = null;
            } else if (model.seconds === 0) {
                model.mins--;
                model.seconds = 59; 
            } else {
                model.seconds--;
            }
            
            if (model.countdownStep === "session") {
                if (model.timerActive && model.mins !== null && model.seconds !== null) {
                    elements.timer.innerHTML = model.mins + ":" + model.seconds;   
                } else if (model.timerActive && model.mins === null && model.seconds === null) {
                    clearInterval(timer);
                    timerController.stepChange();
                    timerController.timerActiveSwitch();
                    timerController.countdownTimerActivator();
                }
            } else if (model.countdownStep === "break") {
                if (model.timerActive && model.mins !== null && model.seconds !== null) {
                    elements.timer.innerHTML = model.mins + ":" + model.seconds;   
                } else if (model.timerActive && model.mins === null && model.seconds === null) {
                    clearInterval(timer);
                    timerController.reset();
                    return;
                }
            }
        }
    },
};


// Pulling in DOM element ids.
var elements = {
    breakIntDOM: document.getElementById("breakInt"),
    breakPlus: document.getElementById("breakPlus"),
    breakMinus: document.getElementById("breakMinus"),
    sessionIntDOM: document.getElementById("sessionInt"),
    sessionPlus: document.getElementById("sessionPlus"),
    sessionMinus: document.getElementById("sessionMinus"),
    timerTitle: document.getElementById("timerTitle"),
    timer: document.getElementById("timer"),
    countdownToggle: document.getElementById("countdownToggleButton"),
    reset: document.getElementById("resetButton")
};


// Triggers based on user interactions.
var events = {
    breakPlusClick: elements.breakPlus.addEventListener("click", function() {
        userToggle.breakAdd();
    }),
    breakMinusClick: elements.breakMinus.addEventListener("click", function() {
        userToggle.breakMinus();
    }),
    sessionPlusClick: elements.sessionPlus.addEventListener("click", function() {
        userToggle.sessionAdd();
    }),
    sessionMinusClick: elements.sessionMinus.addEventListener("click", function() {
        userToggle.sessionMinus();
    }),
    resetClick: elements.reset.addEventListener("click", function() {
        timerController.reset();
    }),
    countdownToggleClick: elements.countdownToggle.addEventListener("click", function() {
        timerController.countdownTimerActivator();
    })
};