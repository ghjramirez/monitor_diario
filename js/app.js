const API_DOLAR = 'https://dolarapi.com/v1/dolares';
const API_CLIMA_BASE = 'https://api.open-meteo.com/v1/forecast';
const API_CLIMA_PARAMS =
  '&current=temperature_2m,relative_humidity_2m,weather_code,apparent_temperature' +
  '&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min' +
  '&forecast_days=2&timezone=America%2FArgentina%2FBuenos_Aires';
const API_CLIMA_CABA = `${API_CLIMA_BASE}?latitude=-34.6037&longitude=-58.3816${API_CLIMA_PARAMS}`;
const API_CLIMA_QUILMES = `${API_CLIMA_BASE}?latitude=-34.7233&longitude=-58.2681${API_CLIMA_PARAMS}`;
const API_FERIADOS = 'https://api.argentinadatos.com/v1/feriados/';
const API_TRENES_RAMALES =
  'https://ariedro.dev/api-trenes/infraestructura/ramales?idGerencia=11';
const API_TRENES_ARRIBOS_CONST =
  'https://ariedro.dev/api-trenes/arribos/estacion/93?cantidad=15';
const API_TRENES_ARRIBOS_QUILMES =
  'https://ariedro.dev/api-trenes/arribos/estacion/322?cantidad=15';
const RAMALES_FILTRADOS = [
  'Constitución-Bosques-Q',
  'Constitución-La Plata',
];

const TIPOS_DOLAR = ['oficial', 'blue', 'tarjeta'];
const NOMBRES_DOLAR = {
  oficial: 'Dólar Oficial',
  blue: 'Dólar Blue',
  tarjeta: 'Dólar Tarjeta',
};

let datosDolar = [];

function renderClima(nombre, datos) {
  const actual = datos.current;
  const codigo = actual.weather_code;
  const desc = WMO_CODES[codigo] || `🌡️ Código ${codigo}`;
  const probHoy = datos.daily.precipitation_probability_max[0];
  const probManana = datos.daily.precipitation_probability_max[1];
  const maxHoy = datos.daily.temperature_2m_max[0];
  const minHoy = datos.daily.temperature_2m_min[0];

  return `
          <div class="clima-grupo">
              <h3 class="clima-titulo">${nombre}</h3>
              <div class="cards">
                  <div class="card">
                      <div class="card-titulo">Temperatura</div>
                      <div class="card-valor">${actual.temperature_2m}°C</div>
                      <div class="card-subvalor">Sensación: ${actual.apparent_temperature}°C</div>
                  </div>
                  <div class="card">
                      <div class="card-titulo">Condición</div>
                      <div class="card-valor">${desc}</div>
                  </div>
                  <div class="card">
                      <div class="card-titulo">Máx / Mín</div>
                      <div class="card-valor">${maxHoy}° / ${minHoy}°</div>
                  </div>
                  <div class="card">
                      <div class="card-titulo">Humedad</div>
                      <div class="card-valor">${actual.relative_humidity_2m}%</div>
                  </div>
                  <div class="card">
                      <div class="card-titulo">🌧️ Prob. lluvia</div>
                      <div class="card-valor">${probHoy}%</div>
                      <div class="card-subvalor">Mañana: ${probManana}%</div>
                  </div>
              </div>
          </div>
      `;
}

const WMO_CODES = {
  0: '☀️ Despejado',
  1: '☀️ Mayormente despejado',
  2: '⛅ Parc. nublado',
  3: '☁️ Nublado',
  45: '🌫️ Niebla',
  48: '🌫️ Niebla escarchada',
  51: '🌦️ Lluvia ligera',
  53: '🌦️ Lluvia moderada',
  55: '🌧️ Lluvia intensa',
  61: '🌧️ Lluvia',
  63: '🌧️ Lluvia fuerte',
  65: '🌧️ Lluvia extrema',
  71: '🌨️ Nieve ligera',
  73: '🌨️ Nieve',
  75: '❄️ Nieve intensa',
  80: '🌦️ Chubasco ligero',
  81: '🌧️ Chubasco',
  82: '🌧️ Chubasco fuerte',
  95: '⛈️ Tormenta',
  96: '⛈️ Tormenta con granizo',
  99: '⛈️ Tormenta fuerte con granizo',
};

const DIAS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const STORAGE_KEY = 'monitor-ahorro';
const STORAGE_KEY_SECCIONES = 'monitor-secciones';

const TICKER_FRASES = [
  'El dinero crece en el árbol de la persistencia',
  'A río revuelto, ganancia de pescadores',
  'Escribe 100 palabras al día y en un año tendrás una novela',
  'La disciplina es el camino hacia la libertad',
  'No cuentes los pollitos antes de que nazcan',
  'El miedo es el asesino de la mente',
];
const TICKER_SEPARADOR = '\u00A0\u00A0\u00A0·\u00A0\u00A0\u00A0';

function cargarDatosAhorro() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { monto: 5, dias: {} };
  try {
    return JSON.parse(raw);
  } catch {
    return { monto: 5, dias: {} };
  }
}

function guardarDatosAhorro(datos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
}

