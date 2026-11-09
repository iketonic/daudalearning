import { concurrently } from "concurrently"

const { result } = concurrently([
    {
        command: 'npm run dev:web',
        name: 'web',
        prefixColor: 'bgBlue.bold',
    },
    {
        command: 'npm run dev:api',
        name: 'api',
        prefixColor: 'bgGreen.bold',
    },
], {
    killOthersOn: ['failure'],
});

result.then(
    () => console.log('All scripts completed'),
    () => process.exit(1),
);