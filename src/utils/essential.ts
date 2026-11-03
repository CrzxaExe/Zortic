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
}