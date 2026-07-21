// netlify/functions/get-upload-url.js
//
// Genera una URL firmada (presigned) de tipo PUT para que el navegador
// suba un archivo DIRECTO a Cloudflare R2 (sin pasar por este servidor),
// y también una URL firmada de tipo GET (de solo lectura, con expiración)
// para que ese archivo pueda compartirse por WhatsApp o incluirse en el
// email, sin necesidad de adjuntarlo.
//
// Requiere las siguientes variables de entorno configuradas en Netlify
// (Site settings > Environment variables), NUNCA en el código:
//   R2_ACCOUNT_ID
//   R2_ACCESS_KEY_ID
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET_NAME

const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

// R2 es compatible con la API de S3, por eso usamos el SDK de AWS
// apuntando al endpoint de Cloudflare en lugar de a AWS.
const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

// Tipos de archivo permitidos (fotos y documentos: DNI, licencia, pólizas, nómina).
const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
];

// Tiempo de validez de la URL de subida (el navegador tiene 5 minutos para usarla).
const UPLOAD_URL_EXPIRES_SECONDS = 60 * 5;

// Tiempo de validez de la URL de descarga que se comparte con el productor
// (7 días es suficiente para que revise la cotización y no deja el archivo
// navegable indefinidamente).
const DOWNLOAD_URL_EXPIRES_SECONDS = 60 * 60 * 24 * 7;

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido' }) };
    }

    let payload;
    try {
        payload = JSON.parse(event.body || '{}');
    } catch (err) {
        return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido' }) };
    }

    const { fileName, fileType } = payload;

    if (!fileName || !fileType) {
        return { statusCode: 400, body: JSON.stringify({ error: 'fileName y fileType son requeridos' }) };
    }

    if (!ALLOWED_TYPES.includes(fileType)) {
        return { statusCode: 400, body: JSON.stringify({ error: `Tipo de archivo no permitido: ${fileType}` }) };
    }

    try {
        // Nombre único para evitar colisiones y no exponer el nombre original del archivo del cliente.
        const extension = (fileName.split('.').pop() || 'bin').toLowerCase();
        const key = `adjuntos/${Date.now()}-${crypto.randomUUID()}.${extension}`;

        const putCommand = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
        });

        const uploadUrl = await getSignedUrl(s3, putCommand, { expiresIn: UPLOAD_URL_EXPIRES_SECONDS });

        const getCommand = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
        });

        const downloadUrl = await getSignedUrl(s3, getCommand, { expiresIn: DOWNLOAD_URL_EXPIRES_SECONDS });

        return {
            statusCode: 200,
            body: JSON.stringify({ uploadUrl, downloadUrl, key }),
        };
    } catch (err) {
        console.error('Error generando URLs firmadas de R2:', err);
        return { statusCode: 500, body: JSON.stringify({ error: 'Error interno generando la URL de subida' }) };
    }
};
