class Interpreter{
    constructor() {
        this.variables = new Map();
    }
    
    createVariable(variableName, variableValue){
        this.variables.set(variableName, variableValue);
    }

    getVariable(variableName){
        return this.variables.get(variableName);
    }
}

const interpreter = new Interpreter();
window.interpreter = interpreter;