import { useState } from "react";
import Todo from "./components/Todo";
import "./App.css";
import { TodoContext } from "./context/todoContext";

import { ToastProvider } from "./context/toastContext";

function App() {
  const [todos, setTodos] = useState([]);

  return (
    <>
      <ToastProvider>
        <TodoContext.Provider value={{ todos, setTodos }}>
          <Todo />
        </TodoContext.Provider>
      </ToastProvider>
    </>
  );
}

export default App;
