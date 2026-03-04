/**
 * LA GRAN GUERRA — JAVASCRIPT PRINCIPAL
 * Proyecto Educativo WWI
 * Módulo: guardado, libreta, personajes, progresión
 */

'use strict';

/* ═══════════════════════════════════════════════════
   CONSTANTES Y DATOS
═══════════════════════════════════════════════════ */

const PERSONAJES = [
  {
    id: 'primo',
    nombre: 'General Primo de Rivera',
    rango: 'General de División',
    emoji: '⚔️',
    estrellas: 4,
    habilidades: {
      estrategia: 92,
      diplomacia: 68,
      inteligencia: 85,
      mando: 95
    },
    informe: `El General Primo de Rivera es un militar de singular determinación y gran capacidad táctica. Su experiencia en las campañas africanas le ha forjado una mente estratégica capaz de anticipar los movimientos del enemigo con notable precisión. Su autoridad sobre las tropas es indiscutible, aunque su carácter firme puede dificultar las negociaciones diplomáticas. Ideal para ofensivas directas y maniobras de envolvimiento.`,
    biografia: `Miguel Primo de Rivera y Orbaneja (1870-1930). Nacido en Jerez de la Frontera, ascendió rápidamente por méritos propios en Cuba, Filipinas y Marruecos. Conocido por su carácter enérgico y su visión estratégica. Su liderazgo sería determinante en los momentos más críticos del frente occidental.`
  },
  {
    id: 'weyler',
    nombre: 'Capitán Weyler',
    rango: 'Capitán de Estado Mayor',
    emoji: '🗺️',
    estrellas: 3,
    habilidades: {
      estrategia: 78,
      diplomacia: 88,
      inteligencia: 96,
      mando: 72
    },
    informe: `El Capitán Weyler destaca como uno de los analistas militares más brillantes de la generación. Su manejo de la inteligencia y contraprogramación de operaciones enemigas lo convierte en un activo invaluable en misiones de infiltración y análisis. Su capacidad diplomática facilita la coordinación entre aliados, aunque prefiere el trabajo de gabinete a la acción directa en campo.`,
    biografia: `Valeriano Weyler y Nicolau (1838-1930). Nacido en Palma de Mallorca, su carrera militar estuvo marcada por la meticulosidad analítica y el dominio de la inteligencia militar. Sus informes estratégicos fueron reconocidos por el Estado Mayor como documentos de referencia para la planificación de operaciones.`
  },
  {
    id: 'martinez',
    nombre: 'Coronel Martínez Campos',
    rango: 'Coronel de Ingenieros',
    emoji: '🔭',
    estrellas: 3,
    habilidades: {
      estrategia: 85,
      diplomacia: 75,
      inteligencia: 80,
      mando: 82
    },
    informe: `El Coronel Martínez Campos representa el perfil del oficial técnico y organizador. Su formación en ingeniería militar le otorga una comprensión profunda de las fortificaciones, la logística y el uso del terreno. Equilibrado en todas sus capacidades, es el comandante más versátil del grupo. Su habilidad para leer el terreno y anticipar necesidades logísticas lo convierte en el comandante ideal para misiones de largo aliento.`,
    biografia: `Arsenio Martínez Campos y Antón (1831-1900). General español de gran reputación, conocido por su rectitud y habilidad organizativa. Su legado en la restructuración del Ejército español sirvió de modelo para las generaciones posteriores, que encontraron en sus escritos tácticos una guía invaluable para los conflictos modernos.`
  }
];

const NIVELES = {
  'nivel-01': { nombre: 'Preludio al Conflicto', orden: 1, total: 4 },
  'nivel-02': { nombre: 'Movilización', orden: 2, total: 4 },
  'nivel-03': { nombre: 'El Frente Occidental', orden: 3, total: 4 },
  'nivel-04': { nombre: 'Crisis en el Marne', orden: 4, total: 4 },
  'nivel-alemania': { nombre: 'Decisión en Berlín', orden: 5, total: 5 },
  'ruta-sur-01': { nombre: 'Hacia el Sur', orden: 1, total: 7 },
  'ruta-sur-02': { nombre: 'Los Balcanes', orden: 2, total: 7 },
  'ruta-sur-03': { nombre: 'El Imperio Otomano', orden: 3, total: 7 },
  'ruta-sur-04': { nombre: 'Mesopotamia', orden: 4, total: 7 },
  'ruta-sur-05': { nombre: 'La Campaña Árabe', orden: 5, total: 7 },
  'ruta-sur-06': { nombre: 'Palestina', orden: 6, total: 7 },
  'ruta-sur-07': { nombre: 'El Armisticio', orden: 7, total: 7 }
};

