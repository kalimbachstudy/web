(function copyBlock(){
    let dragging_el=null;
    let flag_clone= false;
    let coorX=0, coorY=0;
    
    const box_block=document.getElementById('box_block');
    const work_space = document.getElementById('work_space');

    document.addEventListener('mousedown', (e)=>{
        const block = e.target.closest('.block');
        if (!block) return;

        const flag_box= box_block.contains(block);
        const flag_work=work_space.contains(block);
        
        if (flag_work && e.target.closest('input, select'))
            return;
        
        e.preventDefault();
        
        const rect = block.getBoundingClientRect();
        coorX=e.clientX-rect.left;
        coorY=e.clientY-rect.top; 

        if (flag_box){
          const clone=block.cloneNode(true);
          clone.classList.add('dragging');
          document.body.appendChild(clone);

          dragging_el=clone;
          flag_clone=true;

          
          clone.style.left=(rect.left)+'px';
          clone.style.top=(rect.top)+'px';
          clone.style.position='fixed';

          clone.style.width = rect.width + 'px'; 
          clone.style.height = rect.height + 'px';
        }
        else if(flag_work){
          dragging_el=block;
          block.classList.add('dragging');

          const rect = block.getBoundingClientRect();
          block.style.left=(rect.left)+'px';
          block.style.top=(rect.top)+'px';
          block.style.position='fixed';
          
          block.style.width = rect.width + 'px';
          block.style.height = rect.height + 'px';

          block.remove();
          document.body.appendChild(block);
        }
    });

    document.addEventListener('mousemove', (e)=>{
        if (!dragging_el) return;
        e.preventDefault();

        dragging_el.style.left = (e.clientX - coorX) + 'px';
        dragging_el.style.top = (e.clientY - coorY) + 'px';
    });

    document.addEventListener('mouseup', (e)=>{
        if (!dragging_el) return;

        e.preventDefault();

        const mouseX=e.clientX;
        const work_rect=work_space.getBoundingClientRect();
        const box_rect=box_block.getBoundingClientRect();

        const flag_box=mouseX<box_rect.right;
        const flag_work=mouseX>work_rect.left;

        if (flag_clone){
          if (flag_work){
            dragging_el.classList.remove('dragging');
            
            dragging_el.style.position='absolute';
            const left=e.clientX-coorX-work_rect.left;
            const top=e.clientY-coorY-work_rect.top;
            dragging_el.style.left=(left)+'px'
            dragging_el.style.top=(top)+'px';
            dragging_el.style.width = '';
            dragging_el.style.height = '';
            

            work_space.appendChild(dragging_el);
          }
          else{
            dragging_el.remove();
          }
        }
        else{
          if (flag_box){
            dragging_el.remove();

          }
          else{
            dragging_el.classList.remove('dragging');

            dragging_el.style.position='absolute';
            const left=e.clientX-coorX-work_rect.left;
            const top=e.clientY-coorY-work_rect.top;
            dragging_el.style.left=(left)+'px'
            dragging_el.style.top=(top)+'px';
            dragging_el.style.width = ''; 
            dragging_el.style.height = '';

            
            work_space.appendChild(dragging_el);
          }
        }

        dragging_el=null;
        flag_clone=false;
    }); 
      
      document.addEventListener('dragstart', (e) => e.preventDefault());
})();
    