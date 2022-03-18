import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { spawn } from 'child_process';


export function execute(ctx: BuilderContext, cwd: string, cmd: string) {
  const [command, ...args] = cmd.split(' ');
  return new Promise<BuilderOutput>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: cwd,
      stdio: "inherit", // keep color
      shell: true
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