/* ═══════════════════════════════════════════════════
   GESTIÓN DE PARTIDAS (localStorage)
═══════════════════════════════════════════════════ */

const Partidas = {
  KEY: 'wwi_partidas',

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch { return []; }
  },

  getCurrent() {
    try {
      const id = localStorage.getItem('wwi_partida_activa');
      if (!id) return null;
      return this.getAll().find(p => p.id === id) || null;
    } catch { return null; }
  },

  save(partida) {
    const partidas = this.getAll();
    const idx = partidas.findIndex(p => p.id === partida.id);
    partida.fechaGuardado = new Date().toLocaleString('es-ES');
    if (idx >= 0) partidas[idx] = partida;
    else partidas.push(partida);
    localStorage.setItem(this.KEY, JSON.stringify(partidas));
    localStorage.setItem('wwi_partida_activa', partida.id);
  },

  crear(nombre) {
    const partida = {
      id: 'p_' + Date.now(),
      nombre: nombre,
      fechaInicio: new Date().toLocaleString('es-ES'),
      fechaGuardado: null,
      personaje: null,
      nivelActual: 'contexto-historico',
      nivelesCompletados: [],
      ruta: null,
      notas: '',
      datos: {}
    };
    this.save(partida);
    return partida;
  },

  cargar(id) {
    const partidas = this.getAll();
    const p = partidas.find(p => p.id === id);
    if (p) localStorage.setItem('wwi_partida_activa', id);
    return p || null;
  },

  eliminar(id) {
    let partidas = this.getAll().filter(p => p.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(partidas));
    const activa = localStorage.getItem('wwi_partida_activa');
    if (activa === id) localStorage.removeItem('wwi_partida_activa');
  },

  actualizarNivel(nivel) {
    const p = this.getCurrent();
    if (!p) return;
    if (!p.nivelesCompletados.includes(nivel)) {
      p.nivelesCompletados.push(nivel);
    }
    p.nivelActual = nivel;
    this.save(p);
  },

  setPersonaje(idPersonaje) {
    const p = this.getCurrent();
    if (!p) return;
    p.personaje = idPersonaje;
    this.save(p);
  },

  setRuta(ruta) {
    const p = this.getCurrent();
    if (!p) return;
    p.ruta = ruta;
    this.save(p);
  },

  guardarNotas(texto) {
    const p = this.getCurrent();
    if (!p) return;
    p.notas = texto;
    this.save(p);
  },

  getNivelCompletado(nivel) {
    const p = this.getCurrent();
    if (!p) return false;
    return p.nivelesCompletados.includes(nivel);
  }
};

/* ═══════════════════════════════════════════════════
   LIBRETA / DIARIO FLOTANTE
═══════════════════════════════════════════════════ */

const Libreta = {
  init() {
    const toggle  = document.getElementById('libreta-toggle');
    const body    = document.getElementById('libreta-body');
    const notas   = document.getElementById('libreta-notas');
    const guardado = document.getElementById('libreta-guardado');
    if (!toggle || !notas) return;

    // Cargar notas de partida actual
    const p = Partidas.getCurrent();
    if (p && p.notas) notas.value = p.notas;

    // Toggle libreta
    toggle.addEventListener('click', () => {
      body.classList.toggle('open');
      const icono = toggle.querySelector('.libreta-arrow');
      if (icono) icono.textContent = body.classList.contains('open') ? '▲' : '▼';
    });

    // Auto-guardado con debounce
    let timer;
    notas.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        Partidas.guardarNotas(notas.value);
        if (guardado) {
          guardado.textContent = 'Guardado ✓';
          setTimeout(() => { guardado.textContent = ''; }, 2000);
        }
      }, 800);
    });
  },

  actualizarNotas() {
    const notas = document.getElementById('libreta-notas');
    if (!notas) return;
    const p = Partidas.getCurrent();
    if (p) notas.value = p.notas || '';
  }
};

/* ═══════════════════════════════════════════════════
   CARTAS DE PERSONAJE
═══════════════════════════════════════════════════ */

