// --- MODAL FUNCTIONS ---
const showModal = (title, message, buttons) => {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').innerHTML = message;
    const buttonsContainer = document.getElementById('modal-buttons');
    buttonsContainer.innerHTML = '';
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.className = btn.class;
        button.onclick = () => { closeModal(); if (btn.action) btn.action(); };
        buttonsContainer.appendChild(button);
    });
    document.getElementById('custom-modal').classList.add('visible');
};

const closeModal = () => document.getElementById('custom-modal').classList.remove('visible');
const showAlert = (title, message) => showModal(title, message, [{ text: 'OK', class: 'bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800' }]);
const showConfirm = (title, message, onConfirm) => showModal(title, message, [
    { text: 'Cancel', class: 'bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300' },
    { text: 'Confirm', class: 'bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600', action: onConfirm }
]);
