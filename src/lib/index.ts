// place files you want to import through the `$lib` alias in this folder.
import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://pocketbase-link-bucket.fly.dev/');
pb.autoCancellation(false);
