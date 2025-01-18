import React, { useContext, useEffect, useState, useMemo } from "react";
import SingleTodo from "./SingleTodo";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import { TodoContext } from "../context/todoContext";
import { v4 as uuid4 } from "uuid";
import {  useToast } from "../context/toastContext";
export default function Todo() {
  const [newTodo, setNewTodo] = useState("");
  const [categoryTodo, setCategoryTodo] = useState("All");
  const { todos, setTodos } = useContext(TodoContext);
  const [open, setOpen] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(null);
  const [dialogEdit, setDialogEdit] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newInfo, setNewInfo] = useState({
    title: "",
    description: "",
  });
  const { openAndHideToast } = useToast();
  const buttons = [
    <Button
      onClick={() => {
        setCategoryTodo("All");
      }}
    >
      All
    </Button>,
    <Button
      onClick={() => {
        setCategoryTodo("Completed");
      }}
    >
      Completed
    </Button>,
    <Button
      onClick={() => {
        setCategoryTodo("Incomplete");
      }}
    >
      Incomplete
    </Button>,
  ];

  //delete functions
  function handleDeleteConfirm() {
    const newTodos = todos.filter((t) => t.id !== dialogDelete.id);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
    openAndHideToast("To-do successfully removed from the list");
  }
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = (todo) => {
    setDialogDelete(todo);
    setOpen(true);
  };
  useEffect(() => {
    const storageTodos = JSON.parse(localStorage.getItem("todos")) ?? [];
    setTodos(storageTodos);
  }, []);

  // ==//delete functions // ==

  function handleEditConfirm() {
    const newTodos = todos.map((t) =>
      t.id == dialogEdit.id
        ? { ...t, title: newInfo.title, description: newInfo.description }
        : t
    );
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
    openAndHideToast("Task updated successfully");
  }

  const handleEditDialogOpen = (todo) => {
    setDialogEdit(todo);
    setNewInfo({ ...todo, title: todo.title, description: todo.description });
    setEditDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const incompletedActivities = useMemo(() => {
    return todos
      .filter((todo) => todo.isCompleted === false)
      .map((todo) => (
        <SingleTodo
          key={todo.id}
          todo={todo}
          handleClickOpen={handleClickOpen}
          handleEditDialogOpen={handleEditDialogOpen}
        />
      ));
  }, [todos]);

  const completedActivities = useMemo(() => {
    return todos
      .filter((todo) => todo.isCompleted)
      .map((todo) => (
        <SingleTodo
          key={todo.id}
          todo={todo}
          handleClickOpen={handleClickOpen}
          handleEditDialogOpen={handleEditDialogOpen}
        />
      ));
  }, [todos]);

  const allActivities = useMemo(() => {
    return todos.map((todo) => (
      <SingleTodo
        key={todo.id}
        todo={todo}
        handleClickOpen={handleClickOpen}
        handleEditDialogOpen={handleEditDialogOpen}
      />
    ));
  }, [todos]);

  function categoryTodoChange() {
    switch (categoryTodo) {
      case "All":
        return allActivities;
      case "Completed":
        return completedActivities;
      case "Incomplete":
        return incompletedActivities;
      default:
        return allActivities;
    }
  }
  return (
    <>
      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleEditDialogClose();
          },
        }}
      >
        <DialogTitle>Update Your To-Do List</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Want to make some changes? Edit the title and description below and
            hit save to update your list.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={newInfo.title}
            onChange={(e) => {
              setNewInfo({ ...newInfo, title: e.target.value });
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="Description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={newInfo.description}
            onChange={(e) => {
              setNewInfo({ ...newInfo, description: e.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button
            type="submit"
            onClick={() => {
              handleEditConfirm();
              handleEditDialogClose();
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      {/* ==// Edit Dialog //== */}
      {/* remove dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to delete this? Once deleted, it cannot be
            restored.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button
            onClick={() => {
              handleDeleteConfirm();
              handleClose();
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {/* ==// remove dialog //== */}
      <div className="todoContainer">
        <h1>Todo App</h1>
        <hr />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "& > *": {
              m: 1,
            },
          }}
        >
          <ButtonGroup size="small" aria-label="Small button group">
            {buttons}
          </ButtonGroup>
        </Box>
        {categoryTodoChange()}
        <div className="addTodo">
          <input
            type="text"
            placeholder="Add Todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            onClick={() => {
              const updatedTodos = [
                ...todos,
                {
                  id: uuid4(),
                  title: newTodo,
                  description: "",
                  isCompleted: false,
                },
              ];
              setTodos(updatedTodos);
              localStorage.setItem("todos", JSON.stringify(updatedTodos));
              setNewTodo("");
              openAndHideToast("Task added successfully");
            }}
            style={{
              backgroundColor: !newTodo.trim() ? "#d3d3d3" : "#0000ff6e",
              color: !newTodo.trim() ? "#808080" : "white",
              cursor: !newTodo.trim() ? "not-allowed" : "pointer",
            }}
            disabled={newTodo.trim() === "" || !newTodo}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}
