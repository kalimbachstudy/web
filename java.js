(function dragDrop(){

    let coorX;
    let coorY;

    const drag_el = document.querySelector(".container");
    const drzone = document.querySelector(".dropzone");
    drag_el.draggable=true;
    
    drag_el.addEventListener('dragstart', (e) =>{
        e.dataTransfer.setData('text/html', 'dragstart');
        coorX=e.offsetX;
        coorY=e.offsetY;
    });
    drzone.addEventListener('dragover', (e)=>{
        e.preventDefault();
    });
    drzone.addEventListener('drop', (e)=>{
        drag_el.style.position = 'absolute';
        drag_el.style.top = (e.pageY - coorY) +'px';
        drag_el.style.left = (e.pageX - coorX) +'px';
    })
})();

slot.addEventListener('dragover', allowDrop);
slot.addEventListener('drop', handleDrop);
