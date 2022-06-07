import { BuilderOutput } from '@angular-devkit/architect';
import { spawn } from 'child_process';

interface ExecContext {
  logger: {
    info(message: string): void;
    error(message: string): void;
  }
}

interface ExecConfig {
  env?: Record<string, string>;
  cwd: string;
}

export function execute(ctx: ExecContext, cmd: string, config: ExecConfig) {
  const [command, ...args] = cmd.split(' ');
  const { cwd, env = process.env } = config;
  return new Promise<BuilderOutput>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit", // keep color
      shell: true,
      cwd,
      env
    });

    child.stdout?.on('data', (data) => {
      ctx.logger.info(data.toString());
    });
    child.stderr?.on('data', (data) => {
      ctx.logger.error(data.toString());
      reject();
    });

    child.on('close', code => {
      resolve({ success: code === 0 });
    });
  });
}