function fechaStr(d) {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

function mesStr(anio, mes) {
  return anio + '-' + String(mes + 1).padStart(2, '0');
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const FETCH_TIMEOUT = 10000;

// ── Caché de respuestas API ──────────────────────────
const apiCache = new Map();

function getCacheTTL(url) {
  if (url.includes('feriados')) return 3600000; // 1 hora
  if (url.includes('ramales')) return 1800000; // 30 min
  if (url.includes('open-meteo')) return 600000; // 10 min
  return 300000; // 5 min por defecto
}

async function fetchConTimeout(url, signal) {
  const cacheKey = url;
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.response.clone();
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    FETCH_TIMEOUT,
  );
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), {
      once: true,
    });
  }
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (res.ok) {
      const ttl = getCacheTTL(url);
      apiCache.set(cacheKey, {
        response: res.clone(),
        timestamp: Date.now(),
        ttl,
      });
      // Limpiar entradas viejas si el caché crece demasiado
      if (apiCache.size > 30) {
        const umbral = Date.now() - 3600000;
        for (const [k, v] of apiCache) {
          if (v.timestamp < umbral) apiCache.delete(k);
        }
      }
    }
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

function nthWeekday(anio, mes, weekday, n) {
  const primerDia = new Date(anio, mes, 1);
  const diff = (weekday - primerDia.getDay() + 7) % 7;
  return new Date(anio, mes, 1 + diff + (n - 1) * 7);
}

function ultimoWeekday(anio, mes, weekday) {
  const ultimoDia = new Date(anio, mes + 1, 0);
  const diff = (ultimoDia.getDay() - weekday + 7) % 7;
  return new Date(anio, mes, ultimoDia.getDate() - diff);
}

const EVENTOS = [
  { mes: 2, dia: 14, nombre: 'San Valentín' },
  { mes: 4, dia: 2, nombre: 'Día del Veterano y Caídos en Malvinas' },
  { mes: 7, dia: 20, nombre: 'Día del Amigo' },
  { mes: 9, dia: 21, nombre: 'Día del Estudiante' },
  { mes: 10, dia: 31, nombre: 'Halloween' },
  { mes: 11, dia: 1, nombre: 'Día de los Fieles Difuntos' },
  { mes: 12, dia: 24, nombre: 'Nochebuena' },
  { mes: 12, dia: 31, nombre: 'Fin de Año' },
];

function calcularDiasFijos(anio) {
  return EVENTOS.map((e) => ({
    fecha: new Date(anio, e.mes - 1, e.dia),
    nombre: e.nombre,
    tipo: 'evento',
  }));
}

function calcularDiasRelativos(anio) {
  const eventos = [
    {
      calcular: (y) => nthWeekday(y, 5, 0, 3),
      nombre: 'Día del Padre',
    },
    {
      calcular: (y) => nthWeekday(y, 9, 0, 3),
      nombre: 'Día de la Madre',
    },
    {
      calcular: (y) => nthWeekday(y, 7, 0, 3),
      nombre: 'Día del Niño',
    },
  ];
  return eventos.map((e) => ({
    fecha: e.calcular(anio),
    nombre: e.nombre,
    tipo: 'evento',
  }));
}

function toggleSeccion(id) {
  const seccion = document.getElementById(id);
  const contenido = seccion.querySelector('.seccion-contenido');
  const boton = seccion.querySelector('.seccion-toggle');
  const colapsada = seccion.classList.contains('colapsada');

  if (colapsada) {
    const altura = contenido.scrollHeight;
    seccion.classList.remove('colapsada');
    contenido.style.maxHeight = altura + 'px';
    contenido.addEventListener(
      'transitionend',
      () => {
        contenido.style.maxHeight = '';
      },
      { once: true },
    );
    boton.setAttribute('aria-expanded', 'true');
  } else {
    const altura = contenido.scrollHeight;
    seccion.classList.add('colapsada');
    requestAnimationFrame(() => {
      contenido.style.maxHeight = '0px';
    });
    boton.setAttribute('aria-expanded', 'false');
  }

  const ahoraColapsada = seccion.classList.contains('colapsada');
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SECCIONES);
    const estado = raw ? JSON.parse(raw) : {};
    estado[id] = ahoraColapsada;
    localStorage.setItem(
      STORAGE_KEY_SECCIONES,
      JSON.stringify(estado),
    );
  } catch {} // Si falla la lectura/escritura de localStorage, ignoramos
}

function actualizarReloj() {
  const ahora = new Date();
  const dia = DIAS[ahora.getDay()];
  const numero = ahora.getDate();
  const mes = MESES[ahora.getMonth()];
  const anio = ahora.getFullYear();
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');

  document.getElementById('reloj').innerHTML =
    `${dia} ${numero} de ${mes} ${anio}<br>${horas}:${minutos}`;
}

function formatearMoneda(valor) {
  const num = Number(valor);
  if (isNaN(num)) return '$ -';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(num);
}

