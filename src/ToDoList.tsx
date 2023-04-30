import React, { useState, useEffect } from "react";

interface ToDoItem {
  id: number;
  description: string;
  completed: boolean;
}

interface ToDoList {
  // title: string;
  tasks: ToDoItem[];
  nextIdNumber: number;
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
        // title: "To-Do",
        tasks: [],
        nextIdNumber: 0
      };
      setToDoList(newToDoList);
      localStorage.setItem("toDoList", JSON.stringify(newToDoList));
    }
  }, []);

  const addTask = () => {
    const newTask = {
      id: toDoList!.nextIdNumber ++,
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
    <React.Fragment>
      {toDoList ? (
        <section className="list-container">
          <div className="logo">done.</div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              addTask();
            }}
          >

              <input
              className="list-input"
                type="text"
                value={newTaskDescription}
                onChange={(event) => setNewTaskDescription(event.target.value)}
                placeholder="to do"
              />

            <button type="submit">+</button>
          </form>
          <div className="list-inner">
          <ul>
            {toDoList.tasks.map((task) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <p className={task.completed ? "completed" : ""}>{task.description}</p>
                {task.completed && (
                  <button onClick={() => deleteTask(task.id)}>X</button>
                )}
              </li>
            ))}
          </ul>
          <a href="https://www.linkedin.com/in/stewart-tuckwood-522808184/" target="_blank" className="linkedIn-link">developed by Stewart Tuckwood</a>
          </div>
          
        </section>
      ) : (
        <p>Loading to-do list...</p>
      )}
    </React.Fragment>
  );
}

export default ToDoList;
