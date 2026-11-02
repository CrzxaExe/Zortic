export const Formater = {
    
    /**
     * Text formater
     */
    text: {

        /**
         * Capitalize the text or paragraph
         * @param text paragraph
         * @param firstSentence if true, only first letter on sentences will be capitalize, else first each word will be capitalize (default = false)
         * @returns capitalized text
        */
       capitalize(text: string, firstSentence: boolean = false): string {
           const result = text
           .split(firstSentence ? "." : " ")
           .map(e => e.charAt(0).toUpperCase() + e.slice(1))
           .join(firstSentence ? ". " : " ");
           
           return result;
        },

        /**
         * Replace text
         * @param text messy text
         * @param regex search value
         * @param replacer replacement text (default = '')
         * @returns 
         */
        cleanChar(text: string, regex: RegExp, replacer: string = ''): string {
            return text.replace(regex, replacer);
        }
    },

    /**
     * Number Formater
     */
    number: {

        /**
         * Convert number into prices
         * @param value price
         * @param options Currency options
         * @returns price formated
         */
        intoPrices(value: number, options: CurrencyOptions = {currency: ""}): string {
            let result = `${value.toFixed(options.decimal ?? 0)}`;

            switch(options.currencyPosition) {
                case "back":
                    result += options.currency;
                    break;

                case "front":
                    result = options.currency + result;
                    break;
            }

            return result;
        }
    },
}