const CartaPersonaje = {
  indiceActual: 0,

  init() {
    this.renderizar();
    const btnPrev = document.getElementById('btn-carta-prev');
    const btnNext = document.getElementById('btn-carta-next');
    const btnVoltear = document.getElementById('btn-voltear');
    const btnElegir = document.getElementById('btn-elegir-personaje');

    if (btnPrev) btnPrev.addEventListener('click', () => this.navegar(-1));
    if (btnNext) btnNext.addEventListener('click', () => this.navegar(1));
    if (btnVoltear) btnVoltear.addEventListener('click', () => this.voltear());
    if (btnElegir) btnElegir.addEventListener('click', () => this.elegir());
  },

  navegar(dir) {
    this.indiceActual = (this.indiceActual + dir + PERSONAJES.length) % PERSONAJES.length;
    // Reset volteo
    const inner = document.querySelector('.carta-inner');
    if (inner) inner.classList.remove('rotada');
    this.renderizar();
    this.animarEntrada();
  },

  animarEntrada() {
    const wrapper = document.querySelector('.carta-wrapper');
    if (!wrapper) return;
    wrapper.style.animation = 'none';
    wrapper.offsetHeight;
    wrapper.style.animation = 'rotateFadeIn 0.5s ease';
  },

  renderizar() {
    const p = PERSONAJES[this.indiceActual];
    if (!p) return;

    // Frente
    const nombre  = document.getElementById('carta-nombre');
    const rango   = document.getElementById('carta-rango');
    const foto    = document.getElementById('carta-foto');
    const estrellas = document.getElementById('carta-estrellas');

    if (nombre) nombre.textContent = p.nombre;
    if (rango) rango.textContent = p.rango;
    if (foto) foto.textContent = p.emoji;
    if (estrellas) {
      estrellas.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.textContent = i < p.estrellas ? '★' : '☆';
        star.style.opacity = i < p.estrellas ? '1' : '0.3';
        estrellas.appendChild(star);
      }
    }

    // Dorso - habilidades
    Object.entries(p.habilidades).forEach(([key, val]) => {
      const fill = document.getElementById(`hab-${key}`);
      const pct  = document.getElementById(`hab-${key}-pct`);
      if (fill) { fill.style.width = '0'; setTimeout(() => fill.style.width = val + '%', 100); }
      if (pct) pct.textContent = val + '%';
    });

    // Informe y biografía
    const informe = document.getElementById('personaje-informe');
    const bio     = document.getElementById('personaje-bio');
    if (informe) { informe.style.opacity = 0; informe.textContent = p.informe; informe.style.transition = 'opacity 0.5s'; setTimeout(() => informe.style.opacity = 1, 50); }
    if (bio) { bio.style.opacity = 0; bio.textContent = p.biografia; bio.style.transition = 'opacity 0.5s'; setTimeout(() => bio.style.opacity = 1, 100); }

    // Indicadores
    const indics = document.querySelectorAll('.carta-indicador');
    indics.forEach((el, i) => {
      el.classList.toggle('activo', i === this.indiceActual);
    });
  },

  voltear() {
    const inner = document.querySelector('.carta-inner');
    if (inner) inner.classList.toggle('rotada');
  },

  elegir() {
    const p = PERSONAJES[this.indiceActual];
    Partidas.setPersonaje(p.id);
    // Animación de confirmación
    const btn = document.getElementById('btn-elegir-personaje');
    if (btn) {
      btn.textContent = '✓ ' + p.nombre + ' seleccionado';
      btn.classList.add('btn-gold');
      setTimeout(() => {
        window.location.href = 'nivel-01.html';
      }, 1200);
    }
  }
};

/* ═══════════════════════════════════════════════════
   PISTAS DESPLEGABLES
═══════════════════════════════════════════════════ */

function initPistas() {
  document.querySelectorAll('.pista-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const contenido = btn.nextElementSibling;
      const abierta = contenido.classList.contains('abierta');
      document.querySelectorAll('.pista-contenido').forEach(c => c.classList.remove('abierta'));
      document.querySelectorAll('.pista-toggle').forEach(b => b.classList.remove('activa'));
      if (!abierta) {
        contenido.classList.add('abierta');
        btn.classList.add('activa');
      }
    });
    // Compatibilidad: pista-icono o icono
    const icono = btn.querySelector('.pista-icono, .icono');
    if (icono && !icono.classList.contains('pista-icono')) {
      icono.classList.add('pista-icono');
    }
  });
}

