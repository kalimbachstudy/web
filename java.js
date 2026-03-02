(function dragDrop(){

    let coorX;
    let coorY;
    const distance = 60;
    let dragggable = false;
    const active_el = document.querySelector(".active");
    const still = document.querySelector(".still");
    active_el.draggable = true;
    active_el.addEventListener('mousedown',e=>{
        dragggable = true;
        coorX = e.clientX - active_el.offsetLeft;
        coorY = e.clientY - active_el.offsetTop;
    });
    document.addEventListener('mousemove',e=>{
        if(!dragggable) return;
        let x = e.clientX - coorX;
        let y = e.clientY - coorY;

        const target = still.getBoundingClientRect();
        const area = document.getElementById('area').getBoundingClientRect();

        const still_x = still.offsetLeft + still.offsetWidth;
        const still_y = still.offsetTop;

        if(Math.abs(x - still_x)<distance && Math.abs(y - still_y)<distance){
            x = still_x;
            y = still_y;
        }
        active_el.style.left = x +'px';
        active_el.style.top = y +'px';
    });
    document.addEventListener('mouseup', e=>{
        dragggable = false;
    });
    active_el.addEventListener('dragstart', e => {
        e.preventDefault();
    });

    
})();

