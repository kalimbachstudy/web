function sortedBlock() {
    const work = document.getElementById("work_space");
    const commands = Array.from(work.querySelectorAll(".block.command"));

    return commands.sort((a, b) => {
        let topA = parseFloat(a.style.top) || 0;
        let topB = parseFloat(b.style.top) || 0;
        return topA - topB;
    });
}


const variables = {};

function runCode() {
    const commands = sortedBlock();

    for (let c of commands)
        runCommands(c);
}

function runCommands(block) {
    const type = block.dataset.type;

    if (type == "declare")
        blockDeclare(block);
    else if (type == "give")
        blockGive(block);
    else if (type == "if")
        blockIf(block);
    // else{????}
}

function blockDeclare(block) {
    const input = block.querySelector("input[type='text']");
    const varName = input.value.trim();
    if (varName)
        variables[varName] = 0;
}

function blockGive(block) {
    const input = block.querySelector("input[type='text']");
    const varName = input.value.trim();
    const slot = block.querySelector(".slot");
    if (!slot) return;

    const expr = slot.firstElementChild;
    const value = runExpression(expr);
    if (varName)
        variables[varName] = value;
}

function blockIf(block) {
    const slots = block.querySelectorAll(".slot");
    const left = runExpression(slots[0].firstElementChild);
    const right = runExpression(slots[1].firstElementChild);
    const op = block.querySelector("select").value;

    const condition = compare(left, op, right);

    if (condition) {
        const slot = block.querySelector(".slot.command-slot");
        if (slot) {
            const commands = slot.children;
            for (let c of commands)
                runCommands(c);
        }
    }

}

function compare(a, op, b) {
    if (op == ">") return a > b;
    else if (op == "<") return a < b;
    else if (op == "==") return a == b;
    else if (op == "!=") return a != b;
    else if (op == ">=") return a >= b;
    else if (op == "<=") return a <= b;
}

function runExpression(block) {
    const type = block.dataset.type;

    if (type == "number") {
        const input = block.querySelector("input[type='number']");
        return parseFloat(input.value) || 0;
    }
    else if (type == "var") {
        const input = block.querySelector("input[type='text']");
        const varName = input.value.trim();
        if (variables[varName] !== undefined)
            return variables[varName];
    }
    else if (type == "operation") {
        const slots = block.querySelectorAll(".slot");
        const left = runExpression(slots[0].firstElementChild);
        const right = runExpression(slots[1].firstElementChild);
        const op = block.querySelector("select").value;
        
        const result = calculation(left, op, right);
        return result;
    }
}
function calculation(a, op, b) {
    
    if (op == "plus") {
        return a + b;
    }
    else if (op == "minus"){
        return a - b;
    }
    else if (op == "multiplication"){
        return a * b;
    }
    else if (op == "division") {
        if (b != 0) return a / b;
        else{
            console.log("нолик свой убери :*");;
        }
    }
    else if (op == "remains"){
        return a % b;
    }
}



document.getElementById("btnRun").addEventListener("click", () => {
    
    const coutt = document.getElementById("cout");
    coutt.textContent = "";
    
    runCode();
    
    for (let varName in variables) {
        if (variables.hasOwnProperty(varName)) {
            coutt.textContent = coutt.textContent + " " + varName + "=" + variables[varName];
        }
    }
})


function checkBlock(block) {
    let flag_valid = true;
    const type = block.dataset.type;

    function checkSlot(slot) {
        if (slot.children.length == 0) {
            slot.classList.add("error");
            return false;
        }
        checkBlock(slot.children[0]);
        return true;
    }

    if (type == "declare" || type == "var") {
        const input = block.querySelector("input[type='text']");
        if (input.value.trim() == "") {
            input.classList.add("error");
            flag_valid = false;
        }
    }

    else if (type == "number") {
        const input = block.querySelector("input[type='number']");
        if (input.value.trim() == "") {
            input.classList.add("error");
            flag_valid = false;
        }
    }

    else if (type == "give") {
        const input = block.querySelector("input[type='text']");
        if (input.value.trim() == "") {
            input.classList.add("error");
            flag_valid = false;
        }
        const slot = block.querySelector(".slot")
        if (!checkSlot(slot)) flag_valid = false;
    }

    else if (type == "operation") {
        const slots = block.querySelectorAll(".slot");
        if (!checkSlot(slots[0])) flag_valid = false;
        if (!checkSlot(slots[1])) flag_valid = false;
    }

    else if (type == "if") {
        const conditionSlots = block.querySelectorAll(".condition.slot");
        if (!checkSlot(conditionSlots[0])) flag_valid = false;
        if (!checkSlot(conditionSlots[1])) flag_valid = false;

        const commandSlot = block.querySelector(".slot.command-slot");
        for (let c of commandSlot.children) {
            if (!checkBlock(c)) flag_valid = false;
        }
    }
    return flag_valid;
}

function checkCode() {
    const workspace = document.getElementById("work_space");
    const errorElements = workspace.querySelectorAll(".error");
    errorElements.forEach(e => e.classList.remove("error"));


    let flag_allValid = true;
    for (let block of work_space.children)
        if (!checkBlock(block)) flag_allValid = false;
    return flag_allValid;
}

document.getElementById("btnCheck").addEventListener("click", () => {
    if (checkCode())
        console.log("Ошибок нет");
        
    else
        console.log("есть ошибки");
})