/**
 * Essential Utility
 */
export const Essentials = {

    /**
     * Copy selected text into user clipboard
     * @param text text to copy
     * @param callback function to be run after copy was success
     */
    async copyToClipboard(text: string, callback?: (...args: any[]) => void) {
        try {
            await navigator.clipboard.writeText(text);
            callback?.();
        } catch (error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    },

    /**
     * Deep clone object
     * @param object
     * @returns Cloned object
     */
    cloneObject(object: object) {
        return JSON.parse(JSON.stringify(object));
    },

    /**
     * Generate random string
     * @param length lenght of generated ID, default 12
     * @returns ID
     */
    generateID(length: number = 12): string {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        let result = '';
        for(let i = 0; i< length; i++) result += chars[Math.floor(Math.random() * chars.length)];

        return result;
    }
}