/* ─── NAV SCROLL EFFECT ──────────────────────────────────── */
function initNavScroll() {
  const nav = document.querySelector('.nav-principal');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════
   TEXTO PROGRESIVO (efecto escritura)
═══════════════════════════════════════════════════ */

function textoProgresivo(elementId, delay = 30) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const texto = el.textContent;
  el.innerHTML = '';
  [...texto].forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.animationDelay = (i * delay) + 'ms';
    span.classList.add('char-anim');
    el.appendChild(span);
  });
}

/* ═══════════════════════════════════════════════════
   MAPA DE PROGRESO
═══════════════════════════════════════════════════ */

function initMapaProgreso(nivelId) {
  const info = NIVELES[nivelId];
  if (!info) return;
  const barras = document.querySelectorAll('.paso-mapa');
  barras.forEach((b, i) => {
    setTimeout(() => {
      if (i < info.orden - 1) b.classList.add('completado');
      else if (i === info.orden - 1) b.classList.add('activo');
    }, i * 200);
  });
}

/* ═══════════════════════════════════════════════════
   BARRA DE PUNTOS (progreso global)
═══════════════════════════════════════════════════ */

function initPuntosNivel(totalNiveles, nivelActual) {
  const container = document.querySelector('.barra-nivel');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 1; i <= totalNiveles; i++) {
    const punto = document.createElement('div');
    punto.classList.add('punto-nivel');
    if (i < nivelActual) punto.classList.add('hecho');
    else if (i === nivelActual) punto.classList.add('actual');
    container.appendChild(punto);
  }
}

/* ═══════════════════════════════════════════════════
   MODAL NUEVA PARTIDA / CARGAR PARTIDA
═══════════════════════════════════════════════════ */

const ModalPartida = {
  mostrarNueva() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box">
        <h2 class="modal-titulo">Nueva Partida</h2>
        <p class="text-typewriter" style="color:var(--sepia-light);font-size:0.85rem;margin-bottom:1.2rem;letter-spacing:0.05em;">
          Introduzca el nombre del comandante:
        </p>
        <input type="text" id="input-nombre" class="input-campo"
               placeholder="Nombre del Comandante..." maxlength="40">
        <div style="display:flex;gap:1rem;margin-top:1rem;">
          <button class="btn btn-primary" onclick="ModalPartida.confirmarNueva()">
            ⚔ Comenzar Misión
          </button>
          <button class="btn btn-secondary" onclick="ModalPartida.cerrar()">
            Cancelar
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => document.getElementById('input-nombre')?.focus(), 100);
    document.getElementById('input-nombre')?.addEventListener('keyup', e => {
      if (e.key === 'Enter') this.confirmarNueva();
    });
    this._overlay = overlay;
  },

  confirmarNueva() {
    const nombre = document.getElementById('input-nombre')?.value?.trim();
    if (!nombre) return;
    const p = Partidas.crear(nombre);
    this.cerrar();
    window.location.href = 'pages/contexto-historico.html';
  },

  mostrarCargar() {
    const partidas = Partidas.getAll();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    let lista = partidas.length === 0
      ? '<p class="text-typewriter" style="color:var(--sepia-light);text-align:center;padding:2rem;">Sin partidas guardadas.</p>'
      : partidas.map(p => `
          <div class="partida-item" onclick="ModalPartida.cargarPartida('${p.id}')">
            <div>
              <div class="partida-nombre">${p.nombre}</div>
              <div class="partida-fecha">${p.nivelActual || 'Inicio'} — ${p.fechaGuardado || p.fechaInicio}</div>
            </div>
            <button class="btn btn-danger" style="padding:0.3rem 0.7rem;font-size:0.7rem;"
                    onclick="event.stopPropagation();ModalPartida.eliminarPartida('${p.id}')">✕</button>
          </div>
        `).join('');

    overlay.innerHTML = `
      <div class="modal-box">
        <h2 class="modal-titulo">Cargar Partida</h2>
        <div style="max-height:320px;overflow-y:auto;">${lista}</div>
        <button class="btn btn-secondary" style="margin-top:1.2rem;width:100%;"
                onclick="ModalPartida.cerrar()">Cerrar</button>
      </div>
    `;
    document.body.appendChild(overlay);
    this._overlay = overlay;
  },

  cargarPartida(id) {
    const p = Partidas.cargar(id);
    if (!p) return;
    this.cerrar();
    const nivel = p.nivelActual || 'contexto-historico';
    // Determinar la ruta del archivo
    const paginas = ['contexto-historico','seleccion-personaje','final','diario'];
    const esRaiz = window.location.pathname.endsWith('index.html') ||
                   window.location.pathname === '/' ||
                   window.location.pathname.endsWith('/');
    const prefijo = esRaiz ? 'pages/' : '';
    window.location.href = prefijo + nivel + '.html';
  },

  eliminarPartida(id) {
    if (confirm('¿Eliminar esta partida?')) {
      Partidas.eliminar(id);
      this.cerrar();
      this.mostrarCargar();
    }
  },

  cerrar() {
    if (this._overlay) { this._overlay.remove(); this._overlay = null; }
  }
};

