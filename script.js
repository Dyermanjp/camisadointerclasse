const students = [
  { name: 'Alice Helena Ferreira Storch', number: '99', size: 'M' },
  { name: 'Antonia Sophia Mariano', number: '', size: 'M' },
  { name: 'Arthur Soares de Lima', number: '', size: '' },
  { name: 'Clara Melina Gonçalves Silva', number: '', size: 'P' },
  { name: 'Daniel Santos Dias', number: '', size: '' },
  { name: 'Davi Alves da Silva', number: '', size: '' },
  { name: 'Dantas', number: '6', size: 'M' },
  { name: 'Fabricio Rocha Barros Oliveira', number: '', size: '' },
  { name: 'F.Joshua', number: '9', size: 'G' },
  { name: 'Gabriel Silva de Oliveira', number: '', size: 'G' },
  { name: 'Gabriella Nascimento Cabral', number: '', size: '' },
  { name: 'Gabrielly de Morais Alencar', number: '', size: 'P' },
  { name: 'Gabryella Alves da Silva', number: '', size: 'P' },
  { name: 'Guilherme Mendes da Silva', number: '', size: '' },
  { name: 'Heloisa dos Santos Silva', number: '', size: '' },
  { name: 'Ian Azevedo de Melo Graciano', number: '', size: '' },
  { name: 'João Pedro Gomes Pedreira', number: '12', size: 'G' },
  { name: 'Jonas do Nascimento', number: '16', size: 'P' },
  { name: 'Laura Lima Santos', number: '', size: '' },
  { name: 'Maria Clara de Souza Ferreira', number: '', size: '' },
  { name: 'Maria Clara Moura Chagas Lobo', number: '', size: '' },
  { name: 'Mateus Souza Galvão', number: '', size: '' },
  { name: 'Murilo Oliveira Justino', number: '', size: '' },
  { name: 'Raissa Gomes da Silva', number: '22', size: 'G' },
  { name: 'Sofia Neves Mina', number: '', size: '' },
  { name: 'Sophia Morais Magnani', number: '', size: '' },
  { name: 'Sophia Santos Lopes', number: '', size: 'P' },
  { name: 'Stella Morini Bernardo', number: '', size: '' },
  { name: 'Thiago Gabriel Domingos Pereira', number: '', size: '' },
  { name: 'Victor Henrique Lourenço Ferreira', number: '', size: '' },
  { name: 'Vinícius Ramos Oliveira', number: '', size: '' }
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
  resetBtn: document.querySelector('#resetBtn')
};

function getRecords() {
  return JSON.parse(localStorage.getItem('interclasseRecords') || '{}');
}

function saveRecords(records) {
  localStorage.setItem('interclasseRecords', JSON.stringify(records));
}

function populateStudents() {
  const records = getRecords();
  els.student.innerHTML = '<option value="">Selecione seu nome</option>';
  students.forEach((student) => {
    const option = document.createElement('option');
    option.value = student.name;
    option.textContent = records[student.name] ? `🔒 ${student.name}` : student.name;
    option.disabled = Boolean(records[student.name]);
    els.student.appendChild(option);
  });
}

function usedNumbers(exceptName = '') {
  const records = getRecords();
  return Object.values(records)
    .filter(r => r.student !== exceptName)
    .map(r => String(r.number));
}

els.student.addEventListener('change', () => {
  const student = students.find(s => s.name === els.student.value);
  if (!student) return;
  els.number.value = student.number || '';
  els.size.value = student.size || '';
  els.shirtName.value = student.name.split(' ')[0].toUpperCase();
});

els.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const student = els.student.value;
  const shirtName = els.shirtName.value.trim().toUpperCase();
  const number = els.number.value.trim();
  const size = els.size.value;
  const records = getRecords();

  if (records[student]) {
    els.message.textContent = 'Esse aluno já está cadastrado e bloqueado.';
    return;
  }

  if (usedNumbers().includes(number)) {
    els.message.textContent = `O número ${number} já foi escolhido por outra pessoa.`;
    return;
  }

  if (!confirm(`Confirmar?\n\nAluno: ${student}\nCamisa: ${shirtName}\nNúmero: ${number}\nTamanho: ${size}\n\nDepois disso o cadastro será bloqueado.`)) return;

  records[student] = {
    student,
    shirtName,
    number,
    size,
    createdAt: new Date().toISOString()
  };
  saveRecords(records);

  els.form.reset();
  els.message.textContent = 'Cadastro confirmado e bloqueado 🔒';
  render();
});

function render() {
  const records = getRecords();
  const values = Object.values(records).sort((a, b) => a.student.localeCompare(b.student, 'pt-BR'));
  populateStudents();
  els.counter.textContent = `${values.length}/${students.length}`;

  els.list.innerHTML = values.length
    ? values.map(r => `<div class="person"><div><strong>${escapeHtml(r.student)}</strong><div class="meta">${escapeHtml(r.shirtName)} • Nº ${escapeHtml(r.number)} • ${escapeHtml(r.size)}</div></div><span class="lock">🔒</span></div>`).join('')
    : '<p class="muted">Ninguém cadastrou ainda.</p>';

  els.admin.innerHTML = `
    <table>
      <thead><tr><th>Aluno</th><th>Camisa</th><th>Nº</th><th>Tam.</th><th></th></tr></thead>
      <tbody>
        ${students.map(s => {
          const r = records[s.name];
          return `<tr><td>${escapeHtml(s.name)}</td><td>${r ? escapeHtml(r.shirtName) : '—'}</td><td>${r ? escapeHtml(r.number) : escapeHtml(s.number || '—')}</td><td>${r ? escapeHtml(r.size) : escapeHtml(s.size || '—')}</td><td>${r ? `<button class="small-btn" onclick="unlock('${encodeURIComponent(s.name)}')">Desbloquear</button>` : ''}</td></tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

window.unlock = function(encodedName) {
  const name = decodeURIComponent(encodedName);
  if (!confirm(`Desbloquear o cadastro de ${name}?`)) return;
  const records = getRecords();
  delete records[name];
  saveRecords(records);
  render();
};

els.exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(getRecords(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'camisas-interclasse.json';
  a.click();
  URL.revokeObjectURL(url);
});

els.resetBtn.addEventListener('click', () => {
  if (!confirm('Tem certeza que deseja apagar TODOS os registros deste navegador?')) return;
  localStorage.removeItem('interclasseRecords');
  render();
});

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
}

render();
