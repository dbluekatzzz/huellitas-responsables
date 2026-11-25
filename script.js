
// Datos guardados de la aplicación

let mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];
let comidas = JSON.parse(localStorage.getItem("comidas")) || [];
let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];

// Asignar identificadores y registros de vacunas
// a las mascotas que ya estaban guardadas.

mascotas.forEach(m => {
  if (!m.id) {
    m.id = String(Date.now() + Math.random());
  }

  if (!m.vacunas) {
    m.vacunas = {};
  }
});

// Catálogo de vacunas por especie

const catalogoVacunas = {
  Perro: [
    {
      id: "rabia",
      nombre: "Vacuna contra la rabia"
    },
    {
      id: "multiple",
      nombre: "Vacuna múltiple (moquillo, parvovirus y adenovirus)"
    },
    {
      id: "bordetella",
      nombre: "Bordetella"
    },
    {
      id: "leptospirosis",
      nombre: "Leptospirosis"
    }
  ],

  Gato: [
    {
      id: "rabia",
      nombre: "Vacuna contra la rabia"
    },
    {
      id: "triple",
      nombre: "Triple felina (herpesvirus, calicivirus y panleucopenia)"
    },
    {
      id: "leucemia",
      nombre: "Leucemia felina (FeLV)"
    }
  ]
};

// Guardar información

function guardar() {
  localStorage.setItem("mascotas", JSON.stringify(mascotas));
  localStorage.setItem("comidas", JSON.stringify(comidas));
  localStorage.setItem("solicitudes", JSON.stringify(solicitudes));
}

// Evitar que los nombres ingresados se interpreten como HTML

function escaparHTML(texto) {
  return String(texto).replace(/[&<>"']/g, caracter => {
    const caracteres = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return caracteres[caracter];
  });
}

// Registrar mascotas

function registrarMascota() {
  let nombre = document.getElementById("nombre").value.trim();
  let tipo = document.getElementById("tipo").value;

  if (!nombre) {
    alert("Escribe el nombre de tu mascota");
    return;
  }

  mascotas.push({
    id: String(Date.now() + Math.random()),
    nombre: nombre,
    tipo: tipo,
    vacunas: {}
  });

  guardar();
  mostrar();

  document.getElementById("nombre").value = "";
}

// Registrar alimentación

function registrarComida() {
  let comida = document.getElementById("comida").value.trim();

  if (!comida) {
    alert("Escribe el alimento");
    return;
  }

  comidas.push(comida);

  guardar();
  mostrar();

  document.getElementById("comida").value = "";
}

// Solicitar servicios

function solicitar(servicio) {
  solicitudes.push(servicio);

  guardar();
  mostrar();

  alert("¡Solicitud de demostración registrada!");
}

// Mostrar información general

function mostrar() {
  document.getElementById("mascotas").innerHTML =
    mascotas.map(m =>
      `<div class="item">
        🐾 ${escaparHTML(m.nombre)} - ${escaparHTML(m.tipo)}
      </div>`
    ).join("");

  document.getElementById("comidas").innerHTML =
    comidas.map(c =>
      `<div class="item">🍖 ${escaparHTML(c)}</div>`
    ).join("");

  document.getElementById("solicitudes").innerHTML =
    solicitudes.map(s =>
      `<div class="item">✓ Solicitud: ${escaparHTML(s)}</div>`
    ).join("");

  mostrarVacunas();
}

// Mostrar registro de vacunas

