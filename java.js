(function copyBlock() {
    let dragging_el = null;
    let flag_clone = false;
    let coorX = 0, coorY = 0;

    const box_block = document.getElementById('box_block');
    const work_space = document.getElementById('work_space');

    document.addEventListener('mousedown', (e) => {
        const block = e.target.closest('.block');
        if (!block) return;

        const flag_box = box_block.contains(block);
        const flag_work = work_space.contains(block);

        if (flag_work && e.target.closest('input, select'))
            return;

        e.preventDefault();

        const rect = block.getBoundingClientRect();
        coorX = e.clientX - rect.left;
        coorY = e.clientY - rect.top;

        if (flag_box) {
            const clone = block.cloneNode(true);
            clone.classList.add('dragging');
            document.body.appendChild(clone);

            dragging_el = clone;
            flag_clone = true;


            clone.style.left = (rect.left) + 'px';
            clone.style.top = (rect.top) + 'px';
            clone.style.position = 'fixed';

            clone.style.width = rect.width + 'px';
            clone.style.height = rect.height + 'px';
        }
        else if (flag_work) {
            dragging_el = block;
            block.classList.add('dragging');

            const rect = block.getBoundingClientRect();
            block.style.left = (rect.left) + 'px';
            block.style.top = (rect.top) + 'px';
            block.style.position = 'fixed';

            block.style.width = rect.width + 'px';
            block.style.height = rect.height + 'px';

            block.remove();
            document.body.appendChild(block);
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!dragging_el) return;
        e.preventDefault();

        let x = e.clientX - coorX;
        let y = e.clientY - coorY;
        let x2 = x;
        let y2 = y;
        let min_dis = 10;

        const distance = 40;
        const stick = work_space.querySelectorAll('.block.command');

        stick.forEach(target => {
            if (target === dragging_el) return;
            const targetcoor = target.getBoundingClientRect();

            const stX = targetcoor.left;
            const stY = targetcoor.bottom + 10;

            if (Math.abs(x - stX) < distance && Math.abs(y - stY) < distance) {
                min_dis = Math.hypot(x - stX, y - stY);
                x2 = stX;
                y2 = stY;
            }
        });
        if (min_dis < 40) {
            x = x2 - 20;
            y = y2 - 35;
        }

        dragging_el.style.left = x + 'px';
        dragging_el.style.top = y + 'px';
    });

    document.addEventListener('mouseup', (e) => {
        if (!dragging_el) return;

        e.preventDefault();


        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        el_slot = null;
        for (let el of elements) {
            if (work_space.contains(el) && el.classList.contains('slot')
                && !dragging_el.contains(el)) {
                const slot_type = el.dataset.slotType;

                const flag_command = dragging_el.classList.contains("command");
                const flag_expression = dragging_el.classList.contains("expression");

                let flag_match = false;
                if (slot_type == "commands" && flag_command) flag_match = true;
                if (slot_type == "expression" && flag_expression) flag_match = true;

                if (flag_match) {
                    if (slot_type == "expression" && el.children.length > 0)
                        break;
                    else {
                        el_slot = el;
                        break;
                    }
                }
            }
        }

        if (el_slot) {
            dragging_el.style.position = '';
            dragging_el.style.left = '';
            dragging_el.style.top = '';
            dragging_el.style.width = '';
            dragging_el.style.height = '';
            dragging_el.classList.remove('dragging');



            el_slot.appendChild(dragging_el);

            dragging_el = null;
            flag_clone = false;
            return;
        }
        else {
            const mouseX = e.clientX;
            const work_rect = work_space.getBoundingClientRect();
            const box_rect = box_block.getBoundingClientRect();

            const flag_box = mouseX < box_rect.right;
            const flag_work = mouseX > work_rect.left;

            if (flag_clone) {
                if (flag_work) {
                    dragging_el.classList.remove('dragging');

                    dragging_el.style.position = 'absolute';

                    const cur = dragging_el.getBoundingClientRect();
                    const left = cur.left - work_rect.left;
                    const top = cur.top - work_rect.top;

                    dragging_el.style.left = (left) + 'px'
                    dragging_el.style.top = (top) + 'px';
                    dragging_el.style.width = '';
                    dragging_el.style.height = '';


                    work_space.appendChild(dragging_el);
                }
                else {
                    dragging_el.remove();
                }
            }
            else {
                if (flag_box) {
                    dragging_el.remove();

                }
                else {
                    dragging_el.classList.remove('dragging');
                    const cur = dragging_el.getBoundingClientRect();

                    dragging_el.style.position = 'absolute';
                    const left = cur.left - work_rect.left;
                    const top = cur.top - work_rect.top;
                    dragging_el.style.left = (left) + 'px'
                    dragging_el.style.top = (top) + 'px';
                    dragging_el.style.width = '';
                    dragging_el.style.height = '';


                    work_space.appendChild(dragging_el);
                }
            }

            dragging_el = null;
            flag_clone = false;
        }
    });
    document.addEventListener('dragstart', (e) => e.preventDefault());
})();
