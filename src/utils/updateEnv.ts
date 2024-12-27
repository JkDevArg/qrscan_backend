import * as fs from 'fs';
import * as path from 'path';

export function updateEnvVariable(key: string, value: string) {
  const envFilePath = path.resolve(__dirname, '../../.env');
  let envConfig = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf-8') : '';

  if (envConfig.includes(`${key}=`)) {
    envConfig = envConfig.replace(new RegExp(`${key}=.*`, 'g'), `${key}=${value}`);
  } else {
    envConfig += `\n${key}=${value}`;
  }

  fs.writeFileSync(envFilePath, envConfig);
}