function formatearUSD(valor) {
  const num = Number(valor);
  if (isNaN(num)) return 'U$D -';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function formatearNumero(valor) {
  const num = Number(valor);
  if (isNaN(num)) return '-';
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

async function cargarDolar(signal) {
  const contenedor = document.getElementById('dolar-cards');
  try {
    const respuesta = await fetchConTimeout(API_DOLAR, signal);
    if (!respuesta.ok)
      throw new Error('Error al obtener cotizaciones');
    const datos = await respuesta.json();

    const filtrados = datos.filter((d) =>
      TIPOS_DOLAR.includes(d.casa),
    );

    if (filtrados.length === 0) {
      contenedor.innerHTML =
        '<div class="card card-error"><div class="card-titulo">Sin datos</div><div class="card-valor">No hay cotizaciones disponibles</div></div>';
      return;
    }

    contenedor.innerHTML = filtrados
      .map(
        (d) => `
            <div class="card">
                <div class="card-titulo">${escapeHtml(NOMBRES_DOLAR[d.casa] || d.nombre)}</div>
                <div class="card-valor">${formatearMoneda(d.venta)}</div>
                <div class="card-subvalor">Compra: ${formatearMoneda(d.compra)}</div>
            </div>
        `,
      )
      .join('');

    datosDolar = filtrados;
    actualizarConversor();
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error('Error dólar:', error);
    contenedor.innerHTML =
      '<div class="card card-error"><div class="card-titulo">Error</div><div class="card-valor">No se pudieron cargar los datos</div></div>';
  }
}

async function cargarClima(signal) {
  const contenedor = document.getElementById('clima-cards');

  try {
    const [resCaba, resQuilmes] = await Promise.all([
      fetchConTimeout(API_CLIMA_CABA, signal),
      fetchConTimeout(API_CLIMA_QUILMES, signal),
    ]);

    let html = '';
    if (resCaba.ok) {
      const datosCaba = await resCaba.json();
      html += renderClima('CABA', datosCaba);
    }
    if (resQuilmes.ok) {
      const datosQuilmes = await resQuilmes.json();
      html += renderClima('Quilmes', datosQuilmes);
    }

    if (!html) throw new Error('Error al obtener clima');

    contenedor.innerHTML = html;
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error('Error clima:', error);
    contenedor.innerHTML =
      '<div class="card card-error"><div class="card-titulo">Error</div><div class="card-valor">No se pudieron cargar los datos</div></div>';
  }
}

async function cargarTrenes(signal) {
  const contenedorCards = document.getElementById('trenes-cards');
  const contenedorAlertas = document.getElementById('trenes-alertas');

  try {
    const respuesta = await fetchConTimeout(
      API_TRENES_RAMALES,
      signal,
    );
    if (!respuesta.ok)
      throw new Error('Error al obtener datos de trenes');
    const ramales = await respuesta.json();

    const ramalesFiltrados = ramales.filter((r) =>
      RAMALES_FILTRADOS.includes(r.nombre),
    );

    contenedorCards.innerHTML = ramalesFiltrados
      .map((ramal) => {
        const estado = ramal.operativo ? 'card-verde' : 'card-rojo';
        const textoEstado = ramal.operativo
          ? 'Operativo'
          : 'Interrumpido';
        const tieneAlertas = ramal.alerta && ramal.alerta.length > 0;

        return `
                <div class="card ${estado}">
                    <div class="card-titulo">${escapeHtml(ramal.nombre)}</div>
                    <div class="card-valor">${textoEstado}</div>
                    <div class="card-subvalor">${ramal.es_electrico ? '⚡ Eléctrico' : '🚂 Diésel'}</div>
                    ${tieneAlertas ? '<div class="card-subvalor alerta-indicador">⚠️ ' + ramal.alerta.length + ' alerta(s)</div>' : ''}
                </div>
            `;
      })
      .join('');

    const alertasActivas = ramalesFiltrados
      .filter((r) => r.alerta && r.alerta.length > 0)
      .flatMap((r) =>
        r.alerta.map((a) => ({ ...a, ramal: r.nombre })),
      );

    if (alertasActivas.length > 0) {
      contenedorAlertas.innerHTML = `
                <h3 class="alertas-titulo">Alertas Activas</h3>
                ${alertasActivas
                  .map(
                    (alerta) => `
                    <div class="alerta">
                        <strong>${escapeHtml(alerta.ramal)}:</strong> ${escapeHtml(alerta.contenido)}
                    </div>
                `,
                  )
                  .join('')}
            `;
    } else {
      contenedorAlertas.innerHTML = '';
    }
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error('Error trenes:', error);
    contenedorCards.innerHTML =
      '<div class="card card-error"><div class="card-titulo">Error</div><div class="card-valor">No se pudieron cargar los datos</div></div>';
  }
}

function formatearSegundos(seg) {
  if (seg <= 0) return 'Ahora';
  const min = Math.floor(seg / 60);
  if (min < 1) return '< 1 min';
  return min + ' min';
}

function convertirHoraISO(iso) {
  if (!iso) return '--:--';
  const d = new Date(iso);
  return d.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Argentina/Buenos_Aires',
  });
}

