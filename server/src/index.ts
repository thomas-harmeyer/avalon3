import fs from 'fs';
import path from 'path';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('server started');

wss.on('connection', (ws) => {
    console.log('open');
    insert('log', 'o:' + new Date().toLocaleTimeString() + '\n'); 

    ws.on('close', () => {
        console.log('closed');
        insert('log', 'c:' + new Date().toLocaleTimeString() + '\n');
    });


    ws.on('create', ({ name }: { name: string }) => {
        const id = getNextGameId();

        insert(id, JSON.stringify({ name }));
    });

    ws.on('join', ({ lobby, name }: { lobby: string; name: string }) => {
        insert(lobby, JSON.stringify({ name }));
    });

    ws.on('suggest', (data) => {
        console.log('suggestion', data);
    });

    ws.send('lobby');
});

function getNextGameId(): number {
    const ids = getGameIds();
    let last = -1;
    for (const id of ids) {
        if (last + 1 !== id) {
            return last + 1;
        }
        last = id;
    }
    return last + 1;
}

//guarenteed to be sorted
function getGameIds(): number[] {
    const files = fs.readdirSync('src/db');
    return files.map((file) => parseInt(file)).sort();
}

function insert(base: number | string, data: string) {
    const filePath = `src/db/${base}.txt`;
    const fullPath = path.resolve(filePath);
    fs.appendFileSync(fullPath, data);
}
