import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

export async function runDockerCompose(filePath: string): Promise<string> {
    try {
        // Cambia a la ubicación del archivo y ejecuta docker-compose up
        const { stdout, stderr } = await execPromise(`docker-compose -f ${filePath} up -d`);

        // Filtra advertencias y mensajes no críticos
        const criticalErrors = stderr.split('\n').filter(line => {
            // Filtra los mensajes que contienen ciertas palabras clave de advertencia o progreso
            return !(line.includes('level=warning') || line.includes('Pulling') || line.includes('Downloading') || line.includes('Creating') || line.includes('Started') || line.includes('Already exists') || line.includes('Download complete') || line.includes('Network') || line.includes('Volume') || line.includes('Container'));
        }).join('\n');

        if (criticalErrors) {
            throw new Error(`Error: ${criticalErrors}`);
        }

        return stdout + '\n' + stderr;
    } catch (error) {
        throw new Error(`Failed to run docker-compose: ${error.message}`);
    }
}