function renderTablaArribos(titulo, arribos, esSalida) {
  if (arribos.length === 0) {
    return `
            <div class="arribos-grupo">
                <h3 class="arribos-subtitulo">${titulo}</h3>
                <div class="card"><div class="card-titulo">Sin datos</div><div class="card-valor">No hay servicios disponibles</div></div>
            </div>
        `;
  }

  const colTiempo = esSalida ? 'Sale en' : 'Llega en';

  return `
        <div class="arribos-grupo">
            <h3 class="arribos-subtitulo">${titulo}</h3>
            <table class="tabla-arribos">
                <thead>
                    <tr>
                        <th>Ramal</th>
                        <th>Hora</th>
                        <th>Andén</th>
                        <th>${colTiempo}</th>
                    </tr>
                </thead>
                <tbody>
                    ${arribos
                      .map((a) => {
                        const ramal = escapeHtml(
                          a.servicio.ramal.nombre.replace(
                            'Constitución-',
                            '',
                          ),
                        );
                        const horaProgramada = esSalida
                          ? a.arribo.salida &&
                            a.arribo.salida.programada
                          : a.arribo.llegada &&
                            a.arribo.llegada.programada;
                        const hora = convertirHoraISO(horaProgramada);
                        const anden = a.arribo.anden
                          ? escapeHtml(a.arribo.anden.nombre)
                          : '-';
                        const seg = a.arribo.segundos || 0;
                        const cancelado = a.servicio.cancelacion;
                        const claseTiempo =
                          seg <= 120
                            ? 'arribo-urgente'
                            : seg <= 300
                              ? 'arribo-proximo'
                              : '';

                        return `
                            <tr class="${cancelado ? 'arribo-cancelado' : claseTiempo}">
                                <td>${ramal}</td>
                                <td>${hora}</td>
                                <td>${anden}</td>
                                <td>${cancelado ? '❌ Cancelado' : formatearSegundos(seg)}</td>
                            </tr>
                        `;
                      })
                      .join('')}
                </tbody>
            </table>
        </div>
    `;
}

function filtrarArribos(datos, sentido) {
  const results = Array.isArray(datos.results) ? datos.results : [];
  return results
    .filter((a) => {
      if (!a || !a.servicio || !a.servicio.ramal) return false;
      const nombre = a.servicio.ramal.nombre;
      const matchRamal = RAMALES_FILTRADOS.includes(nombre);
      const matchSentido =
        sentido === undefined || a.servicio.sentido === sentido;
      return matchRamal && matchSentido;
    })
    .slice(0, 3);
}

async function cargarArribos(signal) {
  const contenedor = document.getElementById('arribos-container');
  try {
    const [resConst, resQuilmes] = await Promise.all([
      fetchConTimeout(API_TRENES_ARRIBOS_CONST, signal),
      fetchConTimeout(API_TRENES_ARRIBOS_QUILMES, signal),
    ]);

    const [datosConst, datosQuilmes] = await Promise.all([
      resConst.ok ? resConst.json() : { results: [] },
      resQuilmes.ok ? resQuilmes.json() : { results: [] },
    ]);

    const salidasConst = filtrarArribos(datosConst, 1);
    const llegadasQuilmes = filtrarArribos(datosQuilmes, 2);

    contenedor.innerHTML =
      renderTablaArribos(
        'Salidas desde Constitución',
        salidasConst,
        true,
      ) +
      renderTablaArribos(
        'Llegadas a Quilmes desde La Plata / Bosques',
        llegadasQuilmes,
        false,
      );
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error('Error arribos:', error);
    contenedor.innerHTML =
      '<div class="card card-error"><div class="card-titulo">Error</div><div class="card-valor">No se pudieron cargar los arribos</div></div>';
  }
}

function actualizarTimestamp() {
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-AR');
  const hora = ahora.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const timestamp = `${fecha} ${hora}`;
  document.getElementById('ultima-actualizacion').textContent =
    timestamp;
}

function actualizarConversor() {
  if (!document.getElementById('conv-tipo')) return;
  const tipo = document.getElementById('conv-tipo').value;
  const dirBtn = document.querySelector(
    '#conv-direccion .conv-btn.active',
  );
  const direccion = dirBtn ? dirBtn.dataset.direction : 'usd-ars';
  const montoInput = document.getElementById('conv-monto');
  const monto = parseFloat(montoInput.value);
  const resultadoEl = document.getElementById('conv-resultado');
  const tcEl = document.getElementById('conv-tc');

  const dolar = datosDolar.find((d) => d.casa === tipo);

  if (!dolar) {
    resultadoEl.textContent = '—';
    tcEl.textContent = 'Cargando...';
    return;
  }

  const esUsdAArs = direccion === 'usd-ars';
  const tasa = esUsdAArs ? dolar.compra : dolar.venta;
  const etiquetaTC = esUsdAArs ? 'Compra' : 'Venta';
  tcEl.textContent = `TC ${etiquetaTC}: ${formatearMoneda(tasa)}`;

  if (isNaN(monto) || monto <= 0) {
    resultadoEl.textContent = '—';
    return;
  }

  if (esUsdAArs) {
    resultadoEl.textContent = formatearMoneda(monto * tasa);
  } else {
    resultadoEl.textContent = formatearUSD(monto / tasa);
  }
}

const HERRAMIENTAS = [
  { id: 'calculadora', nombre: 'Calculadora %', icono: '%' },
  { id: 'conversor', nombre: 'Conversor Dólar', icono: '$' },
];

let toolboxAbierta = false;
let herramientaActiva = 'calculadora';

function toggleToolbox(abrir) {
  const abriendo = abrir !== undefined ? abrir : !toolboxAbierta;
  toolboxAbierta = abriendo;
  document
    .getElementById('toolbox')
    .classList.toggle('abierto', abriendo);
  document
    .getElementById('toolbox-overlay')
    .classList.toggle('abierto', abriendo);
  document.body.classList.toggle('toolbox-abierto', abriendo);
}

