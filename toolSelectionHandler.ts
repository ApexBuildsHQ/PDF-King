import { state } from '../state.js';
import { dom, switchView, toolTemplates } from '../ui.js';
import { setupFileInputHandler } from './fileHandler.js';
import { toolLogic } from '../logic/index.js';
import { createIcons, icons } from 'lucide';
import { t, translateDOM } from '../i18n.js';

const SETUP_AFTER_UPLOAD = ['sign-pdf', 'merge', 'alternate-merge', 'cropper', 'posterize', 'remove-blank-pages'];

export function setupToolInterface(toolId: any) {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior
    });
    
    state.activeTool = toolId;
    state.files = [];
    state.pdfDoc = null;
    
    if (typeof toolTemplates[toolId] === 'function') {
        dom.toolContent.innerHTML = toolTemplates[toolId]();
    } else {
        dom.toolContent.innerHTML = `
            <div class="text-center py-12">
                <h2 class="text-2xl font-bold mb-2">${t('tools.' + toolId + '.name')}</h2>
                <p class="text-gray-500 mb-6">${t('tools.' + toolId + '.subtitle')}</p>
            </div>
        `;
    }

    // Localize header & description in the loaded tool content
    const h2 = dom.toolContent.querySelector('h2');
    if (h2) {
        h2.textContent = t(`tools.${toolId}.name`);
    }

    const firstP = dom.toolContent.querySelector('p');
    if (firstP && !firstP.closest('#drop-zone')) {
        firstP.textContent = t(`tools.${toolId}.subtitle`);
    }

    // Update active tool title in bar
    const activeToolTitle = document.getElementById('active-tool-title');
    if (activeToolTitle) {
        activeToolTitle.textContent = t(`tools.${toolId}.name`);
    }

    // Localize process button text if defined
    const processBtn = dom.toolContent.querySelector<HTMLButtonElement>('#process-btn');
    if (processBtn) {
        const btnText = t(`tools.${toolId}.button`);
        if (btnText && btnText !== `tools.${toolId}.button`) {
            processBtn.textContent = btnText;
        }
    }

    // Translate any data-i18n attributes inside the tool interface
    translateDOM();
    createIcons({icons});
    switchView('tool');

    const fileInput = document.getElementById('file-input');

    if (!fileInput && processBtn) {
        const logic = toolLogic[toolId];
        if (logic) {
            const func = typeof logic.process === 'function' ? logic.process : logic;
            processBtn.onclick = func;
        }
    }

    if (!fileInput && toolLogic[toolId] && typeof toolLogic[toolId].setup === 'function') {
        toolLogic[toolId].setup();
    }

    if (fileInput) {
        // Guarantee all tool options, action panels, and buttons remain hidden until file upload
        const allButtons = dom.toolContent.querySelectorAll<HTMLButtonElement>('button:not(#add-file-btn):not(#clear-files-btn)');
        allButtons.forEach(btn => {
            btn.classList.add('hidden');
            btn.disabled = true;
        });

        const optionsContainers = dom.toolContent.querySelectorAll<HTMLElement>(
            '[id$="-options"], [id$="-preview"], [id$="-organizer"], [id$="-rotator"], [id$="-editor"], [id$="-results"], [id$="-form"], [id$="-half-options"], [id$="-ui-container"], [id$="-controls"], #signature-editor, #file-controls'
        );
        optionsContainers.forEach(el => el.classList.add('hidden'));

        // Guarantee all other non-header panels are hidden until a file is actually uploaded
        Array.from(dom.toolContent.children).forEach(child => {
            const el = child as HTMLElement;
            if (el.tagName !== 'H2' && el.id !== 'drop-zone' && el.id !== 'file-display-area' && !el.matches('p:first-of-type')) {
                el.classList.add('hidden');
            }
        });

        setupFileInputHandler(toolId);
    }
}
