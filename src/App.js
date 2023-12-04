import { useEffect, useState } from "react";
import { EditableText } from "@blueprintjs/core";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newtitle, setNewTitle] = useState("");

  // Fetching todo list on page load;
  useEffect(() => {
    const todoData = async () => {
      setLoading(true)
      const response = await fetch("https://jsonplaceholder.typicode.com/todos");
      const json = await response.json();
      setTodos(json)
      setLoading(false)
    }
    todoData()

  }, [])
 
  // adding todos using POST Method
  const addTodo = () => {
    const title = newtitle.trim();

    fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify({
        title,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos([...todos, data]);
        setNewTitle("")
        console.log('Add Todo Successfully');
      });
  };

  // updating todo
  const updateTodo = (id) => {
    const todo = todos.find(todo => todo.id == id)

    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(response => response.json())
      .then(() => {
        console.log('update successful')
      })
  }

  const onChangeHandle = (id, key, value) => {
    setTodos(values => {
      return values.map(item =>
      item.id === id ? {...item, [key]: value} : item  
      )
    })
  }

// Delete Todo
const deleteTodo = id => {
  fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(() => {
      setTodos(values => {
        return values.filter(item => item.id !== id)
      })
      console.log("Delete Successfully")
    })
}



  return (
    <div className="App">
      <div className="todo-form">
        <div className="form-input">
          <input
            type="text"
            value={newtitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Write here...?"
          />
          <button onClick={addTodo}>
            Add
          </button>
        </div>
      </div>
      <div className="items">
        <h1>All Todo</h1>
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          todos.slice(0).reverse().map((item) => (
            <li className="item" key={item.id}>
              <EditableText value={item.title}
                onChange={value => onChangeHandle(item.id, 'title', value)}
              />
              <div className="function-wrapper">
                <span  onClick={() => updateTodo(item.id)}>Update</span>
                <span  onClick={() => deleteTodo(item.id)}>Delete</span>
              </div>
            </li>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
