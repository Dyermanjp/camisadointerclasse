const firebaseConfig = {
  apiKey: "AIzaSyD0xe_32Tv_bKUKIkbXJFPImMSYDoK2FJE",
  authDomain: "camisa-do-interclasse-74c6c.firebaseapp.com",
  databaseURL: "https://camisa-do-interclasse-74c6c-default-rtdb.firebaseio.com",
  projectId: "camisa-do-interclasse-74c6c",
  storageBucket: "camisa-do-interclasse-74c6c.firebasestorage.app",
  messagingSenderId: "758685018701",
  appId: "1:758685018701:web:6857d327dcf40e017b8a04"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// O público digita apenas "jp". O e-mail abaixo é usado internamente pelo Firebase Auth.
// Não coloque a sua senha neste arquivo.
const ADMIN_USERNAME = "jp";
const ADMIN_EMAIL = "jp-admin@camisainterclasse.local";

const students = [
  { id: "s01", name: "Alice Helena Ferreira Storch", number: "99", size: "M" },
  { id: "s02", name: "Antonia Sophia Mariano", number: "", size: "M" },
  { id: "s03", name: "Arthur Soares de Lima", number: "", size: "" },
  { id: "s04", name: "Clara Melina Gonçalves Silva", number: "", size: "P" },
  { id: "s05", name: "Daniel Santos Dias", number: "", size: "" },
  { id: "s06", name: "Davi Alves da Silva", number: "", size: "" },
  { id: "s07", name: "Dantas", number: "6", size: "M" },
  { id: "s08", name: "Fabricio Rocha Barros Oliveira", number: "", size: "" },
  { id: "s09", name: "F.Joshua", number: "9", size: "G" },
  { id: "s10", name: "Gabriel Silva de Oliveira", number: "", size: "G" },
  { id: "s11", name: "Gabriella Nascimento Cabral", number: "", size: "" },
  { id: "s12", name: "Gabrielly de Morais Alencar", number: "", size: "P" },
  { id: "s13", name: "Gabryella Alves da Silva", number: "", size: "P" },
  { id: "s14", name: "Guilherme Mendes da Silva", number: "", size: "" },
  { id: "s15", name: "Heloisa dos Santos Silva", number: "", size: "" },
  { id: "s16", name: "Ian Azevedo de Melo Graciano", number: "", size: "" },
  { id: "s17", name: "João Pedro Gomes Pedreira", number: "12", size: "G" },
  { id: "s18", name: "Jonas do Nascimento", number: "16", size: "P" },
  { id: "s19", name: "Laura Lima Santos", number: "", size: "" },
  { id: "s20", name: "Maria Clara de Souza Ferreira", number: "", size: "" },
  { id: "s21", name: "Maria Clara Moura Chagas Lobo", number: "", size: "" },
  { id: "s22", name: "Mateus Souza Galvão", number: "", size: "" },
  { id: "s23", name: "Murilo Oliveira Justino", number: "", size: "" },
  { id: "s24", name: "Raissa Gomes da Silva", number: "22", size: "G" },
  { id: "s26", name: "Sophia Morais Magnani", number: "", size: "" },
  { id: "s27", name: "Sophia Santos Lopes", number: "", size: "P" },
  { id: "s28", name: "Stella Morini Bernardo", number: "", size: "" },
  { id: "s29", name: "Thiago Gabriel Domingos Pereira", number: "", size: "" },
  { id: "s30", name: "Victor Henrique Lourenço Ferreira", number: "", size: "" },
  { id: "s31", name: "Vinícius Ramos Oliveira", number: "", size: "" }
];

const els = {
  form: document.querySelector('#shirtForm'),
  student: document.querySelector('#student'),
  shirtName: document.querySelector('#shirtName'),
  number: document.querySelector('#number'),
  size: document.querySelector('#size'),
  message: document.querySelector('#message'),
  list: document.querySelector('#submittedList'),
  counter: document.querySelector('#counter'),
  submitBtn: document.querySelector('#submitBtn'),

  adminFab: document.querySelector('#adminFab'),
  adminModal: document.querySelector('#adminModal'),
  adminLoginView: document.querySelector('#adminLoginView'),
  adminPanelView: document.querySelector('#adminPanelView'),
  adminEditView: document.querySelector('#adminEditView'),
  adminLoginForm: document.querySelector('#adminLoginForm'),
  adminUser: document.querySelector('#adminUser'),
  adminPassword: document.querySelector('#adminPassword'),
  adminLoginBtn: document.querySelector('#adminLoginBtn'),
  adminLoginMessage: document.querySelector('#adminLoginMessage'),
  adminLogoutBtn: document.querySelector('#adminLogoutBtn'),
  adminRows: document.querySelector('#adminRows'),
  adminSubmittedCount: document.querySelector('#adminSubmittedCount'),
  adminPendingCount: document.querySelector('#adminPendingCount'),
  adminBackBtn: document.querySelector('#adminBackBtn'),
  adminEditForm: document.querySelector('#adminEditForm'),
  adminEditStudentId: document.querySelector('#adminEditStudentId'),
  adminEditStudentName: document.querySelector('#adminEditStudentName'),
  adminEditShirtName: document.querySelector('#adminEditShirtName'),
  adminEditNumber: document.querySelector('#adminEditNumber'),
  adminEditSize: document.querySelector('#adminEditSize'),
  adminSaveBtn: document.querySelector('#adminSaveBtn'),
  adminEditMessage: document.querySelector('#adminEditMessage')
};

let records = {};
let claimedNumbers = {};
let isAdmin = false;

function populateStudents() {
  const current = els.student.value;
  els.student.innerHTML = '<option value="">Selecione seu nome</option>';

  students.forEach((student) => {
    const option = document.createElement('option');
    option.value = student.id;
    option.textContent = records[student.id] ? `🔒 ${student.name}` : student.name;
    option.disabled = Boolean(records[student.id]);
    els.student.appendChild(option);
  });

  if (current && !records[current]) els.student.value = current;
}

function render() {
  const values = Object.entries(records)
    .filter(([id]) => students.some(s => s.id === id))
    .map(([id, record]) => ({ id, ...record }))
    .sort((a, b) => a.student.localeCompare(b.student, 'pt-BR'));

  populateStudents();
  els.counter.textContent = `${values.length}/${students.length}`;

  els.list.innerHTML = values.length
    ? values.map(r => `
      <div class="person">
        <div>
          <strong>${escapeHtml(r.student)}</strong>
          <div class="meta">${escapeHtml(r.shirtName)} • Nº ${escapeHtml(r.number)} • ${escapeHtml(r.size)}</div>
        </div>
        <span class="lock">🔒</span>
      </div>`).join('')
    : '<p class="muted">Ninguém cadastrou ainda.</p>';

  renderAdminRows();
}

function renderAdminRows() {
  if (!els.adminRows) return;

  const submitted = students.filter(s => records[s.id]).length;
  els.adminSubmittedCount.textContent = submitted;
  els.adminPendingCount.textContent = students.length - submitted;

  els.adminRows.innerHTML = students.map(student => {
    const r = records[student.id];
    if (!r) {
      return `
        <div class="admin-row pending">
          <div class="admin-row-main">
            <strong>${escapeHtml(student.name)}</strong>
            <span>Pendente</span>
          </div>
        </div>`;
    }

    return `
      <div class="admin-row">
        <div class="admin-row-main">
          <strong>${escapeHtml(student.name)}</strong>
          <span>${escapeHtml(r.shirtName)} • Nº ${escapeHtml(r.number)} • ${escapeHtml(r.size)}</span>
        </div>
        <div class="admin-row-actions">
          <button type="button" class="secondary small" data-admin-edit="${student.id}">Editar</button>
          <button type="button" class="danger small" data-admin-unlock="${student.id}">Tirar cadeado</button>
        </div>
      </div>`;
  }).join('');
}

function setMessage(text, isError = false) {
  els.message.textContent = text;
  els.message.classList.toggle('error', isError);
}

function setAdminLoginMessage(text, isError = false) {
  els.adminLoginMessage.textContent = text;
  els.adminLoginMessage.classList.toggle('error', isError);
}

function setAdminEditMessage(text, isError = false) {
  els.adminEditMessage.textContent = text;
  els.adminEditMessage.classList.toggle('error', isError);
}

els.student.addEventListener('change', () => {
  const student = students.find(s => s.id === els.student.value);
  if (!student) {
    els.form.reset();
    return;
  }

  els.number.value = student.number || '';
  els.size.value = student.size || '';
  els.shirtName.value = student.name.split(' ')[0].replace('.', '').toUpperCase();
  setMessage('');
});

els.form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const studentId = els.student.value;
  const student = students.find(s => s.id === studentId);
  const shirtName = els.shirtName.value.trim().toUpperCase();
  const number = els.number.value.trim();
  const size = els.size.value;

  if (!student) return setMessage('Selecione seu nome.', true);
  if (records[studentId]) return setMessage('Esse aluno já está cadastrado e bloqueado.', true);
  if (!/^(?:0|[1-9][0-9]{0,2})$/.test(number)) return setMessage('Escolha um número entre 0 e 999.', true);
  if (claimedNumbers[number] && claimedNumbers[number] !== studentId) {
    return setMessage(`O número ${number} já foi escolhido por outra pessoa.`, true);
  }

  const ok = confirm(`Confirmar?\n\nAluno: ${student.name}\nCamisa: ${shirtName}\nNúmero: ${number}\nTamanho: ${size}\n\nDepois disso o cadastro ficará bloqueado.`);
  if (!ok) return;

  els.submitBtn.disabled = true;
  els.submitBtn.textContent = 'Enviando...';
  setMessage('');

  const record = {
    student: student.name,
    shirtName,
    number,
    size,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  };

  const updates = {};
  updates[`registrations/${studentId}`] = record;
  updates[`numbers/${number}`] = studentId;

  try {
    await db.ref().update(updates);
    els.form.reset();
    setMessage('Cadastro realizado com sucesso! 🔒');
  } catch (error) {
    console.error(error);
    setMessage('Não foi possível cadastrar. Esse aluno ou número pode ter sido usado agora por outra pessoa. Atualize a página e tente novamente.', true);
  } finally {
    els.submitBtn.disabled = false;
    els.submitBtn.textContent = 'Confirmar cadastro';
  }
});

