import axios from 'axios';
import React, { useEffect, useState } from 'react';
import bgImg from "./IMG.jpg"
function ToDo() {
    const [usertask, setUserTask] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");

    const addTask = () => {
        axios.post("https://iidt-basic-todofullstack.onrender.com/addTask", { title: usertask, dueDate: dueDate, status: false })
            .then((res) => {
                console.log(res.data);
                fetchTasks();
                setUserTask(""); // Clear the task input field
                setDueDate("");
            });
    }

    const fetchTasks = () => {
        axios.get("https://iidt-basic-todofullstack.onrender.com/")
            .then((res) => {
                console.log(res.data);
                setTasks(res.data);
            })
            .catch((error) => {
                console.error("Error fetching tasks:", error);
            });
    }

    const deleteTask = (taskId) => {
        axios.delete(`https://iidt-basic-todofullstack.onrender.com/deleteTask/${taskId}`)
            .then((res) => {
                console.log(res.data);
                fetchTasks();
            })
            .catch((error) => {
                console.error("Error deleting task:", error);
            });
    }

    const toggleTaskStatus = (taskId, currentStatus) => {
        const newStatus = !currentStatus; // Toggle the status
        axios.put(`https://iidt-basic-todofullstack.onrender.com/updateTaskStatus/${taskId}`, { status: newStatus })
            .then((res) => {
                console.log(res.data);
                fetchTasks();
            })
            .catch((error) => {
                console.error("Error updating task status:", error);
            });
    }

    const handleEditTask = (taskId, currentTitle) => {
        setEditingTaskId(taskId);
        setEditedTitle(currentTitle);
    }

    const saveEditedTitle = () => {
        axios.put(`https://iidt-basic-todofullstack.onrender.com/updateTaskTitle/${editingTaskId}`, { title: editedTitle })
            .then((res) => {
                console.log(res.data);
                fetchTasks();
                setEditingTaskId(null);
                setEditedTitle("");
            })
            .catch((error) => {
                console.error("Error updating task title:", error);
            });
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container" style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', minHeight: '97.5vh', minWidth: '98vw' }}>
            <div className="container mt-3 input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Task Name"
                    aria-label="Task Name"
                    aria-describedby="button-addon2"
                    onChange={(e) => { setUserTask(e.target.value) }}
                    value={usertask}
                />
                <input
                    type="date"
                    className="form-control"
                    onChange={(e) => setDueDate(e.target.value)}
                    value={dueDate}
                />
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={addTask}
                    id="button-addon2"
                >
                    Add Task
                </button>
            </div>

            <ul className="list-group">
                {tasks.map((task) => (
                    <li className="list-group-item" key={task._id}>
                        {editingTaskId === task._id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                />
                                <button onClick={saveEditedTitle}>Save</button>
                            </div>
                        ) : (
                            <span
                                style={{ cursor: "pointer", textDecoration: task.status ? "line-through" : "none" }}
                                onClick={() => toggleTaskStatus(task._id, task.status)}
                            >
                                {task.title} - {formatDate(task.dueDate)}
                            </span>
                        )}
                        <button
                            className="btn btn-danger btn-sm float-end"
                            onClick={() => deleteTask(task._id)}
                        >
                            Delete
                        </button>
                        <button
                            className="btn btn-primary btn-sm float-end"
                            onClick={() => handleEditTask(task._id, task.title)}
                        >
                            Edit
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ToDo;
