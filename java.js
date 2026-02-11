(function dragDrop(){

    let coorX;
    let coorY;

    const drag_el = document.querySelector(".container");
    drag_el.draggable=true;
    
    drag_el.addEventListener('dragstart', (e) =>{
        e.dataTransfer.setData('text/html', 'dragstart');
        coorX=e.offsetX;
        coorY=e.offsetY;
    });

    drag_el.addEventListener('dragend', (e) =>{
        drag_el.style.position = 'absolute';
        drag_el.style.top = (e.pageY - coorY) +'px';
        drag_el.style.left = (e.pageX - coorX) +'px';

    });
})();
