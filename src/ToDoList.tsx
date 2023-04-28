import React, { useState, useEffect } from "react";

interface ToDoItem {
  id: number;
  description: string;
  completed: boolean;
}

interface ToDoList {
  title: string;
  tasks: ToDoItem[];
}

function ToDoList() {
  const [toDoList, setToDoList] = useState<ToDoList | null>(null);
  const [newTaskDescription, setNewTaskDescription] = useState("");

  useEffect(() => {
    const storedToDoList = localStorage.getItem("toDoList");
    if (storedToDoList) {
      setToDoList(JSON.parse(storedToDoList));
    } else {
      const newToDoList: ToDoList = {
        title: "My To-Do List",
        tasks: []
      };
      setToDoList(newToDoList);
      localStorage.setItem("toDoList", JSON.stringify(newToDoList));
    }
  }, []);

  const addTask = () => {
    const newTask = {
      id: toDoList!.tasks.length + 1,
      description: newTaskDescription,
      completed: false
    };
    setToDoList((prevState) => {
      return {
        ...prevState!,
        tasks: [...prevState!.tasks, newTask]
      };
    });
    setNewTaskDescription("");
  };

  const toggleTask = (taskId: number) => {
    setToDoList((prevState) => {
      const updatedTasks = prevState!.tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      return {
        ...prevState!,
        tasks: updatedTasks
      };
    });
  };

  const deleteTask = (taskId: number) => {
    setToDoList((prevState) => {
      const updatedTasks = prevState!.tasks.filter((task) => task.id !== taskId);
      return {
        ...prevState!,
        tasks: updatedTasks
      };
    });
  };

  useEffect(() => {
    if (toDoList !== null) {
      localStorage.setItem("toDoList", JSON.stringify(toDoList));
    }
  }, [toDoList]);

  return (
    <div>
      {toDoList ? (
        <div>
          <h1>{toDoList.title}</h1>
          <ul>
            {toDoList.tasks.map((task) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                {task.description} {task.completed ? "(completed)" : ""}
                {task.completed && (
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                )}
              </li>
            ))}
          </ul>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              addTask();
            }}
          >
            <label>
              New task:
              <input
                type="text"
                value={newTaskDescription}
                onChange={(event) => setNewTaskDescription(event.target.value)}
              />
            </label>
            <button type="submit">Add task</button>
          </form>
        </div>
      ) : (
        <p>Loading to-do list...</p>
      )}
    </div>
  );
}

export default ToDoList;
