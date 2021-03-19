//VARIABLES GLOBALES
const formulario = document.getElementById('formulario');
const listaTareas = document.getElementById('contenedor-tareas');

let arrTareas = [];

//service worker
if ('serviceWorker' in navigator) {
    
    navigator.serviceWorker.register('./pwa.js')
      .then(reg => console.log('Registro de SW exitoso', reg))
      .catch(err => console.warn('Error al tratar de registrar el sw', err))

  }

//FUNCIONES
const crearTarea = function(tituloTarea,contenidoTarea){

    let tarea = {
        titulo: tituloTarea,
        contenido: contenidoTarea,
        estado: 'Pendiente',
    };

    arrTareas.push(tarea);
    return(tarea);

};

const guardarStorage = function(){

    localStorage.setItem('tareas',JSON.stringify(arrTareas));
    pintarTareas();

    

};

const pintarTareas = function(){

    listaTareas.innerHTML = '';
    arrTareas = JSON.parse(localStorage.getItem('tareas'));

    if(arrTareas === null){

        arrTareas = [];

    }else{

        arrTareas.forEach(element => {

            if(element.estado === 'Completada'){

                listaTareas.innerHTML += `<div class="card text-white bg-success mb-5"><div class="card-header">${element.estado}</div><div class="card-body"><h4 class="card-title">${element.titulo}</h4><p class="card-text">${element.contenido}</p><i class="fas fa-check text-white"><b>check</b></i><i class="fas fa-times text-white"><b>delete</b></i></div></div>`;

            }else{

                listaTareas.innerHTML += `<div class="card text-white bg-danger mb-5"><div class="card-header">${element.estado}</div><div class="card-body"><h4 class="card-title">${element.titulo}</h4><p class="card-text">${element.contenido}</p><i class="fas fa-check text-white"><b>check</b></i><i class="fas fa-times text-white"><b>delete</b></i></div></div>`;

            }
            
            

        });

    };

};

const eliminarStorage = function(titulo,contenido){
    let indexArray;
    arrTareas.forEach((elemento, index) => {
        
        if(elemento.titulo === titulo && elemento.contenido === contenido){

            indexArray = index;

        };
        
    });

    arrTareas.splice(indexArray,1);
    guardarStorage();

};

const completada = function(titulo,contenido){

    let indexArray = arrTareas.findIndex((elemento) => elemento.titulo === titulo && elemento.contenido === contenido);

    arrTareas[indexArray].estado = 'Completada';
    guardarStorage();
    
};

//EVENTOS
formulario.addEventListener('submit', function(e){

    e.preventDefault();
    let titulo = document.getElementById('input-nombreTarea').value;
    let contenido = document.getElementById('input-tareas').value;

    crearTarea(titulo,contenido);
    guardarStorage();
    pintarTareas();
    formulario.reset();

});

listaTareas.addEventListener('click', function(e){

    e.preventDefault();
    
    
    if(e.target.innerHTML == '<b>check</b>' || e.target.innerHTML == '<b>delete</b>' ){
   
        let titulo = e.path[1].childNodes[0].innerHTML;
        let contenido = e.path[1].childNodes[1].innerHTML;

        if(e.target.innerHTML == '<b>check</b>'){

            completada(titulo,contenido);

        };

        if( e.target.innerHTML == '<b>delete</b>'){

            eliminarStorage(titulo,contenido);
        
        };

    }


});

document.addEventListener('DOMContentLoaded', pintarTareas);
