document.addEventListener('DOMContentLoaded', () => {
    // 0. Configuración de APIs (WhatsApp y EmailJS)
    const waBase = "https://wa.me/5492616564707";
    
    // --- REEMPLAZA ESTOS 2 VALORES RESTANTES CON LOS DE TU CUENTA EMAILJS ---
    const EMAILJS_PUBLIC_KEY = "kOlsNlbfxU9QZD9Xh"; 
    const EMAILJS_SERVICE_ID = "service_jyurbyz"; // ID extraído de tu configuración
    const EMAILJS_TEMPLATE_ID = "template_doiuzfp";

    // Inicializar EmailJS
    if(typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    } else {
        console.error("No se pudo cargar la librería EmailJS. Revisa tu index.html.");
    }

    // 1. Navbar Móvil
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            });
        });
    }

    // 2. Lógica de Modales de Compañías (Info Real Actualizada)
    const companyData = {
        'federacion': { nombre: 'Federación Patronal', img: 'assets/img/federacion-patronal.png', desc: 'La aseguradora N°1 en situación financiera del país, ofreciendo solidez y una amplia gama de coberturas patrimoniales.', web: 'https://www.fedpat.com.ar', tel: '0810-222-5588' },
        'cooperacion': { nombre: 'Cooperación Seguros', img: 'assets/img/cooperacion-seguros.png', desc: 'Especialistas en seguros patrimoniales con una fuerte presencia y atención personalizada inigualable.', web: 'https://www.cooperacionseguros.com.ar', tel: '0800-777-7070' },
        'triunfo': { nombre: 'Triunfo Seguros', img: 'assets/img/triunfo-seguro.png', desc: 'Compañía destacada por sus precios competitivos y emisión digital inmediata en multiple riesgos.', web: 'https://www.triunfoseguros.com', tel: '0810-666-0302' },
        'rivadavia': { nombre: 'Seguros Rivadavia', img: 'assets/img/seguro-rivadavia.png', desc: 'Una de las aseguradoras con mayor respaldo y trayectoria del país, enfocada en la protección patrimonial integral.', web: 'https://www.segurosrivadavia.com', tel: '0800-666-6789' },
        'woranz': { nombre: 'Woranz', img: 'assets/img/woranz-seguros.png', desc: 'Líderes y especialistas indiscutidos en seguros de caución y garantías para alquiler u obras.', web: 'https://www.woranz.com', tel: '0810-333-9672' },
        'galicia': { nombre: 'Galicia Seguros', img: 'assets/img/galicia-seguros.png', desc: 'El respaldo de una entidad financiera de primer nivel aplicada a la protección de tus activos.', web: 'https://www.galiciaseguros.com.ar', tel: '0800-555-4254' },
        'mercantil': { nombre: 'Mercantil Andina', img: 'assets/img/mercantil-andina.png', desc: 'Casi 100 años de experiencia en el mercado argentino. Coberturas flexibles y adaptables a cada necesidad.', web: 'https://www.mercantilandina.com.ar', tel: '0800-888-4488' },
        'sancristobal': { nombre: 'San Cristóbal Retiro', img: 'assets/img/san-cristobal.png', desc: 'Expertos en planificación financiera a largo plazo y capitalización con rentabilidad garantizada.', web: 'https://www.sancristobal.com.ar', tel: '0810-222-8887' }
    };

    const modalCompany = document.getElementById('modalCompany');
    const contentCompany = document.getElementById('company-info-content');
    const closeCompany = document.getElementById('closeCompany');

    document.querySelectorAll('.logo-item').forEach(item => {
        item.addEventListener('click', () => {
            const code = item.getAttribute('data-company');
            const data = companyData[code];
            if (data) {
                contentCompany.innerHTML = `
                    <div class="company-header">
                        <img src="${data.img}" alt="${data.nombre}">
                        <h3>${data.nombre}</h3>
                    </div>
                    <p class="company-desc">${data.desc}</p>
                    <div class="company-contact">
                        <p><strong>🌐 Sitio Web:</strong> <a href="${data.web}" target="_blank">${data.web}</a></p>
                        <p><strong>📞 Atención al Cliente:</strong> <a href="tel:${data.tel.replace(/-/g,'')}">${data.tel}</a></p>
                    </div>
                `;
                modalCompany.style.display = 'flex';
            }
        });
    });

    if (closeCompany) closeCompany.addEventListener('click', () => modalCompany.style.display = 'none');

    // 3. Formularios Dinámicos Estrictos
    const modalCotizacion = document.getElementById('modalCotizacion');
    const dynamicFields = document.getElementById('dynamic-fields');
    const inputTipoSeguro = document.getElementById('inputTipoSeguro');
    
    // Bloque base reutilizable
    const baseFields = `
        <input type="text" name="nombre_y_apellido" placeholder="Nombre y Apellido completo" required>
        <input type="text" name="cuit_o_dni" placeholder="CUIT o DNI" required>
        <input type="email" name="correo_electronico" placeholder="Correo Electrónico" required>
        <input type="tel" name="telefono" placeholder="Teléfono / Celular" required>
        <div class="full-width" style="display:flex; align-items:center; gap:10px;">
            <label style="font-size:0.85rem; color:var(--text-muted); white-space:nowrap;">Fecha Nac:</label>
            <input type="date" name="fecha_nacimiento" required>
        </div>
        <input type="text" name="domicilio" placeholder="Domicilio completo" required>
        <input type="text" name="codigo_postal" placeholder="Código Postal" required>
    `;

    const pagoField = `
        <select name="forma_de_pago" class="full-width" required>
            <option value="" disabled selected>Seleccionar Forma de Pago</option>
            <option value="Cuponera">Cuponera</option>
            <option value="Tarjeta de Crédito / Débito">Tarjeta de Crédito / Débito</option>
        </select>
    `;

    const formSchemas = {
        'auto': baseFields + pagoField + `
            <select name="tiene_gnc" required>
                <option value="" disabled selected>¿Tiene GNC?</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
            </select>
            <input type="number" name="anio_vehiculo" placeholder="Año del Vehículo" required>
            <div class="full-width">
                <label style="font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:5px;">Subir Tarjeta Verde o Título (Opcional en Mail/Obligatorio en WA):</label>
                <input type="file" name="doc_vehiculo" accept="image/*,.pdf">
            </div>
            <div class="full-width">
                <label style="font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:5px;">Fotos del Vehículo (Opcional):</label>
                <input type="file" name="fotos_vehiculo" accept="image/*" multiple>
            </div>
        `,
        'moto': baseFields + pagoField + `
            <input type="number" name="anio_vehiculo" placeholder="Año del Vehículo" required>
            <div class="full-width">
                <label style="font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:5px;">Subir Tarjeta Verde o Título (Opcional en Mail/Obligatorio en WA):</label>
                <input type="file" name="doc_vehiculo" accept="image/*,.pdf">
            </div>
            <div class="full-width">
                <label style="font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:5px;">Fotos del Vehículo (Opcional):</label>
                <input type="file" name="fotos_vehiculo" accept="image/*" multiple>
            </div>
        `,
        'hogar': baseFields + `
            <select name="tipo_material" required>
                <option value="" disabled selected>Tipo de Construcción</option>
                <option value="Material">Material (Mampostería)</option>
                <option value="Mixta">Mixta / Madera</option>
            </select>
            <input type="number" name="metros_cuadrados" placeholder="Mts2 Cuadrados (Aprox)" required>
            <select name="condicion_ocupacion" required>
                <option value="" disabled selected>Condición de Ocupación</option>
                <option value="Propietario">Propietario</option>
                <option value="Inquilino (Alquiler)">Inquilino (Alquiler)</option>
            </select>
            <input type="text" name="domicilio_riesgo" placeholder="Domicilio exacto del lugar a asegurar" class="full-width" required>
        `,
        'caucion': baseFields + `
            <select name="tipo_caucion" class="full-width" required>
                <option value="" disabled selected>Tipo de Seguro de Caución</option>
                <option value="Alquiler">Garantía de Alquiler</option>
                <option value="Obra">Ejecución de Obra / Suministro</option>
            </select>
        `,
        'vida': baseFields + pagoField,
        'comercio': baseFields + `
            <input type="text" name="actividad_comercial" placeholder="Actividad o Rubro" required>
            <input type="number" name="metros_cuadrados" placeholder="Metros Cuadrados (Aprox)">
            <input type="text" name="domicilio_comercio" placeholder="Domicilio del Comercio" class="full-width" required>
        `,
        'bicicleta': baseFields + `
            <input type="text" name="ubicacion_riesgo" placeholder="Ubicación de Riesgo (Ciudad/Provincia)" class="full-width" required>
            <div class="full-width">
                <label style="font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:5px;">Foto de Factura de Compra (Opcional en Mail):</label>
                <input type="file" name="foto_factura" accept="image/*,.pdf">
            </div>
            <div class="full-width">
                <label style="font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:5px;">Fotos del Transporte (Opcional):</label>
                <input type="file" name="fotos_transporte" accept="image/*" multiple>
            </div>
        `,
        'art': `
            <input type="text" name="nombre_o_razon_social" placeholder="Nombre completo o Razón Social" class="full-width" required>
            <input type="text" name="cuit_empleador" placeholder="CUIT" required>
            <input type="text" name="actividad_desarrollada" placeholder="Actividad que desarrolla" required>
            <div class="full-width">
                <label style="font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:5px;">Archivo Nómina del Personal (Opcional en Mail):</label>
                <input type="file" name="nomina_personal" accept=".pdf,.xls,.xlsx,.csv">
            </div>
            <input type="email" name="correo_electronico" placeholder="Correo Electrónico" required>
            <input type="tel" name="telefono" placeholder="Teléfono" required>
        `,
        'viajero': `
            <input type="text" name="nombre_y_apellido" placeholder="Nombre y Apellido completo" required>
            <input type="text" name="cuit_o_dni" placeholder="CUIT o DNI" required>
            <input type="number" name="edad_pasajero" placeholder="Edad del Pasajero" required>
            <div style="display:flex; align-items:center; gap:10px;">
                <label style="font-size:0.8rem; color:var(--text-muted);">Nacimiento:</label>
                <input type="date" name="fecha_nacimiento" required>
            </div>
            <input type="text" name="domicilio" placeholder="Domicilio" required>
            <input type="email" name="correo_electronico" placeholder="Correo Electrónico" required>
            <input type="tel" name="telefono_contacto_tercero" placeholder="Tel. de Contacto (Tercero / Emergencia)" class="full-width" required>
            <input type="text" name="destino_viaje" placeholder="Destino del Viaje (País/Región)" class="full-width" required>
            <div style="display:flex; align-items:center; gap:10px;">
                <label style="font-size:0.8rem; color:var(--text-muted);">Partida:</label>
                <input type="date" name="fecha_partida" required>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <label style="font-size:0.8rem; color:var(--text-muted);">Regreso:</label>
                <input type="date" name="fecha_regreso" required>
            </div>
        `,
        'retiro': `
            <input type="text" name="nombre_y_apellido" placeholder="Nombre y Apellido" required>
            <input type="text" name="cuit_o_dni" placeholder="CUIT o DNI" required>
            <input type="email" name="correo_electronico" placeholder="Correo Electrónico" required>
            <input type="tel" name="telefono" placeholder="Teléfono" required>
            <div class="full-width" style="display:flex; align-items:center; gap:10px;">
                <label style="font-size:0.85rem; color:var(--text-muted); white-space:nowrap;">Fecha Nac:</label>
                <input type="date" name="fecha_nacimiento" required>
            </div>
            <input type="text" name="domicilio" placeholder="Domicilio" required>
            <input type="text" name="codigo_postal" placeholder="Código Postal" required>
        `,
        'praxis': `
            <input type="text" name="nombre_y_apellido" placeholder="Nombre y Apellido" required>
            <input type="text" name="cuit_o_dni" placeholder="CUIT o DNI" required>
            <input type="email" name="correo_electronico" placeholder="Correo Electrónico" required>
            <input type="tel" name="telefono" placeholder="Teléfono" required>
            <input type="text" name="profesion" placeholder="Profesión / Especialidad" class="full-width" required>
            <input type="text" name="nro_matricula" placeholder="Nro Matrícula" required>
            <input type="text" name="credencial_otorgada_por" placeholder="Credencial otorgada por" required>
            <div style="display:flex; align-items:center; gap:10px;">
                <label style="font-size:0.75rem; color:var(--text-muted);">Ejerce desde:</label>
                <input type="date" name="fecha_desde_ejerce" required>
            </div>
            <input type="number" name="anios_experiencia" placeholder="Años de Experiencia" required>
            <select name="jefe_de_equipo" class="full-width" required>
                <option value="" disabled selected>¿Es Jefe de Equipo Médico/Profesional?</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
            </select>
        `
    };

    document.querySelectorAll('.btn-cotizar').forEach(btn => {
        btn.addEventListener('click', () => {
            const seguro = btn.getAttribute('data-seguro');
            inputTipoSeguro.value = seguro.toUpperCase();
            dynamicFields.innerHTML = formSchemas[seguro] || `<input type="text" name="detalles_riesgo" placeholder="Describa el riesgo" class="full-width" required>`;
            modalCotizacion.style.display = 'flex';
        });
    });

    const closeCotizacion = document.getElementById('closeCotizacion');
    if (closeCotizacion) closeCotizacion.addEventListener('click', () => modalCotizacion.style.display = 'none');
    
    window.addEventListener('click', (e) => {
        if (e.target === modalCotizacion) modalCotizacion.style.display = 'none';
        if (e.target === modalCompany) modalCompany.style.display = 'none';
    });

    // 4. Interceptor de Envío y Procesamiento (EmailJS DUAL-FORMAT + WhatsApp)
    const form = document.getElementById('formCotizacion');
    const btnSubmit = document.getElementById('btnSubmit');
    const formStatus = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalFormData = new FormData(form);
            const metodoEnvio = originalFormData.get('metodo_envio'); 

            btnSubmit.textContent = 'Procesando...';
            btnSubmit.disabled = true;

            const tipoSeguro = originalFormData.get('tipo_seguro');

            // Separación de formatos: Uno para WhatsApp (Plano) y otro para Correo (HTML)
            let waText = `Cotización solicitada para seguro de *${tipoSeguro}*.\n\n--- DATOS DEL CLIENTE ---\n`;
            let emailHtmlRows = ``; 
            let hasFiles = false;

            for (let [key, value] of originalFormData.entries()) {
                if (key !== 'metodo_envio' && key !== 'tipo_seguro') {
                    
                    let cleanKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                    if (value instanceof File && value.size > 0) {
                        hasFiles = true;
                        // Formato WA
                        waText += `📎 *[Archivo Adjunto]* El usuario subió: ${cleanKey}\n`;
                        // Formato HTML Email
                        emailHtmlRows += `
                        <tr>
                            <td style="padding: 14px 15px; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: 600; width: 35%;">${cleanKey}</td>
                            <td style="padding: 14px 15px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">📎 <i>Archivo reservado para envío por WhatsApp</i></td>
                        </tr>`;
                    } else if (typeof value === 'string' && value.trim() !== '') {
                        // Formato WA
                        waText += `*${cleanKey}:* ${value}\n`;
                        // Formato HTML Email
                        emailHtmlRows += `
                        <tr>
                            <td style="padding: 14px 15px; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: 600; width: 35%;">${cleanKey}</td>
                            <td style="padding: 14px 15px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${value}</td>
                        </tr>`;
                    }
                }
            }

            if (metodoEnvio === 'whatsapp') {
                if (hasFiles) {
                    waText += `\n*(A continuación enviaré las fotos/documentos solicitados en el formulario)*`;
                }

                const waMessage = `Hola Ezequiel, ` + waText.replace('Cotización solicitada para', 'solicito cotización para');
                const encodedMsg = encodeURIComponent(waMessage);
                window.open(`${waBase}?text=${encodedMsg}`, '_blank');
                
                formStatus.textContent = '✅ Redirigiendo a WhatsApp... ¡Recordá enviar las fotos adjuntas en el chat!';
                formStatus.style.color = '#00F29D';
                resetFormState();
                
            } else {
                // Parámetros formateados para inyectar directamente en el template HTML de EmailJS
                const templateParams = {
                    tipo_seguro: tipoSeguro,
                    resumen_datos_html: emailHtmlRows,
                    correo_electronico: originalFormData.get('correo_electronico') // Aseguramos el mapeo para responder directo
                };

                try {
                    const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
                    
                    if (hasFiles) {
                        formStatus.textContent = '✅ Datos enviados al correo. Por favor, enviá las fotos por WhatsApp.';
                        formStatus.style.color = '#f59e0b';
                    } else {
                        formStatus.textContent = '✅ Cotización enviada correctamente a tu correo.';
                        formStatus.style.color = '#00F29D';
                    }
                    
                } catch (error) {
                    console.error("Error en EmailJS:", error);
                    formStatus.textContent = '❌ Ocurrió un error en el servidor. Intentá la opción WhatsApp.';
                    formStatus.style.color = '#ef4444';
                }
                resetFormState();
            }
        });
    }

    function resetFormState() {
        setTimeout(() => {
            modalCotizacion.style.display = 'none';
            form.reset();
            btnSubmit.textContent = 'Generar Cotización';
            btnSubmit.disabled = false;
            formStatus.textContent = '';
        }, 4000);
    }

    // 5. Chatbot Flotante (Nodos Estrictos de Consulta Broker)
    const chatTrigger = document.getElementById('chatbot-trigger');
    const chatWindow = document.getElementById('chatbot-window');
    const chatClose = document.getElementById('chatbot-close');
    const chatMessages = document.getElementById('chatbot-messages');
    let chatInitialized = false;

    // Plantilla armada para Siniestro directo a WA
    const siniestroTemplate = `Hola Ezequiel, quiero reportar un siniestro.
*MIS DATOS DEL HECHO*
Fecha del Siniestro: 
Hora: 
Lugar del hecho (Altura, Localidad, CP, Prov): 
¿Intervino policía/tránsito?: 
Relato del hecho: 
*(Adjuntaré fotos del siniestro, daños causados de mi vehículo, mi tarjeta verde y mi carnet de conducir)*

*DATOS DEL TERCERO*
Patente Tercero: 
Marca, Modelo y Año Vehículo Tercero: 
Compañía de Seguro Tercero: 
Daños causados al tercero: 
*(Adjuntaré foto carnet del tercero si tengo)*`;

    const chatTree = {
        inicio: {
            text: "¡Hola! 👋 Soy el asistente automatizado de <b>Ezequiel Baños</b>.<br>Seleccioná la gestión a realizar:",
            options: [
                { label: "💳 Consultar Pagos", next: "consultar_pagos" },
                { label: "🚨 Tuve un siniestro (Choque/Robo)", url: `${waBase}?text=${encodeURIComponent(siniestroTemplate)}` },
                { label: "📞 Pedir Auxilio / Grúa", next: "solicitar_grua" },
                { label: "📄 Documentación", next: "documentacion" }
            ]
        },
        consultar_pagos: {
            text: "Para verificar tus cuotas en sistema, derivamos la consulta al canal seguro.",
            options: [
                { label: "💬 Consultar por WhatsApp", url: `${waBase}?text=${encodeURIComponent("Hola Ezequiel, quiero verificar si estoy al día con los pagos de mis seguros.")}` },
                { label: "⬅️ Volver", next: "inicio" }
            ]
        },
        solicitar_grua: {
            text: "📲 <b>Descargá la app de tu compañía para gestionar tu documentación y servicios de forma rápida.</b><br><br>📞 <b>Teléfonos directos de Asistencia/Grúa:</b><br><br>• <b>Triunfo Seguros:</b> 0810-666-0302 | <a href='https://www.triunfoseguros.com' target='_blank'>Web</a> | Cel: 261 684-2503<br>• <b>Rivadavia Seguros:</b> 0800-666-6789 | <a href='https://www.segurosrivadavia.com' target='_blank'>Web</a> | Cel: 11 3986-1111<br>• <b>Fed. Patronal:</b> 0810-222-5588 | <a href='https://online.fedpat.com.ar/autogestion/ui#/login' target='_blank'>Web</a> | Cel: 221 4290-200<br>• <b>Cooperación:</b> 0800-777-7070 | <a href='https://www.cooperacionseguros.com.ar' target='_blank'>Web</a> | Cel: 3462 31-8900<br>• <b>Mercantil Andina:</b> 0800-888-4488 | <a href='https://www.mercantilandina.com.ar' target='_blank'>Web</a> | Cel: 11 4113-4488",
            options: [
                { label: "⬅️ Entendido, volver al menú", next: "inicio" }
            ]
        },
        documentacion: {
            text: "Para obtener copias de pólizas, credenciales o certificados:<br><br><b>Entra a la aplicación oficial de tu compañía aseguradora o descargala directamente desde tu casilla de email.</b>",
            options: [
                { label: "⬅️ Volver al menú", next: "inicio" }
            ]
        }
    };

    function renderMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = sender === 'bot' ? 'msg-bot' : 'msg-user';
        msg.innerHTML = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function renderOptions(options) {
        const container = document.createElement('div');
        container.className = 'chat-options-container';
        options.forEach(opt => {
            if (opt.url) {
                const anchor = document.createElement('a');
                anchor.className = 'chat-btn'; anchor.href = opt.url; anchor.target = '_blank'; anchor.innerHTML = opt.label;
                container.appendChild(anchor);
            } else {
                const btn = document.createElement('button');
                btn.className = 'chat-btn'; btn.textContent = opt.label;
                btn.onclick = () => {
                    container.remove(); renderMessage(opt.label, 'user');
                    setTimeout(() => loadNode(opt.next), 400);
                };
                container.appendChild(btn);
            }
        });
        chatMessages.appendChild(container);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function loadNode(key) {
        const node = chatTree[key];
        if (!node) return;
        renderMessage(node.text, 'bot');
        renderOptions(node.options);
    }

    if (chatTrigger) {
        chatTrigger.addEventListener('click', () => {
            chatWindow.classList.remove('hidden');
            if (!chatInitialized) {
                setTimeout(() => loadNode('inicio'), 300);
                chatInitialized = true;
            }
        });
    }
    if (chatClose) chatClose.addEventListener('click', () => chatWindow.classList.add('hidden'));
});