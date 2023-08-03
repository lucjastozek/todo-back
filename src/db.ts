import moment from "moment";

export interface DbItem {
  description: string;
  creationDate: string;
  dueDate: string;
  status: "new" | "in progress" | "complete";
}

export interface DbItemWithId extends DbItem {
  id: number;
}

const db: DbItemWithId[] = [];

/** Variable to keep incrementing id of database items */
let idCounter = 0;

function random(array: string[]) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

/**
 * Adds in some dummy database items to the database
 *
 * @param n - the number of items to generate
 * @returns the created items
 */
export const addDummyDbItems = (n: number): DbItemWithId[] => {
  const verbs = [
    "walk",
    "write",
    "read",
    "clean",
    "cook",
    "play",
    "study",
    "watch",
    "code",
    "exercise",
  ];

  const adjectives = [
    "quick",
    "lazy",
    "tired",
    "happy",
    "sad",
    "busy",
    "bored",
    "excited",
    "calm",
    "angry",
  ];

  const nouns = [
    "dog",
    "cat",
    "book",
    "room",
    "food",
    "movie",
    "computer",
    "garden",
    "friend",
    "phone",
  ];

  const createdSignatures: DbItemWithId[] = [];
  for (let count = 0; count < n; count++) {
    const createdSignature = addDbItem({
      description: `${random(verbs)} the ${random(adjectives)} ${random(
        nouns
      )}`,
      creationDate: moment()
        .add(-Math.floor(Math.random() * 5), "days")
        .format("DD/MM/YYYY"),
      dueDate: moment()
        .add(Math.floor(Math.random() * 10), "days")
        .format("DD/MM/YYYY"),
      status: "new",
    });
    createdSignatures.push(createdSignature);
  }
  return createdSignatures;
};

/**
 * Adds in a single item to the database
 *
 * @param data - the item data to insert in
 * @returns the item added (with a newly created id)
 */
export const addDbItem = ({
  description,
  creationDate,
  dueDate,
  status,
}: DbItem): DbItemWithId => {
  const newEntry: DbItemWithId = {
    id: ++idCounter,
    description: description ?? "do something",
    creationDate: creationDate ?? moment().format("DD/MM/YYYY"),
    dueDate: dueDate ?? moment().add(1, "day").format("DD/MM/YYYY"),
    status: status ?? "new",
  };
  db.push(newEntry);
  return newEntry;
};

/**
 * Deletes a database item with the given id
 *
 * @param id - the id of the database item to delete
 * @returns the deleted database item (if originally located),
 *  otherwise the string `"not found"`
 */
export const deleteDbItemById = (id: number): DbItemWithId | "not found" => {
  const idxToDeleteAt = findIndexOfDbItemById(id);
  if (typeof idxToDeleteAt === "number") {
    const itemToDelete = getDbItemById(id);
    db.splice(idxToDeleteAt, 1); // .splice can delete from an array
    return itemToDelete;
  } else {
    return "not found";
  }
};

/**
 * Finds the index of a database item with a given id
 *
 * @param id - the id of the database item to locate the index of
 * @returns the index of the matching database item,
 *  otherwise the string `"not found"`
 */
const findIndexOfDbItemById = (id: number): number | "not found" => {
  const matchingIdx = db.findIndex((entry) => entry.id === id);
  // .findIndex returns -1 if not located
  if (matchingIdx !== -1) {
    return matchingIdx;
  } else {
    return "not found";
  }
};

/**
 * Find all database items
 * @returns all database items from the database
 */
export const getAllDbItems = (): DbItemWithId[] => {
  return db;
};

/**
 * Locates a database item by a given id
 *
 * @param id - the id of the database item to locate
 * @returns the located database item (if found),
 *  otherwise the string `"not found"`
 */
export const getDbItemById = (id: number): DbItemWithId | "not found" => {
  const maybeEntry = db.find((entry) => entry.id === id);
  if (maybeEntry) {
    return maybeEntry;
  } else {
    return "not found";
  }
};

/**
 * Applies a partial update to a database item for a given id
 *  based on the passed data
 *
 * @param id - the id of the database item to update
 * @param newData - the new data to overwrite
 * @returns the updated database item (if one is located),
 *  otherwise the string `"not found"`
 */
export const updateDbItemById = (
  id: number,
  newData: Partial<DbItem>
): DbItemWithId | "not found" => {
  const idxOfEntry = findIndexOfDbItemById(id);
  // type guard against "not found"
  if (typeof idxOfEntry === "number") {
    return Object.assign(db[idxOfEntry], newData);
  } else {
    return "not found";
  }
};
