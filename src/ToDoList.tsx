import React, { useState, useEffect } from "react";

/** Interfaces describe the 'shape' of the data without showing implementation of methods or properties */
interface ToDoItem {
  id: number;
  description: string;
  completed: boolean;
}

interface ToDoList {
  tasks: ToDoItem[];
  nextIdNumber: number;
}

function ToDoList() {
  // useState - in typescript you can set the type of the state. It will try to infer the value if not defined
  const [toDoList, setToDoList] = useState<ToDoList | null>(null); // sets the initial state value type
  const [newTaskDescription, setNewTaskDescription] = useState("");

  /**useEffect handles side effects of functional components- in this example however it's designed to only run once
   * - this creates the empty list if it doesn't already exist.
   * - we tell it to run once by having an empty array as it's dependencies - it doesn't have anything to monitor changes of.
   */
  useEffect(() => {
    const storedToDoList = localStorage.getItem("toDoList"); // localStorage.getItem() fetches the item if it exists
    if (storedToDoList) {
       /** we have to parse the date back from a string into an object
        *  then pass it into the state update function 'setToDoList'
       */
      setToDoList(JSON.parse(storedToDoList)); 
    } else {
      const newToDoList: ToDoList = {
        tasks: [],
        nextIdNumber: 0,
      };
      setToDoList(newToDoList); 
      localStorage.setItem("toDoList", JSON.stringify(newToDoList));  
      /**
       *  localStorage.setItem will create the json string, plus we pass in the stringify function
      * + the new to do list item object
       */
    }
  }, []);

  /**
   * Called when form submit button is clicked
   * - creates the new task entry, based on the form values
   * - setToDoList takes the previous state via the '...'
   * - the '!' is specific to typescript and means "I know this value is not null or undefined, so let me use it as if it's not".
   */
  const addTask = () => {
    const newTask = {
      id: toDoList!.nextIdNumber++,
      description: newTaskDescription,
      completed: false,
    };
    setToDoList((prevState) => {
      return {
        ...prevState!,
        tasks: [...prevState!.tasks, newTask],
      };
    });
    setNewTaskDescription("");
  };

  /**
   * This is called when the checkbox is used.
   * It updates the entire list, mapping the tasks out and setting the one with corresponding id complete bool to opposite
   * -Note that we are using 'map' without markup in this example - different use case to using it to generate markup. cool!
   */
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
        tasks: updatedTasks,
      };
    });
  };

  /**
   * This removes the corresponding task via the filter method
   * filter will take all that arent the same as the id and create a new array from them
   */
  const deleteTask = (taskId: number) => {
    setToDoList((prevState) => {
      const updatedTasks = prevState!.tasks.filter(
        (task) => task.id !== taskId
      );
      return {
        ...prevState!,
        tasks: updatedTasks,
      };
    });
  };

  /**
   * This looks at the todoList as the dependency and updates the local storage based on the contents
   */
  useEffect(() => {
    if (toDoList !== null) {
      localStorage.setItem("toDoList", JSON.stringify(toDoList));
    }
  }, [toDoList]);

  return (
    <React.Fragment>
      {/* conditional that will either show the to do list, or show 'loading' markup */}
      {toDoList ? (
        <section className="list-container m-auto relative">
          <div className="logo not-italic font-normal text-3xl leading-none text-gray-900 text-center w-full p-4 bg-brand-yellow">
            done.
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              addTask();
            }}
            className="flex flex-col p-8 bg-brand-pink"
          >
            <input
              className="list-input h-12 w-full text-3xl pl-4 bg-brand-grey"
              type="text"
              value={newTaskDescription}
              onChange={(event) => setNewTaskDescription(event.target.value)}
              placeholder="to do"
            />

            <button
              type="submit"
              className="w-10 h-10 bg-orange-600 mt-8 text-white text-3xl flex justify-center font-black"
            >
              +
            </button>
          </form>
          <div className="list-inner h-full p-8 relative overflow-y-scroll bg-brand-light-grey">
            <ul>
              {/* this maps out all the items in our to do list. 
              map is a really useful function for showing an array */}
              {toDoList.tasks.map((task) => (
                <li
                  key={task.id}
                  className="not-italic font-normal text-3xl flex items-center text-brand-blue"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-8 h-8 mr-5"
                  />
                  <p className={task.completed ? "completed" : ""}>
                    {task.description}
                  </p>
                  {task.completed && (
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="m-0 ml-8 text-brand-red bg-clear"
                    >
                      X
                    </button>
                  )}
                </li>
              ))}
            </ul>
            

            </div>
            <a
              href="https://www.linkedin.com/in/stewart-tuckwood-522808184/"
              target="_blank"
              className="linkedIn-link absolute font-normal text-sm"
            >
              developed by Stewart Tuckwood
            </a>
      
        </section>
      ) : (
        <p>Loading to-do list...</p>
      )}
    </React.Fragment>
  );
}

export default ToDoList;
