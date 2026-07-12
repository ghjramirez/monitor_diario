const API_DOLAR = 'https://dolarapi.com/v1/dolares';
const API_CLIMA_CABA = 'https://wttr.in/Buenos+Aires?format=j1';
const API_CLIMA_QUILMES = 'https://wttr.in/Quilmes?format=j1';
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

function actualizarReloj() {
  const ahora = new Date();
  const dia = DIAS[ahora.getDay()];
  const numero = ahora.getDate();
  const mes = MESES[ahora.getMonth()];
  const anio = ahora.getFullYear();
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const segundos = String(ahora.getSeconds()).padStart(2, '0');

  document.getElementById('reloj').textContent =
    `${dia} ${numero} de ${mes} ${anio} - ${horas}:${minutos}:${segundos}`;
}

function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(valor);
}

async function cargarDolar() {
  const contenedor = document.getElementById('dolar-cards');
  try {
    const respuesta = await fetch(API_DOLAR);
    if (!respuesta.ok)
      throw new Error('Error al obtener cotizaciones');
    const datos = await respuesta.json();

    const tiposRelevantes = ['oficial', 'blue', 'bolsa', 'tarjeta'];
    const nombres = {
      oficial: 'Dólar Oficial',
      blue: 'Dólar Blue',
      bolsa: 'Dólar MEP',
      tarjeta: 'Dólar Tarjeta',
    };

    const filtrados = datos.filter((d) =>
      tiposRelevantes.includes(d.casa),
    );

    if (filtrados.length === 0) {
      contenedor.innerHTML =
        '<div class="card error"><div class="card-titulo">Sin datos</div><div class="card-valor">No hay cotizaciones disponibles</div></div>';
      return;
    }

    contenedor.innerHTML = filtrados
      .map(
        (d) => `
            <div class="card">
                <div class="card-titulo">${nombres[d.casa] || d.nombre}</div>
                <div class="card-valor">${formatearMoneda(d.venta)}</div>
                <div class="card-subvalor">Compra: ${formatearMoneda(d.compra)}</div>
            </div>
        `,
      )
      .join('');
  } catch (error) {
    console.error('Error dólar:', error);
    contenedor.innerHTML =
      '<div class="card error"><div class="card-titulo">Error</div><div class="card-valor">No se pudieron cargar los datos</div></div>';
  }
}

async function cargarClima() {
  const contenedor = document.getElementById('clima-cards');

  const weatherMap = {
    113: '☀️ Soleado',
    116: '⛅ Parcial nublado',
    119: '☁️ Nublado',
    122: '☁️ Muy nublado',
    143: '🌫️ Niebla',
    176: '🌦️ Lluvia ligera',
    200: '⛈️ Tormenta',
    293: '🌦️ Lluvia ligera',
    296: '🌧️ Lluvia',
    299: '🌧️ Lluvia intensa',
    302: '🌧️ Lluvia fuerte',
    305: '🌧️ Lluvia muy fuerte',
    308: '🌧️ Lluvia extrema',
    311: '🌧️ Lluvia ligera',
    314: '🌧️ Lluvia',
    320: '🌨️ Nieve ligera',
    323: '🌨️ Nieve',
    329: '❄️ Nieve',
    332: '❄️ Nieve intensa',
    356: '🌧️ Chubasco fuerte',
    359: '🌧️ Tormenta',
    386: '⛈️ Tormenta',
    389: '⛈️ Tormenta fuerte',
  };

  function renderClima(nombre, datos) {
    const actual = datos.current_condition[0];
    const hoy = datos.weather[0];
    const codigo = actual.weatherCode;
    const desc =
      weatherMap[codigo] || '🌡️ ' + actual.weatherDesc[0].value;

    return `
            <div class="clima-grupo">
                <h3 class="clima-titulo">${nombre}</h3>
                <div class="cards">
                    <div class="card">
                        <div class="card-titulo">Temperatura</div>
                        <div class="card-valor">${actual.temp_C}°C</div>
                        <div class="card-subvalor">Sensación: ${actual.FeelsLikeC}°C</div>
                    </div>
                    <div class="card">
                        <div class="card-titulo">Condición</div>
                        <div class="card-valor">${desc}</div>
                    </div>
                    <div class="card">
                        <div class="card-titulo">Máx / Mín</div>
                        <div class="card-valor">${hoy.maxtempC}° / ${hoy.mintempC}°</div>
                    </div>
                    <div class="card">
                        <div class="card-titulo">Humedad</div>
                        <div class="card-valor">${actual.humidity}%</div>
                    </div>
                    <div class="card">
                        <div class="card-titulo">Viento</div>
                        <div class="card-valor">${actual.windspeedKmph} km/h</div>
                        <div class="card-subvalor">${actual.winddir16Point}</div>
                    </div>
                </div>
            </div>
        `;
  }

  try {
    const [resCaba, resQuilmes] = await Promise.all([
      fetch(API_CLIMA_CABA),
      fetch(API_CLIMA_QUILMES),
    ]);

    if (!resCaba.ok || !resQuilmes.ok)
      throw new Error('Error al obtener clima');

    const datosCaba = await resCaba.json();
    const datosQuilmes = await resQuilmes.json();

    contenedor.innerHTML =
      renderClima('CABA', datosCaba) +
      renderClima('Quilmes', datosQuilmes);
  } catch (error) {
    console.error('Error clima:', error);
    contenedor.innerHTML =
      '<div class="card error"><div class="card-titulo">Error</div><div class="card-valor">No se pudieron cargar los datos</div></div>';
  }
}