function generarMenuToolbox() {
  const menu = document.getElementById('toolbox-menu');
  menu.innerHTML = HERRAMIENTAS.map(
    (h, i) => `
    <button class="toolbox-menu-item${i === 0 ? ' active' : ''}" data-herramienta="${h.id}">
      <span class="toolbox-menu-icon">${h.icono}</span>
      ${h.nombre}
    </button>
  `,
  ).join('');
}

function seleccionarHerramienta(id) {
  herramientaActiva = id;
  document.querySelectorAll('.toolbox-menu-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.herramienta === id);
  });
  if (id === 'calculadora') renderizarCalculadora();
  if (id === 'conversor') renderizarConversor();
}

function renderizarCalculadora() {
  const container = document.getElementById('toolbox-content');
  container.innerHTML = `
    <div class="herramienta">
      <div class="herramienta-campo">
        <label for="calc-modo">Tipo de cálculo</label>
        <select id="calc-modo">
          <option value="porcentaje">¿X% de Y?</option>
          <option value="descuento">Descuento</option>
          <option value="aumento">Aumento</option>
        </select>
      </div>
      <div class="herramienta-campo" id="calc-campo1">
        <label for="calc-valor1" id="calc-label1">Porcentaje (%)</label>
        <input type="number" id="calc-valor1" placeholder="0" min="0" step="any">
      </div>
      <div class="herramienta-campo" id="calc-campo2">
        <label for="calc-valor2" id="calc-label2">Valor</label>
        <input type="number" id="calc-valor2" placeholder="0" min="0" step="any">
      </div>
      <div class="herramienta-divisor"></div>
      <div class="herramienta-resultado">
        <div class="herramienta-resultado-label">Resultado</div>
        <div class="herramienta-resultado-valor" id="calc-resultado">—</div>
        <div class="herramienta-resultado-detalle" id="calc-detalle"></div>
      </div>
    </div>
  `;
  document
    .getElementById('calc-modo')
    .addEventListener('change', actualizarCalculadora);
  document
    .getElementById('calc-valor1')
    .addEventListener('input', actualizarCalculadora);
  document
    .getElementById('calc-valor2')
    .addEventListener('input', actualizarCalculadora);
  actualizarCalculadora();
}

function actualizarCalculadora() {
  const modo = document.getElementById('calc-modo').value;
  const v1 = parseFloat(document.getElementById('calc-valor1').value);
  const v2 = parseFloat(document.getElementById('calc-valor2').value);
  const resultadoEl = document.getElementById('calc-resultado');
  const detalleEl = document.getElementById('calc-detalle');
  const label1 = document.getElementById('calc-label1');
  const label2 = document.getElementById('calc-label2');

  label1.textContent = 'Porcentaje (%)';

  switch (modo) {
    case 'porcentaje':
      label2.textContent = 'Valor';
      if (isNaN(v1) || isNaN(v2) || v1 < 0 || v2 < 0) {
        resultadoEl.textContent = '—';
        detalleEl.textContent = '';
        return;
      }
      resultadoEl.textContent = formatearNumero((v1 / 100) * v2);
      detalleEl.textContent = `${formatearNumero(v1)}% de ${formatearNumero(v2)}`;
      break;
    case 'descuento':
      label2.textContent = 'Precio original';
      if (isNaN(v1) || isNaN(v2) || v1 < 0 || v2 < 0) {
        resultadoEl.textContent = '—';
        detalleEl.textContent = '';
        return;
      }
      resultadoEl.textContent = formatearNumero(v2 * (1 - v1 / 100));
      detalleEl.textContent = `Ahorrás: ${formatearNumero(v2 * (v1 / 100))}`;
      break;
    case 'aumento':
      label2.textContent = 'Precio original';
      if (isNaN(v1) || isNaN(v2) || v1 < 0 || v2 < 0) {
        resultadoEl.textContent = '—';
        detalleEl.textContent = '';
        return;
      }
      resultadoEl.textContent = formatearNumero(v2 * (1 + v1 / 100));
      detalleEl.textContent = `Incremento: ${formatearNumero(v2 * (v1 / 100))}`;
      break;
  }
}

function renderizarConversor() {
  const container = document.getElementById('toolbox-content');
  container.innerHTML = `
    <div class="herramienta">
      <div class="conversor-fila">
        <div class="conversor-campo">
          <label for="conv-tipo">Tipo de dólar</label>
          <select id="conv-tipo">
            <option value="oficial">Dólar Oficial 🟢</option>
            <option value="blue">Dólar Blue 🔵</option>
            <option value="tarjeta">Dólar Tarjeta 💳</option>
          </select>
        </div>
        <div class="conversor-campo">
          <label>Dirección</label>
          <div class="conversor-direccion" id="conv-direccion">
            <button class="conv-btn active" data-direction="usd-ars">USD → ARS</button>
            <button class="conv-btn" data-direction="ars-usd">ARS → USD</button>
          </div>
        </div>
      </div>
      <div class="conversor-fila">
        <div class="conversor-campo">
          <label for="conv-monto">Monto</label>
          <input type="number" id="conv-monto" placeholder="Ingresá el monto" min="0" step="any">
        </div>
        <div class="conversor-campo">
          <label>Resultado</label>
          <div class="conversor-valor" id="conv-resultado">—</div>
          <div class="conversor-tc" id="conv-tc">Cargando...</div>
        </div>
      </div>
    </div>
  `;
  document
    .getElementById('conv-tipo')
    .addEventListener('change', actualizarConversor);
  document
    .getElementById('conv-monto')
    .addEventListener('input', actualizarConversor);
  document
    .getElementById('conv-direccion')
    .addEventListener('click', (e) => {
      const btn = e.target.closest('.conv-btn');
      if (!btn) return;
      document
        .querySelectorAll('#conv-direccion .conv-btn')
        .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      actualizarConversor();
    });
  actualizarConversor();
}

