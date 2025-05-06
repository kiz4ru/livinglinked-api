import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';



const app = express();
app.use(cors({
  origin: 'https://livinglinked.es'
}));

app.use(bodyParser.json());

// Ruta para manejar el envío de correos
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El correo es obligatorio.' });
  }

  const filePath = './data/emails.json';

  // Leer el archivo JSON existente
  fs.readFile(filePath, 'utf8', (err, data) => {
    let emails = [];
    if (!err && data) {
      emails = JSON.parse(data);
    }

    // Verificar si el correo ya está registrado
    if (emails.includes(email)) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    // Agregar el nuevo correo
    emails.push(email);

    // Guardar el archivo actualizado
    fs.writeFile(filePath, JSON.stringify(emails, null, 2), (err) => {
      if (err) {
        console.error('Error al guardar el correo:', err);
        return res.status(500).json({ message: 'Error al guardar el correo.' });
      }

      res.status(200).json({ message: 'Correo registrado correctamente.', count: emails.length });
    });
  });
});

// Ruta para obtener el contador actual
app.get('/api/counter', (req, res) => {
  const filePath = './data/emails.json';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer el contador.' });
    }

    const emails = JSON.parse(data || '[]');
    res.status(200).json({ count: emails.length });
  });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});