async function cargarTrenes() {
  const contenedorCards = document.getElementById('trenes-cards');
  const contenedorAlertas = document.getElementById('trenes-alertas');

  try {
    const respuesta = await fetch(API_TRENES_RAMALES);
    if (!respuesta.ok)
      throw new Error('Error al obtener datos de trenes');
    const ramales = await respuesta.json();

    const ramalesFiltrados = ramales.filter(
      (r) =>
        r.nombre === 'Constitución-Bosques-Q' ||
        r.nombre === 'Constitución-La Plata',
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
                    <div class="card-titulo">${ramal.nombre}</div>
                    <div class="card-valor">${textoEstado}</div>
                    <div class="card-subvalor">${ramal.es_electrico ? '⚡ Eléctrico' : '🚂 Diésel'}</div>
                    ${tieneAlertas ? '<div class="card-subvalor" style="color: var(--warning)">⚠️ ' + ramal.alerta.length + ' alerta(s)</div>' : ''}
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
                <h3 style="margin-bottom: 0.5rem; color: var(--warning);">Alertas Activas</h3>
                ${alertasActivas
                  .map(
                    (alerta) => `
                    <div class="alerta">
                        <strong>${alerta.ramal}:</strong> ${alerta.contenido}
                    </div>
                `,
                  )
                  .join('')}
            `;
    } else {
      contenedorAlertas.innerHTML = '';
    }
  } catch (error) {
    console.error('Error trenes:', error);
    contenedorCards.innerHTML =
      '<div class="card error"><div class="card-titulo">Error</div><div class="card-valor">No se pudieron cargar los datos</div></div>';
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
  return (
    String(d.getHours()).padStart(2, '0') +
    ':' +
    String(d.getMinutes()).padStart(2, '0')
  );
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
                        <th>Tipo</th>
                        <th>${colTiempo}</th>
                    </tr>
                </thead>
                <tbody>
                    ${arribos
                      .map((a) => {
                        const ramal = a.servicio.ramal.nombre.replace(
                          'Constitución-',
                          '',
                        );
                        const horaProgramada = esSalida
                          ? a.arribo.salida &&
                            a.arribo.salida.programada
                          : a.arribo.llegada &&
                            a.arribo.llegada.programada;
                        const hora = convertirHoraISO(horaProgramada);
                        const anden = a.arribo.anden
                          ? a.arribo.anden.nombre
                          : '-';
                        const tipo = a.servicio.tipo
                          ? a.servicio.tipo.nombre
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
                                <td>${tipo}</td>
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

function filtrarArribos(datos) {
  return (datos.results || [])
    .filter((a) => {
      const nombre =
        a.servicio && a.servicio.ramal && a.servicio.ramal.nombre;
      return RAMALES_FILTRADOS.includes(nombre);
    })
    .slice(0, 10);
}

async function cargarArribos() {
  const contenedor = document.getElementById('arribos-container');
  try {
    const [resConst, resQuilmes] = await Promise.all([
      fetch(API_TRENES_ARRIBOS_CONST),
      fetch(API_TRENES_ARRIBOS_QUILMES),
    ]);

    if (!resConst.ok || !resQuilmes.ok)
      throw new Error('Error al obtener arribos');

    const datosConst = await resConst.json();
    const datosQuilmes = await resQuilmes.json();

    const salidasConst = filtrarArribos(datosConst);
    const llegadasQuilmes = filtrarArribos(datosQuilmes);

    contenedor.innerHTML =
      renderTablaArribos(
        'Salidas desde Constitución',
        salidasConst,
        true,
      ) +
      renderTablaArribos(
        'Llegadas a Quilmes',
        llegadasQuilmes,
        false,
      );
  } catch (error) {
    console.error('Error arribos:', error);
    contenedor.innerHTML =
      '<div class="card error"><div class="card-titulo">Error</div><div class="card-valor">No se pudieron cargar los arribos</div></div>';
  }
}

function actualizarTimestamp() {
  const ahora = new Date();
  const timestamp = ahora.toLocaleString('es-AR');
  document.getElementById('ultima-actualizacion').textContent =
    timestamp;
}

async function cargarTodos() {
  await Promise.all([
    cargarDolar(),
    cargarClima(),
    cargarTrenes(),
    cargarArribos(),
  ]);
  actualizarTimestamp();
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarReloj();
  setInterval(actualizarReloj, 1000);

  cargarTodos();

  setInterval(cargarTodos, 5 * 60 * 1000);
});