function mostrarVacunas() {
  const contenedor = document.getElementById("vacunas");

  if (mascotas.length === 0) {
    contenedor.innerHTML = `
      <p class="empty">
        Primero registra una mascota para consultar sus vacunas.
      </p>
    `;
    return;
  }

  contenedor.innerHTML = mascotas.map(m => {

    let vacunas = catalogoVacunas[m.tipo] || [];

    let listaVacunas = vacunas.map(v => {

      let registro = m.vacunas[v.id] || {
        aplicada: false,
        fecha: ""
      };

      return `
        <div class="vaccine-card">

          <label class="vaccine-check">
            <input
              type="checkbox"
              data-pet="${escaparHTML(m.id)}"
              data-vaccine="${v.id}"
              ${registro.aplicada ? "checked" : ""}
            >

            ${escaparHTML(v.nombre)}
          </label>

          <div class="vaccine-date">
            Fecha de aplicación:

            <input
              type="date"
              value="${escaparHTML(registro.fecha || "")}"
              data-date-pet="${escaparHTML(m.id)}"
              data-date-vaccine="${v.id}"
              ${registro.aplicada ? "" : "disabled"}
            >
          </div>

          <span class="vaccine-status">
            ${registro.aplicada ? "✓ Vacuna aplicada" : "Pendiente"}
          </span>

        </div>
      `;

    }).join("");

    return `
      <div class="item">

        <h3 class="pet-title">
          🐾 ${escaparHTML(m.nombre)} (${escaparHTML(m.tipo)})
        </h3>

        <p>Marca las vacunas que ya recibió:</p>

        ${listaVacunas}

      </div>
    `;

  }).join("");
}

// Actualizar estado de las vacunas

document.getElementById("vacunas").addEventListener("change", function(e) {

  const elemento = e.target;

  // Actualizar casilla de vacunación

  if (elemento.matches('input[type="checkbox"][data-pet]')) {

    const mascota = mascotas.find(m => m.id === elemento.dataset.pet);

    if (!mascota) return;

    const vacunaId = elemento.dataset.vaccine;

    if (!mascota.vacunas) {
      mascota.vacunas = {};
    }

    const registro = mascota.vacunas[vacunaId] || {
      aplicada: false,
      fecha: ""
    };

    registro.aplicada = elemento.checked;

    mascota.vacunas[vacunaId] = registro;

    guardar();
    mostrarVacunas();

  }

  // Actualizar fecha de aplicación

  if (elemento.matches('input[type="date"][data-date-pet]')) {

    const mascota = mascotas.find(m => m.id === elemento.dataset.datePet);

    if (!mascota) return;

    const vacunaId = elemento.dataset.dateVaccine;

    if (!mascota.vacunas) {
      mascota.vacunas = {};
    }

    const registro = mascota.vacunas[vacunaId] || {
      aplicada: false,
      fecha: ""
    };

    registro.fecha = elemento.value;

    mascota.vacunas[vacunaId] = registro;

    guardar();
  }

});

// Checklist de cuidados diarios

const tareas = [
  "tarea1",
  "tarea2",
  "tarea3",
  "tarea4",
  "tarea5"
];

// Iniciar checklist

function iniciarChecklist() {
  let guardado = JSON.parse(
    localStorage.getItem("checklist")
  ) || {};

  tareas.forEach(id => {
    let casilla = document.getElementById(id);

    casilla.checked = guardado[id] || false;

    casilla.addEventListener("change", actualizarChecklist);
  });

  actualizarChecklist();
}

// Actualizar progreso

function actualizarChecklist() {
  let completadas = 0;
  let estado = {};

  tareas.forEach(id => {
    let casilla = document.getElementById(id);

    estado[id] = casilla.checked;

    if (casilla.checked) {
      completadas++;
    }
  });

  localStorage.setItem("checklist", JSON.stringify(estado));

  let porcentaje = (completadas / tareas.length) * 100;

  document.getElementById("progreso").textContent =
    completadas + " de " + tareas.length +
    " actividades completadas";

  document.getElementById("barraProgreso").style.width =
    porcentaje + "%";
}

// Reiniciar checklist

function reiniciarChecklist() {
  tareas.forEach(id => {
    document.getElementById(id).checked = false;
  });

  actualizarChecklist();
}

// Iniciar aplicación

guardar();
mostrar();
iniciarChecklist();
