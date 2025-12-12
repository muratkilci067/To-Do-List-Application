export function saveTasks(taskList) {
  localStorage.setItem('taskList', JSON.stringify(taskList));
}

export function loadTasks() {
  return JSON.parse(localStorage.getItem('taskList')) || [];
}