// ---------- ADMIN ----------
function openAdminModal() {
  els.adminModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  showAdminView(isAdmin ? 'panel' : 'login');
  if (!isAdmin) setTimeout(() => els.adminUser.focus(), 50);
}

function closeAdminModal() {
  els.adminModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  setAdminLoginMessage('');
  setAdminEditMessage('');
}

function showAdminView(view) {
  els.adminLoginView.classList.toggle('hidden', view !== 'login');
  els.adminPanelView.classList.toggle('hidden', view !== 'panel');
  els.adminEditView.classList.toggle('hidden', view !== 'edit');
  if (view === 'panel') renderAdminRows();
}

els.adminFab.addEventListener('click', openAdminModal);
document.querySelectorAll('[data-close-admin]').forEach(el => el.addEventListener('click', closeAdminModal));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !els.adminModal.classList.contains('hidden')) closeAdminModal();
});

els.adminLoginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = els.adminUser.value.trim().toLowerCase();
  const password = els.adminPassword.value;

  if (username !== ADMIN_USERNAME) return setAdminLoginMessage('Usuário ou senha incorretos.', true);

  els.adminLoginBtn.disabled = true;
  els.adminLoginBtn.textContent = 'Entrando...';
  setAdminLoginMessage('');

  try {
    await auth.signInWithEmailAndPassword(ADMIN_EMAIL, password);
    els.adminPassword.value = '';
  } catch (error) {
    console.error(error);
    setAdminLoginMessage('Usuário ou senha incorretos.', true);
  } finally {
    els.adminLoginBtn.disabled = false;
    els.adminLoginBtn.textContent = 'Entrar';
  }
});

