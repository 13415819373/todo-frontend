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

// 上传图片：带口令鉴权，Worker 会校验口令 + 限大小
async function upload() {
  const pw = document.getElementById("pw").value.trim();
  const input = document.getElementById("fileInput");
  if (!pw) { alert("请输入上传口令"); return; }
  if (!input.files.length) { alert("请选择一张图片"); return; }

  const fd = new FormData();
  fd.append("file", input.files[0]);

  const res = await fetch(`${API}/api/upload`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${pw}` },
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) {
    alert(data.error || "上传失败");
    return;
  }
  // 展示上传成功的图片 + 显示下载按钮
  document.getElementById("imgBox").innerHTML =
    `<img src="${API}${data.url}" style="max-width:300px;border:1px solid #ccc;" />`;
  window.__imgUrl = `${API}${data.url}`;
  document.getElementById("dlBtn").style.display = "inline-block";
}

// 下载图片：fetch 拿 blob 再下载（跨域也能正常存成文件，不产生流量费）
async function downloadImg() {
  if (!window.__imgUrl) return;
  const res = await fetch(window.__imgUrl);
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "uploaded-image.jpg";
  a.click();
  URL.revokeObjectURL(a.href);
}
