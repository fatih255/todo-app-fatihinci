import { UseArrayCounter } from "utils";
import { todoType, todoTypeOne } from "../types";

const APIBASE_URL = "https://631e2890cc652771a4928394.mockapi.io";

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const api = {

    getAll: async (setState: React.Dispatch<React.SetStateAction<todoType>>, status: todoType["status"] = 'loading') => {
        setState({ todos: null, status: status })
        const todos = await (await fetch(`${APIBASE_URL}/todos`, { method: "GET" })).json()
        setState({ todos, status: 'success' })
    },
    deleteOne: async (id: string | string[], state: todoType, setState: React.Dispatch<React.SetStateAction<todoType>>, status: todoType["status"] = 'deleting', success: todoType["status"] = "success-deleting") => {

        if (typeof id === "string") {
            typeof id === "string" && setState({ todos: state.todos, status: status, updatingId: id })
            await (await fetch(`${APIBASE_URL}/todos/${id}`, { method: "DELETE" })).json();

            state.todos && setState({ todos: state.todos.filter((todo) => todo.id !== id), status: success, updatingId: id })
        }
        if (typeof id === "object") {
            setState({ todos: state.todos, status: status, updatingId: id })
            UseArrayCounter(
                {
                    array: id,
                    ms: 500,
                    onCounting: async ({ value, store }) => {
                        typeof id === "string" && setState({ todos: state.todos, status: status, updatingId: value?.toString() })
                        await fetch(`${APIBASE_URL}/todos/${value}`, { method: "DELETE" });
                        // state.todos && setState({ todos: state.todos.filter((todo) => todo.id !== value), status: success, updatingId: value?.toString() })
                        store(value)
                    },
                    onFinished: (storedData) => {
                        console.log(storedData)
                        state.todos && setState({ todos: state.todos.filter(todo => !id.includes(todo.id)), status: success, updatingId: id })
                    },
                })

        }



    },
    update: async (id: string | string[], body: todoTypeOne, state: todoType, setState: React.Dispatch<React.SetStateAction<todoType>>, status: todoType["status"] = 'updating', success: todoType["status"] = "success") => {

        if (typeof id === "string") {
            setState({ todos: state.todos, status: status, updatingId: state.updatingId })
            const updatedTodo = await (await fetch(`${APIBASE_URL}/todos/${id}`, { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, method: "PUT" })).json()
            if (state.todos && updatedTodo) {
                const changedValueIndex = state.todos.findIndex(todo => todo.id === id);
                state.todos[changedValueIndex] = updatedTodo;
                setState({ todos: [...state.todos], status: success, updatingId: state.updatingId })
            }
        }
  
        if (typeof id === "object") {

            setState({ todos: state.todos, status: status, updatingId: id })
            UseArrayCounter(
                {
                    array: id,
                    ms: 500,
                    onCounting: async ({ value, store }) => {
                        await fetch(`${APIBASE_URL}/todos/${value}`, { method: "PUT" });
                        // state.todos && setState({ todos: state.todos.filter((todo) => todo.id !== value), status: success, updatingId: value?.toString() })
                        store(value)
                    },
                    onFinished: (storedData) => {
                        const ids = id as string[];

                        const updatedNotesIndexes = ids.map((noteID) => {
                            if (state.todos) return state.todos.findIndex(todo => todo.id === noteID)
                        })
                        updatedNotesIndexes.map((noteIndex: any) => {
                            if (state.todos) state.todos[noteIndex].isCompleted = true;
                        })

                        state.todos && setState({ todos: [...state.todos], status: success, updatingId: state.updatingId })
                        

                    },
                })

        }
    },
    create: async (body: todoTypeOne, state: todoType, setState: React.Dispatch<React.SetStateAction<todoType>>, status: todoType["status"] = 'creating') => {
        setState({ todos: state.todos, status: status })
        const newTodo = await (await fetch(`${APIBASE_URL}/todos`, { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, method: 'POST' })).json();
        if (newTodo && state.todos) {
            state.todos[state?.todos.length] = newTodo;
            setState({ todos: [...state.todos], status: 'success' })
        }
    }
};


export default api