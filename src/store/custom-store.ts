import { SetStateAction, useSyncExternalStore } from "react";

interface Atom<T> {
    getValue(): T;
    setValue(value: T): void;
    subscribe(cb: () => void): () => void;
}

export const createAtom = <T>(defaultValue: T): Atom<T> => {
    let value = defaultValue;

    const listeners = new Set<() => void>();

    return {
        getValue: () => {
            return value;
        },
        setValue: (newValue: T) => {
            value = newValue;
            listeners.forEach((listener) => {
                listener();
            })
        },
        subscribe: (cb: () => void) => {
            listeners.add(cb);
            return () => {
                listeners.delete(cb);
            }
        }
    }
}

export const useAtom = <T>(atom: Atom<T>): [value: T, setValue: (action: SetStateAction<T>) => void] => {

    const value = useSyncExternalStore(atom.subscribe, atom.getValue);

    const setValue = (action: SetStateAction<T>): void => {
        if (isActionFunction(action)) {
            atom.setValue(action(atom.getValue()));
        } else {
            setValue(action);
        }
    }

    return [value, setValue];
};

const isActionFunction = <T>(action: SetStateAction<T>): action is (last: T) => T => {
    return typeof action === 'function';
}