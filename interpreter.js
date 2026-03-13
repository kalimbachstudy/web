function sortedBlock() {
    const work = document.getElementById("work_space");
    const commands = Array.from(work.querySelectorAll(".block.command"));

    return commands.sort((a, b) => {
        let topA = parseFloat(a.style.top) || 0;
        let topB = parseFloat(b.style.top) || 0;
        return topA - topB;
    });
}

function clearFooter() {
    const footer = document.querySelector("footer");
    for (let c of footer.children)
        c.remove();
}

let variables = {};

function runCode() {
    variables = {};
    clearFooter();
    const commands = sortedBlock();

    const newText1 = document.createElement('p');
    newText1.textContent = `Старт программы`;
    document.querySelector("footer").appendChild(newText1);

    for (let c of commands)
        runCommands(c);

    const newText2 = document.createElement('p');
    newText2.textContent = `Конец программы`;
    document.querySelector("footer").appendChild(newText2);
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
    if (varName) {
        variables[varName] = 0;

        const newText = document.createElement('p');
        newText.textContent = `Объявлена переменная ${varName}`;
        document.querySelector("footer").appendChild(newText);
    }
}

function blockGive(block) {
    const input = block.querySelector("input[type='text']");
    const varName = input.value.trim();
    const slot = block.querySelector(".slot");

    const expr = slot.firstElementChild;
    const value = runExpression(expr);
    if (varName) {
        variables[varName] = value;

        const newText = document.createElement('p');
        newText.textContent = `${varName} = ${value}`;
        document.querySelector("footer").appendChild(newText);
    }

}

function blockIf(block) {
    const conditionSlots = block.querySelectorAll(".slot");
    const left = runExpression(conditionSlots[0].firstElementChild);
    const right = runExpression(conditionSlots[1].firstElementChild);
    const op = block.querySelector("select").value;

    const condition = compare(left, op, right);

    const commandSlots = block.querySelectorAll(".slot.command-slot");
    if (condition) {
        const commands = commandSlots[0].children;
        for (let c of commands)
            runCommands(c);
    }
    else {
        const commands = commandSlots[1].children;
        for (let c of commands)
            runCommands(c);
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

        return calculation(left, op, right);
    }
}
function calculation(a, op, b) {
    if (op == "plus") return a + b;
    else if (op == "minus") return a - b;
    else if (op == "multiplication") return a * b;
    else if (op == "division") {
        if (b == 0)
            return 0;
        else
            return a / b;
    }
    else if (op == "remains") return a % b;
}



document.getElementById("btnRun").addEventListener("click", () => {
    const check = checkCode();
    if (check)
        runCode();
    else {
        console.log("есть ошибки");
    }
})

let variablesCheck = {};

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

    if (type == "declare") {
        const input = block.querySelector("input[type='text']");
        const varName = input.value.trim();
        if (varName == "") {
            input.classList.add("error");
            flag_valid = false;
        }
        else {
            variablesCheck[varName] = 0;
        }
    }
    else if (type == "var") {
        const input = block.querySelector("input[type='text']");
        const varName = input.value.trim();
        if (varName == "") {
            input.classList.add("error");
            flag_valid = false;
        }
        else if (!(varName in variablesCheck)) {
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
        const varName = input.value.trim();
        if (varName == "") {
            input.classList.add("error");
            flag_valid = false;
        }
        else if (!(varName in variablesCheck)) {
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
        const conditionSlots = block.querySelectorAll(".condition .slot");
        if (!checkSlot(conditionSlots[0])) flag_valid = false;
        if (!checkSlot(conditionSlots[1])) flag_valid = false;

        const commandSlots = block.querySelectorAll(".slot.command-slot");
        for (let c of commandSlots[0].children) {
            if (!checkBlock(c)) flag_valid = false;
        }
        for (let c of commandSlots[1].children) {
            if (!checkBlock(c)) flag_valid = false;
        }
    }
    return flag_valid;
}

function checkCode() {
    variablesCheck = {};
    clearFooter();

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
        console.log("Ошибок нет")
    else
        console.log("есть ошибки")
})