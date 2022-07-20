import styles from './index.module.css';

import { FormEvent, useState, FormEventHandler, useMemo, useEffect, useCallback, createContext, useContext, useRef } from "react";

function fromForm<T>(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  if (!form.checkValidity()) return;
  const formData = new FormData(form);
  const result: Partial<T> = {};
  formData.forEach((value, key) => result[key] = value);
  form.reset();
  return result;
}

function useList<T>(init: T[], create: (base?: Partial<T>) => T) {
  const [list, setList] = useState(init);
  const add = (item?: Partial<T>) => {
    list.push(create(item));
    setList([...list]);
  }
  const remove = (index: number) => () => {
    list.splice(index, 1);
    setList([...list]);
  }
  const update = (index: number, item: Partial<T>) => {
    list[index] = create({ ...list[index], ...item });
    setList([...list]);
  }
  const set = setList;
  const clear = () => setList([]);
  const reset = () => setList(init);
  return { list, add, remove, update, clear, reset, set };
}

interface Task {
  text: string;
  checked: boolean;
}

const TASKS: Task[] = [
  { text: 'Learn HTML', checked: true },
  { text: 'Learn CSS', checked: false },
  { text: 'Learn React', checked: false },
  { text: 'Learn Next', checked: false },
];

const Injector = createContext(new Map());

function useInjector<T>(factory: () => T, dependancies: any[]) {
  const ctx = useContext(Injector);
  const deps = useRef(dependancies);
  if (JSON.stringify(deps) !== JSON.stringify(dependancies) || !ctx.has(deps)) {
    ctx.set(deps, factory());
  }
  return ctx.get(deps);
}

const test = {};
const getTest = (address: string) => {
  if (!test[address]) {
    console.log('SET');
    test[address] = address;
  }
  console.log('GET');
  return test[address];
}

// TODO: update with dependancies
const useTest = (address: string) => {
  return useInjector(() => getTest(address), [address]);
}

function TaskLists() {
  useTest('ell')
  // Properties
  const createTask = (task: Partial<Task>): Task => ({ text: '', checked: false, ...task});
  const { list: tasks, add, remove, update } = useList(TASKS, createTask);
  
  const save: FormEventHandler<HTMLFormElement> = (event) => {
    const task = fromForm<Task>(event);
    if (!task) return;
    add(task);
  }
  
  // Pipes / ng-template
  const taskList = tasks.map((task, i) => {
    const props: TaskItemProps = { i, task, update, remove };
    return <TaskItem key={i} {...props} />;
  });
  
  return (
    <>
      <h2>My Tasks for Today:</h2>
      <ul>
        {taskList}
      </ul>
      <form onSubmit={save}>
        <label htmlFor="task-text">Task:</label>
        <input id="task-text" type="text" name="text" required />
        <button type="submit">Add Task</button>
      </form>
    </>
  );
}

interface TaskItemProps {
  i: number;
  task: Task;
  update: (index: number, task: Partial<Task>) => void;
  remove: (index: number) => () => void;
}

function TaskItem({ update, remove, task, i }: TaskItemProps) {
  const [editMode, setEditMode] = useState(false);
  const checked = task.checked ? 'checked' : 'unchecked';
  if (editMode) {
    const save: FormEventHandler<HTMLFormElement> = (event) => {
      const task = fromForm(event);
      if (!task) return;
      update(i, task);
      setEditMode(false);
    }
    const reset: FormEventHandler<HTMLFormElement> = (event) => {
      setEditMode(false);
    }
    const id = `text-${i}`;
    return (
      <li>
        <form onSubmit={save} onReset={reset}>
          <input id={id} type="text" name="text" defaultValue={task.text} required/>
          <button type="reset" onClick={() => setEditMode(false)}>Cancel</button>
          <button type="submit">Save</button>
        </form>
      </li>
    )
  } else {
    // Prevent 
    const onCheck = () => update(i, { checked: !task.checked });
    const id = `checked-${i}`;
    return (
      <li className={checked}>
        <input id={id} type="checkbox" checked={task.checked} onChange={onCheck} />
        <label htmlFor={id}>{task.text}</label>
        <button onClick={() => setEditMode(true)}>Edit</button>
        <button onClick={remove(i)}>Remove</button>
      </li>
    )
  }
}


export function Index() {
  return (
    <Injector.Provider value={new Map()}>
      <TaskLists/>;
    </Injector.Provider>
  )
}

export default Index;
