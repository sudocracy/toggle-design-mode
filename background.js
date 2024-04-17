(function toggleDesignMode() {

    function run() {

        function log() {

            console.log('[TOGGLE-DESIGN-MODE]| document.designMode:', document.designMode);
            console.log('[TOGGLE-DESIGN-MODE]| document.body.style.caretColor:', document.body.style.caretColor);
        }

        function changeCaretColor(isDesignModeOn) {

            document.body.style.caretColor = isDesignModeOn ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)' 
        }

        function moveCaretToMiddle() {

            const selection = document.getSelection();
            const range = document.createRange();
            const middleVisibleElement = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);

            range.setStart(middleVisibleElement, 0);
            range.collapse(true);

            selection.removeAllRanges();
            selection.addRange(range);
        }

        function isDesignModeOn() {

            return document.designMode === 'on'
        }

        function toggleDesignMode() {

            document.designMode = document.designMode === 'on' ? 'off' : 'on';
        }

        function main() {

            log();

            toggleDesignMode();

            changeCaretColor(isDesignModeOn());

            isDesignModeOn() && moveCaretToMiddle();

            log();

            return isDesignModeOn();
        }

        return main();
    }

    function setup() {

        function log(message, isError = false) {

            const logger = isError ? console.error : console.log;

            logger(`[TOGGLE-DESIGN-MODE]| SETUP | ${message}`);
        }

        function triggerExecution() {

            browser.tabs.executeScript({ code: `(${run})()` })
                        .then(successHander)
                        .catch(errorHandler);
        }

        function successHander(results) {

            const isError = ! results.every((result) => result === true);
            const isDesignModeOn = !isError && results[0] !== undefined && results[0] === true;

            log(results, isError); 
            toggleIcon(isDesignModeOn);

        }

        function errorHandler(error) {

            log(error, true);
        }

        function toggleIcon(isDesignModeOn) {
                
            const correctIcon = isDesignModeOn ? 'on.png' : 'off.png';

            browser.browserAction.setIcon({ path: correctIcon })
                                 .then(log(`Icon set to ${correctIcon}`))
                                 .catch(log(`Unable to set icon to ${correctIcon}`));
            
        }

        log('BEGIN');

        browser.browserAction.onClicked.addListener(triggerExecution);
        browser.commands.onCommand.addListener(triggerExecution);

        log('END');
    }

    setup();

})();
