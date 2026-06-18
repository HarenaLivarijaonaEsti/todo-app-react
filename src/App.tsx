import { useEffect, useState } from "react";
import TodoItem from "./components/TodoItem";
import { Construction } from "lucide-react";
type Priority = "Urgente" | "Moyenne" | "Basse" | "Terminée";

type Todo = {
  id: number;
  text: string;
  priority: Priority;
  completed: boolean;
};

function App() {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("Moyenne");

  const savedTodos = localStorage.getItem("todos");
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : [];
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<Priority | "Toutes">("Toutes");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    // Logic to add a new todo item
    if (input.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority,
      completed: false,
    };

    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    setInput("");
    setPriority("Moyenne");
    console.log(newTodos);
  }

  let filteredTodos: Todo[];

  if (filter === "Toutes") {
    filteredTodos = todos;
  } else {
    filteredTodos = todos.filter((todo) => todo.priority === filter);
  }

  const urgentCount = todos.filter(
    (todo) => todo.priority === "Urgente",
  ).length;
  const mediumCount = todos.filter(
    (todo) => todo.priority === "Moyenne",
  ).length;
  const lowCount = todos.filter((todo) => todo.priority === "Basse").length;
  const totalCount = todos.length;

  function deleteTodo(id: number) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  }

  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());

  function toggleSelectTodo(id: number) {
    const newSelectedTodos = new Set(selectedTodos);
    if (newSelectedTodos.has(id)) {
      newSelectedTodos.delete(id);
    } else {
      newSelectedTodos.add(id);
    }
    setSelectedTodos(newSelectedTodos);
  }

function finishSelectedTodos() {
  const newTodos = todos.map((todo) => {
    if (selectedTodos.has(todo.id)) {
      return { ...todo, completed: true };
    }
    return todo;
  });

  setTodos(newTodos);
  setSelectedTodos(new Set());
}

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 mx-2 sm:mx-4 md:mx-auto flex flex-col gap-4 my-10 md:my-15 min-h-[90vh] bg-base-300 p-3 md:p-5 rounded-2xl">
          <div className="flex gap-4">
            <input
              type="text"
              className="input w-full"
              placeholder="Tâche"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <select
              className="select w-full"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="Urgente">Urgente</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Basse</option>
            </select>
            <button onClick={addTodo} className="btn btn-primary">
              Ajouter
            </button>
          </div>
          <div className="space-y-2 flex-1 h-fit">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-4 my-4">
                <button
                  className={`btn btn-soft ${filter === "Toutes" ? "btn-primary" : ""}`}
                  onClick={() => setFilter("Toutes")}
                >
                  Toutes ({totalCount})
                </button>
                <button
                  className={`btn btn-soft ${filter === "Urgente" ? "btn-error" : ""}`}
                  onClick={() => setFilter("Urgente")}
                >
                  Urgente ({urgentCount})
                </button>
                <button
                  className={`btn btn-soft ${filter === "Moyenne" ? "btn-warning" : ""}`}
                  onClick={() => setFilter("Moyenne")}
                >
                  Moyenne ({mediumCount})
                </button>
                <button
                  className={`btn btn-soft ${filter === "Basse" ? "btn-success" : ""}`}
                  onClick={() => setFilter("Basse")}
                >
                  Basse ({lowCount})
                </button>
              </div>
              <button
                onClick={finishSelectedTodos}
                className="btn btn-primary"
                disabled={selectedTodos.size === 0}
              >
                Finir la sélection ({selectedTodos.size})
              </button>
            </div>

            {filteredTodos.length > 0 ? (
              <ul className="divide-y devide-primary/20">
                {filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    isSelected={selectedTodos.has(todo.id)}
                    onDelete={() => deleteTodo(todo.id)}
                    onToggleSelect={() => toggleSelectTodo(todo.id)}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex justify-center items-center flex-col p-5">
                <div>
                  <Construction
                    strokeWidth={1}
                    className="w-40 h-40 text-primary"
                  />
                </div>
                <p className="text-sm">Aucune tache pour le moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
