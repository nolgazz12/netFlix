export function makeImagePath(id: string, format?: string) {
    return `https://image.tmdb.org/t/p/${format ? format : 'original'}/${id}`;
}

// "homepage": "https://nolgazz12.github.io/netFlix/"