els.adminLogoutBtn.addEventListener('click', async () => {
  await auth.signOut();
  showAdminView('login');
});

els.adminRows.addEventListener('click', async (e) => {
  const editBtn = e.target.closest('[data-admin-edit]');
  const unlockBtn = e.target.closest('[data-admin-unlock]');

  if (editBtn) {
    const id = editBtn.dataset.adminEdit;
    const student = students.find(s => s.id === id);
    const record = records[id];
    if (!student || !record) return;

    els.adminEditStudentId.value = id;
    els.adminEditStudentName.textContent = student.name;
    els.adminEditShirtName.value = record.shirtName;
    els.adminEditNumber.value = record.number;
    els.adminEditSize.value = record.size;
    setAdminEditMessage('');
    showAdminView('edit');
  }

  if (unlockBtn) {
    const id = unlockBtn.dataset.adminUnlock;
    await unlockRegistration(id);
  }
});

els.adminBackBtn.addEventListener('click', () => showAdminView('panel'));

els.adminEditForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!isAdmin) return setAdminEditMessage('Sessão de administrador expirada.', true);

  const id = els.adminEditStudentId.value;
  const student = students.find(s => s.id === id);
  const oldRecord = records[id];
  if (!student || !oldRecord) return setAdminEditMessage('Cadastro não encontrado.', true);

  const shirtName = els.adminEditShirtName.value.trim().toUpperCase();
  const newNumber = els.adminEditNumber.value.trim();
  const size = els.adminEditSize.value;
  const oldNumber = String(oldRecord.number);

  if (!shirtName || shirtName.length > 18) return setAdminEditMessage('Confira o nome da camisa.', true);
  if (!/^(?:0|[1-9][0-9]{0,2})$/.test(newNumber)) return setAdminEditMessage('Número deve estar entre 0 e 999.', true);
  if (claimedNumbers[newNumber] && claimedNumbers[newNumber] !== id) {
    return setAdminEditMessage(`O número ${newNumber} já está sendo usado.`, true);
  }

  els.adminSaveBtn.disabled = true;
  els.adminSaveBtn.textContent = 'Salvando...';
  setAdminEditMessage('');

  const updatedRecord = {
    ...oldRecord,
    student: student.name,
    shirtName,
    number: newNumber,
    size,
    updatedAt: firebase.database.ServerValue.TIMESTAMP
  };

  const updates = {};
  updates[`registrations/${id}`] = updatedRecord;
  if (oldNumber !== newNumber) {
    updates[`numbers/${oldNumber}`] = null;
    updates[`numbers/${newNumber}`] = id;
  }

  try {
    await db.ref().update(updates);
    setAdminEditMessage('Alterações salvas. ✅');
    setTimeout(() => showAdminView('panel'), 550);
  } catch (error) {
    console.error(error);
    setAdminEditMessage('Não foi possível salvar. Confira as regras do Firebase.', true);
  } finally {
    els.adminSaveBtn.disabled = false;
    els.adminSaveBtn.textContent = 'Salvar alterações';
  }
});

async function unlockRegistration(id) {
  if (!isAdmin) return;
  const student = students.find(s => s.id === id);
  const record = records[id];
  if (!student || !record) return;

  const ok = confirm(`Tirar o cadeado de ${student.name}?\n\nO cadastro atual será apagado e o número ${record.number} ficará disponível novamente.`);
  if (!ok) return;

  const updates = {};
  updates[`registrations/${id}`] = null;
  updates[`numbers/${record.number}`] = null;

  try {
    await db.ref().update(updates);
  } catch (error) {
    console.error(error);
    alert('Não foi possível tirar o cadeado. Confira as regras do Firebase.');
  }
}

auth.onAuthStateChanged((user) => {
  isAdmin = Boolean(user && user.email === ADMIN_EMAIL);
  if (isAdmin) {
    if (!els.adminModal.classList.contains('hidden')) showAdminView('panel');
  } else if (!els.adminModal.classList.contains('hidden')) {
    showAdminView('login');
  }
});

// Firebase em tempo real
db.ref('registrations').on('value', (snapshot) => {
  records = snapshot.val() || {};
  render();
});

db.ref('numbers').on('value', (snapshot) => {
  claimedNumbers = snapshot.val() || {};
});

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

render();
