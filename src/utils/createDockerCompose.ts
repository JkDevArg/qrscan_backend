import * as fs from 'fs';

export async function createDockerCompose(folder: string, getDocker: string) {
  // Reemplazar todas las barras inclinadas por guiones
  const sanitizedFolder = folder.replace(/\//g, '-');
  const filePath = `./${sanitizedFolder}/docker-compose.yml`;

  // Limpiar el contenido de getDocker
  const cleanedDockerContent = getDocker
    .replace(/^```yaml\s*/, '')
    .replace(/\s*```$/, '');

  // Crear el directorio si no existe
  fs.mkdirSync(`./${sanitizedFolder}`, { recursive: true });

  // Crear y escribir en el archivo docker-compose.yml
  fs.writeFileSync(filePath, cleanedDockerContent);

  return filePath;
}
