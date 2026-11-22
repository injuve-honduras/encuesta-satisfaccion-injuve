
const API_URL = 'https://injuve-resultados-api.oipnunezhe.workers.dev/';
const dashboard = document.getElementById('dashboard');

function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[c]));
}

function render(data) {
    if (!data || !data.ok) {
        throw new Error('No se pudieron obtener los resultados.');
    }

    const total = Number(data.total || 0);

    let html = `
        <div class="results-grid">
            <div class="metric">
                <strong>${total.toLocaleString('es-HN')}</strong>
                <span>Encuestas recibidas</span>
            </div>
            <div class="metric">
                <strong>${data.updatedAt ? esc(data.updatedAt) : '—'}</strong>
                <span>Última actualización</span>
            </div>
        </div>
    `;

    if (!total) {
        html += `
            <div class="result-card">
                <p class="results-note">
                    Aún no se han registrado respuestas. Los resultados aparecerán aquí cuando se reciban las primeras encuestas.
                </p>
            </div>
        `;

        dashboard.innerHTML = html;
        return;
    }

    data.questions.forEach(q => {
        const sum = q.options.reduce(
            (a, o) => a + Number(o.count || 0), 0
        );

        html += `
            <section class="result-card">
                <h3>${esc(q.title)}</h3>
        `;

        q.options.forEach(o => {
            const count = Number(o.count || 0);
            const pct = sum ? Math.round(count / sum * 100) : 0;

            html += `
                <div class="result-row">
                    <div class="result-meta">
                        <span>${esc(o.label)}</span>
                        <strong>${count} · ${pct}%</strong>
                    </div>
                    <div class="bar">
                        <i style="width:${pct}%"></i>
                    </div>
                </div>
            `;
        });

        html += '</section>';
    });

    html += `
        <p class="results-note">
            Los porcentajes se calculan sobre las respuestas registradas para cada pregunta.
            En la pregunta 9 se permiten selecciones múltiples, por lo que el total de
            selecciones puede superar el número de encuestas.
        </p>
    `;

    dashboard.innerHTML = html;
}

async function load() {
    dashboard.innerHTML = '<p class="results-note">Cargando resultados...</p>';

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Error al consultar el servicio de resultados.');
        }

        const data = await response.json();
        render(data);

    } catch (e) {
        console.error('Error al cargar resultados:', e);

        dashboard.innerHTML = `
            <p class="error">
                No fue posible conectar con el servicio de resultados. Intente más tarde.
            </p>
        `;
    }
}

load();