function cargarTemporal() {
  const contenedor = document.getElementById('temporal-cards');
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = ahora.getMonth();
  const diaMes = ahora.getDate();
  const inicioAnioUTC = Date.UTC(anio, 0, 1);
  const hoyUTC = Date.UTC(anio, mes, diaMes);
  const diaDelAnio = (hoyUTC - inicioAnioUTC) / 86400000 + 1;
  const totalDiasAnio =
    (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0
      ? 366
      : 365;
  const diasRestantesAnio = totalDiasAnio - diaDelAnio;
  const totalDiasMes = new Date(anio, mes + 1, 0).getDate();
  const diasRestantesMes = totalDiasMes - diaMes;

  const pctAnio = ((diaDelAnio - 1) / totalDiasAnio) * 100;
  const pctMes = ((diaMes - 1) / totalDiasMes) * 100;

  const diaSemana = new Date(anio, 0, 1).getDay();
  const diaSemanaOffset = diaSemana === 0 ? 6 : diaSemana - 1; // Monday = 0 (consistente con mini-calendario)
  const semanaActual =
    Math.floor((diaDelAnio - 1 + diaSemanaOffset) / 7) + 1;
  const totalSemanas = Math.ceil(
    (totalDiasAnio + diaSemanaOffset) / 7,
  );

  contenedor.innerHTML = `
    <div class="card">
      <div class="card-titulo">🗓️ Día</div>
      <div class="card-valor">Día ${diaDelAnio} de ${totalDiasAnio}</div>
      <div class="card-subvalor">${diasRestantesAnio} restantes (${(100 - pctAnio).toFixed(1)}%)</div>
    </div>
    <div class="card">
      <div class="card-titulo">📊 Semana</div>
      <div class="card-valor">Semana ${semanaActual} de ${totalSemanas}</div>
      <div class="card-subvalor">${totalSemanas - semanaActual} restantes (${(((totalSemanas - semanaActual) / totalSemanas) * 100).toFixed(1)}%)</div>
    </div>
    <div class="card">
      <div class="card-titulo">📆 Mes</div>
      <div class="card-valor">${MESES[mes]} - Día ${diaMes} de ${totalDiasMes}</div>
      <div class="barra-progreso">
        <div class="barra-fill" style="width: ${pctMes.toFixed(1)}%"></div>
      </div>
      <div class="card-subvalor">Progreso del mes: ${pctMes.toFixed(1)}%</div>
      <div class="card-subvalor">${diasRestantesMes} restantes</div>
    </div>
    <div class="card">
      <div class="card-titulo">🌎 Año</div>
      <div class="card-valor">${anio} - ${totalDiasAnio === 366 ? 'Bisiesto' : 'No bisiesto'}</div>
      <div class="barra-progreso">
        <div class="barra-fill" style="width: ${pctAnio.toFixed(1)}%"></div>
      </div>
      <div class="card-subvalor">Progreso del año: ${pctAnio.toFixed(1)}%</div>
    </div>
  `;
}

async function cargarFeriados(signal) {
  const contenedor = document.getElementById('feriados-cards');
  const anio = new Date().getFullYear();
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const eventosLocales = [
    ...calcularDiasFijos(anio),
    ...calcularDiasRelativos(anio),
  ];

  try {
    const respuesta = await fetchConTimeout(
      `${API_FERIADOS}${anio}`,
      signal,
    );
    if (!respuesta.ok) throw new Error('Error al obtener feriados');
    const feriadosApi = await respuesta.json();

    const feriadosNormalizados = feriadosApi.map((f) => ({
      fecha: new Date(f.fecha + 'T00:00:00'),
      nombre: f.nombre,
      tipo: f.tipo,
    }));

    const todos = [...feriadosNormalizados, ...eventosLocales]
      .filter((f) => f.fecha >= hoy)
      .sort((a, b) => a.fecha - b.fecha)
      .slice(0, 4);

    if (todos.length === 0) {
      contenedor.innerHTML =
        '<div class="card"><div class="card-titulo">Sin datos</div><div class="card-valor">No hay feriados próximos</div></div>';
      return;
    }

    contenedor.innerHTML = todos
      .map((f) => {
        const dia = String(f.fecha.getDate()).padStart(2, '0');
        const mes = MESES[f.fecha.getMonth()];
        return `
              <div class="card">
                  <div class="card-titulo">📅 ${dia} de ${mes}</div>
                  <div class="card-valor">${escapeHtml(f.nombre)}</div>
                  ${f.tipo !== 'evento' ? `<div class="card-subvalor">${escapeHtml(f.tipo.charAt(0).toUpperCase() + f.tipo.slice(1))}</div>` : ''}
              </div>
          `;
      })
      .join('');
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error('Error feriados:', error);
    contenedor.innerHTML =
      '<div class="card card-error"><div class="card-titulo">Error</div><div class="card-valor">No se pudieron cargar los feriados</div></div>';
  }
}

let abortController = null;

async function cargarTodos() {
  if (abortController) abortController.abort();
  abortController = new AbortController();
  const { signal } = abortController;

  try {
    await Promise.all([
      cargarFeriados(signal),
      cargarDolar(signal),
      cargarClima(signal),
      cargarTrenes(signal),
      cargarArribos(signal),
    ]);
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error en cargarTodos:', error);
    }
  }
  actualizarTimestamp();
}

