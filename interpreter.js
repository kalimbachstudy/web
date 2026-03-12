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
    runCode();
})