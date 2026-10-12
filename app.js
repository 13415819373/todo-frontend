// 线上地址：已部署的 Worker
const API = "https://todo-worker.1794722385.workers.dev";

async function loadTodos() {
  const res = await fetch(`${API}/api/todos`);
  const list = await res.json();
  document.getElementById("list").innerHTML = list
    .map((t) => `<li>${t.title}</li>`)
    .join("");
}

async function addTodo() {
  const input = document.getElementById("input");
  const title = input.value.trim();
  if (!title) return;
  await fetch(`${API}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  input.value = "";
  loadTodos();
}

loadTodos();