/* ═══════════════════════════════════════════════════
   NOMBRE DEL COMANDANTE EN PÁGINA
═══════════════════════════════════════════════════ */

function mostrarNombreComandante() {
  const p = Partidas.getCurrent();
  const els = document.querySelectorAll('.nombre-comandante');
  const personaje = p && p.personaje ? PERSONAJES.find(x => x.id === p.personaje) : null;
  els.forEach(el => {
    el.textContent = p ? (personaje ? personaje.nombre : p.nombre) : 'Comandante';
  });
}

/* ═══════════════════════════════════════════════════
   BOTÓN GUARDAR PROGRESO
═══════════════════════════════════════════════════ */

function initGuardarProgreso(nivelId) {
  const btn = document.getElementById('btn-guardar');
  if (!btn) return;
  btn.addEventListener('click', () => {
    Partidas.actualizarNivel(nivelId);
    btn.textContent = '✓ Guardado';
    btn.classList.add('btn-gold');
    setTimeout(() => {
      btn.textContent = '💾 Guardar Progreso';
      btn.classList.remove('btn-gold');
    }, 2000);
  });
}

/* ═══════════════════════════════════════════════════
   DECK.TOYS — ABRIR ESCENARIO
═══════════════════════════════════════════════════ */

function abrirEscenario(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ═══════════════════════════════════════════════════
   TRANSICIÓN DE PÁGINA
═══════════════════════════════════════════════════ */

function navegarA(url) {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  setTimeout(() => { window.location.href = url; }, 400);
}

/* ═══════════════════════════════════════════════════
   INICIALIZACIÓN GLOBAL
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Fade in página
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';
  });

  // Libreta
  Libreta.init();

  // Nav scroll
  initNavScroll();

  // Nombre comandante
  mostrarNombreComandante();

  // Pistas
  initPistas();

  // Botones del menú principal (index.html)
  const btnNueva = document.getElementById('btn-nueva-partida');
  const btnCargar = document.getElementById('btn-cargar-partida');
  if (btnNueva) btnNueva.addEventListener('click', () => ModalPartida.mostrarNueva());
  if (btnCargar) btnCargar.addEventListener('click', () => ModalPartida.mostrarCargar());

  // Carta de personaje
  if (document.querySelector('.carta-wrapper')) CartaPersonaje.init();

  // Detectar nivel actual
  const path = window.location.pathname;
  const match = path.match(/(nivel-\d+|nivel-alemania|ruta-sur-\d+)/);
  if (match) {
    const nivelId = match[1];
    const info = NIVELES[nivelId];
    if (info) {
      initMapaProgreso(nivelId);
      initPuntosNivel(info.total, info.orden);
      initGuardarProgreso(nivelId);
    }
  }

  // Guardar nivel al llegar
  const nivelMatch = path.match(/pages\/([\w-]+)\.html/);
  if (nivelMatch) {
    const pagina = nivelMatch[1];
    if (NIVELES[pagina]) Partidas.actualizarNivel(pagina);
  }
});

/* ═══════════════════════════════════════════════════
   HELPERS EXPORTADOS (acceso global desde HTML)
═══════════════════════════════════════════════════ */

window.ModalPartida   = ModalPartida;
window.CartaPersonaje = CartaPersonaje;
window.Partidas       = Partidas;
window.Libreta        = Libreta;
window.navegarA       = navegarA;
window.abrirEscenario = abrirEscenario;
window.textoProgresivo= textoProgresivo;
window.PERSONAJES     = PERSONAJES;
