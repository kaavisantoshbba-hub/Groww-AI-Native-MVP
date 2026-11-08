import {spawn} from 'node:child_process';
const args=process.argv.slice(2);const index=args.indexOf('--port');const port=index>=0?args[index+1]:'3000';
const mode=args.includes('--production')?'start':'dev';
const child=spawn(process.execPath,['node_modules/next/dist/bin/next',mode,...(mode==='dev'?['--webpack']:[]),'--hostname','0.0.0.0','--port',port],{stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code||0));