function inicializarTicker() {
  const track = document.getElementById('ticker-track');
  const texto = document.getElementById('ticker-texto');
  const contenido = TICKER_FRASES.join(TICKER_SEPARADOR);
  texto.textContent = contenido + TICKER_SEPARADOR + contenido;
  const duracion = Math.max(25, contenido.length * 0.25);
  track.style.animationDuration = duracion + 's';
}

function renderizarMetaAhorro() {
  const datos = cargarDatosAhorro();
  const hoy = new Date();
  const hoyKey = fechaStr(hoy);

  const banner = document.getElementById('meta-banner');
  const icono = document.getElementById('meta-icono');
  const textoEl = document.getElementById('meta-texto');
  const btn = document.getElementById('meta-btn');

  let completada = !!datos.dias[hoyKey];
  let ultimoToggle = 0;
  const MIN_TOGGLE_INTERVAL = 1500;

  function obtenerMonto() {
    const el = document.getElementById('meta-monto');
    return el ? el.textContent : String(datos.monto);
  }

  function totalMes(anio, mes) {
    const prefix = mesStr(anio, mes);
    const count = Object.keys(datos.dias).filter(
      (k) => k.startsWith(prefix) && datos.dias[k],
    ).length;
    return count * datos.monto;
  }

  function renderMiniCalendar() {
    const anio = hoy.getFullYear();
    const mes = hoy.getMonth();
    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    const totalDias = ultimoDia.getDate();
    const startOffset =
      primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1;

    const headers = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
    const celdas = headers.map(
      (h) => '<div class="cal-header">' + h + '</div>',
    );

    for (let i = 0; i < startOffset; i++) {
      celdas.push('<div class="cal-dia cal-blank"></div>');
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const d = new Date(anio, mes, dia);
      const key = fechaStr(d);
      const c = !!datos.dias[key];
      const esHoy = key === hoyKey;
      const esFuturo = key > hoyKey;

      let clase = 'cal-dia';
      if (c) clase += ' cal-completado';
      if (esHoy && !c) clase += ' cal-hoy-pendiente';
      if (esHoy) clase += ' cal-hoy';
      if (esFuturo) clase += ' cal-futuro';

      celdas.push(
        '<button class="' +
          clase +
          '" data-date="' +
          key +
          '">' +
          dia +
          '</button>',
      );
    }

    return celdas.join('');
  }

  function actualizarEstado(completada) {
    const monto = obtenerMonto();
    const montoSpan = document.getElementById('meta-monto');

    if (completada) {
      banner.classList.remove('meta-pendiente');
      banner.classList.add('meta-completada');
      icono.textContent = '🤑';
      montoSpan.textContent = monto;
      textoEl.textContent = 'Hoy cumpliste la meta de ahorro';
      btn.textContent = '✗ Rectificar';
      btn.className = 'meta-btn meta-btn-rectificar';
    } else {
      banner.classList.remove('meta-completada');
      banner.classList.add('meta-pendiente');
      icono.textContent = '😢';
      montoSpan.textContent = monto;
      textoEl.textContent = 'Hoy no has cumplido la meta de ahorro';
      btn.textContent = '✓ Sí, ahorré';
      btn.className = 'meta-btn';
    }
  }

  function actualizarMeses() {
    const ahora = new Date();
    const mesActual = totalMes(ahora.getFullYear(), ahora.getMonth());
    const mesAnt = new Date(
      ahora.getFullYear(),
      ahora.getMonth() - 1,
      1,
    );
    const prevTotal = totalMes(
      mesAnt.getFullYear(),
      mesAnt.getMonth(),
    );

    document.getElementById('meta-meses').textContent =
      MESES[mesAnt.getMonth()] +
      ': ' +
      formatearUSD(prevTotal) +
      '  ·  ' +
      MESES[ahora.getMonth()] +
      ': ' +
      formatearUSD(mesActual);
  }

  const montoEl = document.getElementById('meta-monto');
  if (montoEl) montoEl.textContent = String(datos.monto);
  actualizarEstado(completada);
  actualizarMeses();

  btn.addEventListener('click', () => {
    const ahora = Date.now();
    if (ahora - ultimoToggle < MIN_TOGGLE_INTERVAL) return;
    ultimoToggle = ahora;

    completada = !completada;
    datos.dias[hoyKey] = completada;
    if (!completada) delete datos.dias[hoyKey];
    guardarDatosAhorro(datos);
    actualizarEstado(completada);
    actualizarMeses();
  });

  const popover = document.getElementById('cal-popover');
  const popoverCuerpo = document.getElementById('cal-popover-cuerpo');
  const popoverTitulo = document.getElementById('cal-popover-titulo');
  const overlay = document.getElementById('cal-overlay');
  const detallesBtn = document.getElementById('meta-detalles-btn');

  function abrirPopover() {
    const ahora = new Date();
    popoverTitulo.textContent =
      MESES[ahora.getMonth()] + ' ' + ahora.getFullYear();
    popoverCuerpo.innerHTML =
      '<div class="mini-calendar">' + renderMiniCalendar() + '</div>';
    popover.classList.add('abierto');
    overlay.classList.add('abierto');
  }

  function cerrarPopover() {
    popover.classList.remove('abierto');
    overlay.classList.remove('abierto');
  }

  detallesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (popover.classList.contains('abierto')) {
      cerrarPopover();
    } else {
      abrirPopover();
    }
  });

  document
    .getElementById('cal-popover-close')
    .addEventListener('click', cerrarPopover);

  overlay.addEventListener('click', cerrarPopover);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popover.classList.contains('abierto')) {
      cerrarPopover();
    }
  });

  popoverCuerpo.addEventListener('click', (e) => {
    const diaBtn = e.target.closest('.cal-dia');
    if (!diaBtn || diaBtn.classList.contains('cal-blank')) return;
    const dateKey = diaBtn.dataset.date;
    if (dateKey > hoyKey) return;
    const now = Date.now();
    if (now - ultimoToggle < MIN_TOGGLE_INTERVAL) return;
    ultimoToggle = now;

    datos.dias[dateKey] = !datos.dias[dateKey];
    if (!datos.dias[dateKey]) delete datos.dias[dateKey];
    guardarDatosAhorro(datos);

    if (dateKey === hoyKey) {
      completada = !!datos.dias[dateKey];
      actualizarEstado(completada);
    }
    actualizarMeses();
    // Mutar solo la celda cliqueada en vez de re-renderizar todo el calendario
    const toggledOn = !!datos.dias[dateKey];
    diaBtn.classList.toggle('cal-completado', toggledOn);
    diaBtn.classList.remove('cal-hoy-pendiente');
  });

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (
      target.id === 'meta-monto' ||
      target.classList.contains('meta-monto')
    ) {
      const el = document.getElementById('meta-monto');
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'meta-monto-input';
      input.value = el.textContent;
      input.min = 0;
      el.replaceWith(input);
      input.focus();
      input.addEventListener('blur', () => {
        const nuevoValor = input.value || '5';
        el.textContent = nuevoValor;
        datos.monto = parseInt(nuevoValor, 10) || 5;
        guardarDatosAhorro(datos);
        input.replaceWith(el);
        actualizarMeses();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') input.blur();
      });
    }
  });
}

