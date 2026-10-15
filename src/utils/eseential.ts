export const Essentials = {
    async copyToClipboard(text: string, callback?: (...args: any[]) => void) {
        try {
            await navigator.clipboard.writeText(text);
            callback?.();
        } catch (error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    },

    cloneObject(object: object) {
        return JSON.parse(JSON.stringify(object));
    },
}