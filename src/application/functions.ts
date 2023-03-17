export function sort(sortDirection: string){
    return (sortDirection === 'desc') ? -1 : 1;
}

export function skipped(pageNumber: string, pageSize: string): number {
    return (+pageNumber - 1) * (+pageSize);
}