function restaurarSecciones() {
  const raw = localStorage.getItem(STORAGE_KEY_SECCIONES);
  if (!raw) return;
  try {
    Object.entries(JSON.parse(raw)).forEach(([id, colapsada]) => {
      if (!colapsada) return;
      const seccion = document.getElementById(id);
      if (!seccion) return;
      seccion.classList.add('colapsada');
      const contenido = seccion.querySelector('.seccion-contenido');
      if (contenido) contenido.style.maxHeight = '0px';
      const boton = seccion.querySelector('.seccion-toggle');
      if (boton) boton.setAttribute('aria-expanded', 'false');
    });
  } catch {}
}

let intervaloReloj = null;
let intervaloDatos = null;

document.addEventListener('DOMContentLoaded', () => {
  actualizarReloj();
  intervaloReloj = setInterval(actualizarReloj, 1000);

  restaurarSecciones();

  document.querySelectorAll('.seccion-toggle').forEach((btn) => {
    const seccion = btn.closest('.seccion');
    const id = seccion.id;
    btn.addEventListener('click', () => toggleSeccion(id));
  });

  generarMenuToolbox();

  document
    .getElementById('toolbox-btn')
    .addEventListener('click', () => toggleToolbox(true));
  document
    .getElementById('toolbox-close')
    .addEventListener('click', () => toggleToolbox(false));
  document
    .getElementById('toolbox-overlay')
    .addEventListener('click', () => toggleToolbox(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toolboxAbierta) toggleToolbox(false);
  });

  document
    .getElementById('toolbox-menu')
    .addEventListener('click', (e) => {
      const item = e.target.closest('.toolbox-menu-item');
      if (!item) return;
      seleccionarHerramienta(item.dataset.herramienta);
    });

  seleccionarHerramienta('calculadora');

  inicializarTicker();
  renderizarMetaAhorro();
  cargarTemporal();
  cargarTodos();
  intervaloDatos = setInterval(cargarTodos, 5 * 60 * 1000);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(intervaloReloj);
      clearInterval(intervaloDatos);
    } else {
      actualizarReloj();
      cargarTodos();
      intervaloReloj = setInterval(actualizarReloj, 1000);
      intervaloDatos = setInterval(cargarTodos, 5 * 60 * 1000);
    }
  });
});

window.addEventListener('beforeunload', () => {
  if (intervaloReloj) clearInterval(intervaloReloj);
  if (intervaloDatos) clearInterval(intervaloDatos);
});
