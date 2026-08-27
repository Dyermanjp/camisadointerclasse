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
  admin: document.querySelector('#adminTableWrap'),
  exportBtn: document.querySelector('#exportBtn'),
  submitBtn: document.querySelector('#submitBtn')
};

let records = {};
let claimedNumbers = {};

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

  els.admin.innerHTML = `
    <table>
      <thead><tr><th>Aluno</th><th>Camisa</th><th>Nº</th><th>Tam.</th><th>Status</th></tr></thead>
      <tbody>
        ${students.map(s => {
          const r = records[s.id];
          return `<tr>
            <td>${escapeHtml(s.name)}</td>
            <td>${r ? escapeHtml(r.shirtName) : '—'}</td>
            <td>${r ? escapeHtml(r.number) : escapeHtml(s.number || '—')}</td>
            <td>${r ? escapeHtml(r.size) : escapeHtml(s.size || '—')}</td>
            <td>${r ? '🔒 Enviado' : 'Pendente'}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function setMessage(text, isError = false) {
  els.message.textContent = text;
  els.message.classList.toggle('error', isError);
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
  const numberText = els.number.value.trim();
  const size = els.size.value;
  const number = numberText;

  if (!student) return setMessage('Selecione seu nome.', true);
  if (records[studentId]) return setMessage('Esse aluno já está cadastrado e bloqueado.', true);
  if (!/^(?:0|[1-9][0-9]{0,2})$/.test(number)) return setMessage('Escolha um número entre 0 e 999.', true);
  if (claimedNumbers[String(number)] && claimedNumbers[String(number)] !== studentId) {
    return setMessage(`O número ${number} já foi escolhido por outra pessoa.`, true);
  }

  const ok = confirm(`Confirmar?

Aluno: ${student.name}
Camisa: ${shirtName}
Número: ${number}
Tamanho: ${size}

Depois disso o cadastro ficará bloqueado.`);
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
    setMessage('Cadastro confirmado e bloqueado 🔒');
  } catch (error) {
    console.error(error);
    if (String(error.code || '').includes('PERMISSION_DENIED')) {
      setMessage('Não foi possível cadastrar. Esse aluno ou número pode ter sido usado agora por outra pessoa. Atualize a página e tente novamente.', true);
    } else {
      setMessage('Erro ao enviar. Verifique sua internet e tente novamente.', true);
    }
  } finally {
    els.submitBtn.disabled = false;
    els.submitBtn.textContent = 'Confirmar cadastro';
  }
});

db.ref('registrations').on('value', snapshot => {
  records = snapshot.val() || {};
  render();
}, error => {
  console.error(error);
  setMessage('Não foi possível carregar os cadastros do Firebase.', true);
});

db.ref('numbers').on('value', snapshot => {
  claimedNumbers = snapshot.val() || {};
});

els.exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'camisas-interclasse.json';
  a.click();
  URL.revokeObjectURL(url);
});

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
}

render();
