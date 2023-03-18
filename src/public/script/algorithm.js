const $document = document;
const $chatbot = $document.querySelector('.chatbot');
const $chatbotHeader = $document.querySelector('.chatbot__header');

$chatbotHeader.addEventListener('click', () => {
    toggle($chatbot, 'chatbot--closed');
    $chatbotInput.focus();
}, false);

const toggle = (element, klass) => {
    const classes = element.className.match(/\S+/g) || [],
        index = classes.indexOf(klass);
    index >= 0 ? classes.splice(index, 1) : classes.push(klass);
    element.className = classes.join(' ');
};