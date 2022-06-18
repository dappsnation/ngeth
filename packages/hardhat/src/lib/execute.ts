import { spawn } from 'child_process';

interface ExecConfig {
  env?: Record<string, string>;
  cwd: string;
}

export function execute(cmd: string, config: ExecConfig) {
  const [command, ...args] = cmd.split(' ');
  const { cwd, env = process.env } = config;
  return new Promise<{ success: boolean }>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit", // keep color
      shell: true,
      cwd,
      env
    });

    child.stdout?.on('data', (data) => {
      console.info(data.toString());
    });
    child.stderr?.on('data', (data) => {
      console.error(data.toString());
      reject();
    });

    child.on('close', code => {
      resolve({ success: code === 0 });
    });
  });
}