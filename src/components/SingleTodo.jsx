import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import "../style.css";
import { TodoContext } from "../context/todoContext";
import { useToast } from "../context/toastContext";

export default function SingleTodo({
  todo,
  handleClickOpen,
  handleEditDialogOpen,
}) {
  const { todos, setTodos } = useContext(TodoContext);
  function showDelete() {
    handleClickOpen(todo);
  }
  function showEditDialog() {
    handleEditDialogOpen(todo);
  }

  const { openAndHideToast } = useToast();

  return (
    <>
      <div className="singleTodo">
        <div className="infoTodo">
          <h3
            style={{
              textDecoration: todo.isCompleted ? "line-through" : "",
            }}
          >
            {todo.title}
          </h3>
          <p>{todo.description}</p>
        </div>
        <Stack direction="row" spacing={1}>
          <IconButton
            aria-label="check"
            className="actionsButton check"
            style={{
              color: todo.isCompleted ? "#fff" : "#0ec40e",
              backgroundColor: todo.isCompleted ? "#0ec40e" : "#fff",
              borderColor: "#0ec40e",
            }}
            onClick={() => {
              const updatedTodos = todos.map((t) =>
                t.id == todo.id ? { ...t, isCompleted: !t.isCompleted } : t
              );
              setTodos(updatedTodos);
              localStorage.setItem("todos", JSON.stringify(updatedTodos));
              openAndHideToast("Todo completed successfully");
            }}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            aria-label="edit"
            className="actionsButton edit"
            onClick={showEditDialog}
            style={{
              color: "#e2c015b1",
              background: "white",
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            className="actionsButton delete"
            onClick={showDelete}
            style={{
              color: "#e21515b1",
              background: "white",
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </div>
    </>
  );
}
